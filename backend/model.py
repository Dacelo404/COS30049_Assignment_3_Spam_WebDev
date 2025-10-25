import numpy as np
import pandas as pd
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
    
    def predict(self, csv):
        self.model, self.vectorizer, self.scaler = joblib.load("ai_model.pkl")
        
        df = pd.read_csv(csv)
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
        predictions = self.model.predict(X_combined)

        df["is_spam"] = predictions
        return df
    
if __name__ == "__main__":
    # Creating and procsesing
    df = pd.read_csv("backend/training/emails.csv")
    model = Model()
    model.train(df)
    
    