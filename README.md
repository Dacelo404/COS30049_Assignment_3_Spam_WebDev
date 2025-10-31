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
1. According to all known laws of aviation
2. There is no way a bee should be able to fly
3. Its wings are too small for its fat little body to get off the ground
4. The bee however, flies anyways
5. Because it does not care what humans think is possible
