# Assignment 3 - COS30049 Computing Technology Innovation Project
## Session 29 (Tutor: Changzhou Han) - Group 3
This README file contains basic setup instructions for configuring the React.js website and FastAPI backend environments for our project.

## Installing Dependencies
```bash
pip install fastapi uvicorn scikit-learn numpy pandas joblib nltk scipy
```

## Running the Project Files
### 1. AI Model
Navigate to the project's backend directory:
```bash
cd COS30049_Assignment_3_Spam_WebDev/backend
```
Run the model:
```bash
python model.py
```

### 2. Start FastAPI Backend Server
In the same directory, run the FastAPI server using the following command:
```bash
uvicorn main:app --reload
```

### 3. Start React.js Frontend Server & Visit via a Web Browser
Navigate to the frontend directory:
```bash
cd COS30049_Assignment_3_Spam_WebDev/assignment3_spam_web_dev/src
```
Execute the following command to run the frontend React.js server:
```bash
npm start
```
Open a browser and visit http://localhost:3000 to access the website

## Using the Website
1. Upload a dataset file
Use either a .csv or .txt file containing email or sms data
2. View results summary
Once uploaded, file goes to backend and it starts processing the file using our AI model
3. Explore data vis
View results as a brief overview table, or navigate between charts using next and prev. buttons
4. Toggle light/dark 
In the nav bar, press button to change the theme
5. Adjust font size
In the nav bar, press Aa+ to increase font size
Aa- to reset font size

6. Reload page to upload new file
