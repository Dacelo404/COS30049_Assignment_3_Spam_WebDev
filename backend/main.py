from fastapi import FastAPI, HTTPException, UploadFile#, Request, Response, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
#from fastapi.responses import JSONResponse
#from fastapi import BackgroundTasks
from model import Model
from utils import logger
#import time

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

model = Model()

@app.get("/") 
async def root():
    return {"message": "Spam Detection Tool for Email API - Welcome"}

@app.post("/uploadfile")
async def predict_spam(file: UploadFile):
    try:
        predict = model.initialise(file)

        for entry in predict:
            logger.info(f"Prediction made: {entry["is_spam"]} for record #{entry["id"]} from {file.filename}")

        return {"results": predict}
    
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")

        raise HTTPException(status_code=500, detail="Bad file type")
    
@app.get("/results/category_count")
async def category_counts():
    try:
        count = model.get_summary()

        return {"count": count}
    except Exception as e:
        logger.error(f"Error during retrieval: {str(e)}")

        raise HTTPException(status_code=500, detail="Model not initialised with user data")

@app.get("/results/spam_ratio")
async def spam_ratio():
    try:
        ratio = model.get_ratio()

        return {"ratio": ratio}
    except Exception as e:
        logger.error(f"Error during retrieval: {str(e)}")

        raise HTTPException(status_code=500, detail="Model not initialised with user data")

@app.get("/results/suspicious")
async def suspicious_words():
    try:
        suspicious = model.get_suspicious_words()

        return {"suspicious": suspicious}
    except Exception as e:
        logger.error(f"Error during retrieval: {str(e)}")

        raise HTTPException(status_code=500, detail="Model not initialised with user data")

@app.get("/results/clusters")
async def clusters():
    try:
        clustering = model.get_clusters()

        for entry in clustering:
            logger.info(f"X: {entry["x"]}, Y: {entry["y"]}, cluster: {entry["cluster"]}")

        return {"clusters": clustering}
    except Exception as e:
        logger.error(f"Error during retrieval: {str(e)}")

        raise HTTPException(status_code=500, detail="Model not initialised with user data")

@app.get("/results/all")
async def results_overview(category: str = None):
    try:
        records = model.get_emails(category)
        
        for entry in records:
            logger.info(f"Record #{entry["id"]} with the preview {entry["preview"]} is classified as {entry["is_spam"]} with {entry["confidence"]} confidence")
        
        return {"results": records}
    except Exception as e:
        logger.error(f"Error during retrieval: {str(e)}")

        raise HTTPException(status_code=500, detail="Model not initialised with user data")

@app.get("/results/{id}")
async def results_singular(id: int):
    try:
        record = model.get_email_by_id(id)

        if record == "Error":
            raise HTTPException(status_code=404, detail="Message not found")
        else:
            logger.info(f"Record #{id} with the preview {record["preview"]} is classified as {record["is_spam"]} with {record["confidence"]} confidence")
        
        return {"result": record}
    except Exception as e:
        logger.error(f"Error during retrieval: {str(e)}")

        raise HTTPException(status_code=500, detail="Model not initialised with user data")
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)