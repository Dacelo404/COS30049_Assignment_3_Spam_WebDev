import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from scipy.sparse import hstack
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import io
from utils import logger

nltk.download('punkt')
nltk.download('stopwords')

STOP_WORDS = set(stopwords.words('english'))
SUSP_WORDS = ["free", "win", "offer", "get", "click", "buy", "prize", "cash", "forwarded", "order", "new", "want", "money"]
LINK_WORDS = ["url", "message", "www", "http", "com", "net", "bit", "ly", "link"]

class Model:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=5000)
        self.scaler = StandardScaler()
        self.model = LogisticRegression(random_state=42, class_weight='balanced')

    def clean_text(self, words):
        tokens = word_tokenize(words)
        cleaned = [word for word in tokens if word not in STOP_WORDS and word.isalpha()]
        return " ".join(cleaned)

    def process_data(self, df):
        # Check if data has been input as a dataframe
        if (not isinstance(df,pd.DataFrame)):
            raise Exception("Input data has not been converted into dataframe")
        
        # Remove Subject: prefix and convert all text to lowercase
        df["text"] = df["text"].str.lower()
        df["text"] = df["text"].str.removeprefix("subject:")
        
        # Remove duplicates
        df = df.dropna().drop_duplicates()
        
        # Count the length of the email & how many characters
        df["num_links"] = df["text"].str.count(r"http")
        df["email_length"] = df["text"].str.len()

        # Clean text
        df["clean_text"] = df["text"].apply(self.clean_text)
        df = df[df["clean_text"].str.strip() != ""]
        df["tokens"] = df["clean_text"].apply(word_tokenize)
        df.drop("text", axis=1, inplace=True)

        df["text_length"] = df["clean_text"].str.split().str.len()

        #Count categories of words
        df["num_bad_words"] = 0
        for word in SUSP_WORDS:
            df["num_bad_words"] += df["clean_text"].str.count(word)

        df["bad_word_frequency"] = (df["num_bad_words"] / df["text_length"]) * 100

        df["num_web_related_words"] = 0
        for word in LINK_WORDS:
            df["num_web_related_words"] += df["clean_text"].str.count(word)

        df["web_word_frequency"] = (df["num_web_related_words"] / df["text_length"]) * 100
        return df

    def train(self, df):
        #Loading & preprocessing
        df = self.process_data(df)

        #Training the model
        X_text = self.vectorizer.fit_transform(df["clean_text"])
        y = df["spam"]

        numerical_features = df[[
            'num_links', 'email_length', 'text_length',
            'num_bad_words', 'bad_word_frequency',
            'num_web_related_words', 'web_word_frequency'
        ]]
        numerical_scaled = self.scaler.fit_transform(numerical_features)

        X_combined = hstack([X_text, numerical_scaled])
        X_train, X_test, y_train, y_test = train_test_split(
            X_combined, y, test_size=0.2, random_state=42, stratify=y
        )

        self.model.fit(X_train, y_train)

        joblib.dump((self.model, self.vectorizer, self.scaler),'AI_model.pkl')
        print("Data trained!\n")

        # Evaluate model
        y_pred = self.model.predict(X_test)
        print("\n=== Logistic Regression Model Performance ===")
        print("Accuracy:", accuracy_score(y_test, y_pred))
        print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
        print("\nClassification Report:\n", classification_report(y_test, y_pred))

        return
    
    def initialise(self, file):
        self.model, self.vectorizer, self.scaler = joblib.load("AI_model.pkl")
        
        #Turn uploaded file back into csv
        csv = file.file.read()
        df = pd.read_csv(io.BytesIO(csv))

        df = self.process_data(df)

        # Vectorize and scale features
        X_text = self.vectorizer.transform(df["clean_text"])
        numerical_features = df[[
            'num_links', 'email_length', 'text_length',
            'num_bad_words', 'bad_word_frequency',
            'num_web_related_words', 'web_word_frequency'
        ]]
        numerical_scaled = self.scaler.transform(numerical_features)

        # Combine both feature sets
        X_combined = hstack([X_text, numerical_scaled])

        # Make predictions
        df["is_spam"] = self.model.predict(X_combined)

        #Calculate the confidence for spam/ham
        df["confidence"] = self.model.predict_proba(X_combined)[:, 1]

        #Categorise
        df["category"] = pd.cut(
            df["confidence"],
            bins=[0, 0.5, 0.8, 1.0],
            labels=["Healthy", "Uncertain", "Spam"],
            include_lowest=True
        )

        #Give each email an ID
        df = df.reset_index(drop=True) #Resets the index to 0 (in case it isnt already)
        df["id"] = df.index + 1 #Start from 1

        # Create a short preview (first 8 words of the clean_text)
        df["preview"] = df["clean_text"].apply(
            lambda t: " ".join(t.split()[:8]) + ("..." if len(t.split()) > 8 else "") #Limits the preview to first 8 words so the entire email won't be sent (for table)
        )

        self.df = df #Save the new dataframe (kinda like a 'database')
        return df[["id","is_spam","confidence","category"]].to_dict(orient="records")

    
    def get_summary(self):
        #Returns a count file of each category (as JSON)
        summary = {
            "safe": int((self.df["category"] == "Healthy").sum()),
            "uncertain": int((self.df["category"] == "Uncertain").sum()),
            "spam": int((self.df["category"] == "Spam").sum())
        }
        return summary
    
    def get_ratio(self):
        #Get the ratio of spam to non-spam emails uploaded
        spam_ratio = int((self.df["category"] == "Spam").sum()) / len(self.df) # num spam / length
        ham_ratio = (len(self.df) - int((self.df["category"] == "Spam").sum())) / len(self.df) # num non-spam / length
        
        ratio = {
            "spam": spam_ratio,
            "not_spam": ham_ratio
        }
        return ratio
    
    def get_suspicious_words(self):
        counts = {}
        for word in SUSP_WORDS:
            counts[word] = int(self.df["clean_text"].str.count(word).sum())
        return counts
    
    def get_emails(self, category=None):
        #Either returns ALL the emails, or the emails of a specific category
        #Categories are "Healthy", "Uncertain" or "Spam"
        if category is None:
            filtered_df = self.df
        else:
            filtered_df = self.df[self.df["category"] == category]
        return filtered_df[["id","preview", "is_spam", "confidence", "category"]].to_dict(orient="records")
    
    def get_email_by_id(self, id):
        email = self.df[self.df["id"] == id]
        if email.empty:
            return "Error"
        else:
            return email[["preview","is_spam","confidence","category"]].to_dict(orient="records")[0]
    
    def get_clusters(self):
        # Use bad_word_frequency and web_word_frequency for clustering
        cluster_data = self.df[['bad_word_frequency', 'web_word_frequency']].to_numpy()

        # Fit KMeans
        kmeans = KMeans(n_clusters=2, random_state=42)
        kmeans.fit(cluster_data)
        
        # Predict cluster for each email
        self.df["cluster"] = kmeans.predict(cluster_data)
        
        # Build JSON-friendly output for frontend scatter chart
        clusters = [
            {
                "x": float(row["bad_word_frequency"]),
                "y": float(row["web_word_frequency"]),
                "cluster": int(row["cluster"])
            }
            for _, row in self.df.iterrows()
        ]
        return clusters
    
if __name__ == "__main__":
    # Creating and processing
    df = pd.read_csv("training/emails.csv")
    model = Model()
    model.train(df)
    
    