from fastapi import FastAPI, HTTPException, Depends, UploadFile#, Request, Response, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
#from fastapi.responses import JSONResponse
#from fastapi import BackgroundTasks
from model import Model
from utils import logger
#import time

app = FastAPI()

class Message(BaseModel):
    id: int
    is_spam: bool = None
    subject: str
    content: str
    spam_index: float
    cluster: int
    spam_word_ratio: float
    tfidf: float
    origin_file: str

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

model = Model()

@app.get("/") 
async def root():
    return {"message": "Spam Detection Tool for Email API - Welcome"}

def get_db():
    return {"db": "Simulated database connection"} #simulated access, will resolve once model is adapted

@app.get("/results")
async def results_overview(id: int, results: list, db=Depends(get_db())):
    for id in [1]: #simulated access, will resolve once model is adapted
        results.append({"id": id, "db_connection": db["db"]})
    return {"results": results}

@app.get("/results/{id}")
async def results_singular(id: int, db=Depends(get_db())):
    if id not in [1]: #simulated access, will resolve once model is adapted
        raise HTTPException(status_code=404, detail="Message not found")
    return {"id": id, "db_connection": db["db"]}

@app.post("/uploadfile")
async def predict_spam(file: UploadFile):
    try:
        predict = model.predict(file)

        for id in file:
            logger.info(f"Prediction made: {predict.is_spam} for {predict.id} from {file.filename}")

        return {"results": predict}
    
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")

        raise HTTPException(status_code=500, detail="Internal server error")
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# @app.middleware("http")
# async def log_requests(request: Request, call_next):
#     start_time = time.time()
#     response = await call_next(request)
#     process_time = time.time() - start_time
#     print(f"Request: {request.url} - Duration: {process_time} seconds")
#     return response

# @app.get("/messages/{message_id}")
# def get_message(message_id: int, db=Depends(get_db)):
#     if message_id not in [1, 2, 3]:  # Simulate message check
#         raise HTTPException(status_code=404, detail="Message not found")
#     return {"message_id": message_id, "db_connection": db["db"]}	

# @app.post("/messages/")
# def create_message(message: Message, db=Depends(get_db)):
#     return {"message": message, "db_connection": db["db"]}

# @app.put("/messages/{message_id}")
# def update_message(message_id: int, message: Message, db=Depends(get_db)):
#     if message_id not in [1, 2, 3]:
#         raise HTTPException(status_code=404, detail="Message not found")
#     return {"message_id": message_id, "updated_message": message, "db_connection": db["db"]}

# @app.delete("/messages/{message_id}")
# def delete_message(message_id: int, db=Depends(get_db)):
#     if message_id not in [1, 2, 3]:
#         raise HTTPException(status_code=404, detail="Message not found")
#     return {"detail": "Message deleted", "message_id": message_id, "db_connection": db["db"]}

# @app.get("/info/")
# def get_info():
#     headers = {"X-Info-Version": "1.0", "X-Student-Task": "Create Custom Path"}
#     return JSONResponse(content={"message": "Custom path created successfully!"}, headers=headers)

# @app.get("/messages/{message_id}/with-spam-override")
# def get_message_with_spam_override(message_id: int, spam_override: int = None, db=Depends(get_db)):
#     if message_id not in [1, 2, 3]:
#         raise HTTPException(status_code=404, detail="Message not found")
#     message = {"message_id": message_id, "is_spam": 0}  # Simulated message with price
#     if spam_override:
#         message["is_spam"] = spam_override
#     return {"message": message, "db_connection": db["db"]}

# @app.get("/headers/")
# def get_headers():
#     content = {"message": "Go fuck yourself"}
#     headers = {"X-Custom-Header": "welcome to the internet", "Content-Language": "en-US"}
#     return JSONResponse(content=content, headers=headers)

# def background_task(message_id: int):
#     time.sleep(5)  # Simulate long task
#     print(f"Background task completed for message {message_id}")

# @app.post("/messages/{message_id}/background-task/")
# def run_background_task(message_id: int, background_tasks: BackgroundTasks, db=Depends(get_db)):
#     background_tasks.add_task(background_task, message_id)
#     return {"message": "Background task started", "message_id": message_id, "db_connection": db["db"]}