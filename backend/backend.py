from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi import BackgroundTasks
from model import Model
import time

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

class Message(BaseModel):
    is_spam: bool = None
    content: str
    spam_index: float

def get_db():
    return {"db": "Simulated database connection"}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"Request: {request.url} - Duration: {process_time} seconds")
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "error": "An error occurred"}
    )

@app.get("/messages/{message_id}")
def get_message(message_id: int, db=Depends(get_db)):
    if message_id not in [1, 2, 3]:  # Simulate message check
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message_id": message_id, "db_connection": db["db"]}	

@app.post("/messages/")
def create_message(message: Message, db=Depends(get_db)):
    return {"message": message, "db_connection": db["db"]}

@app.put("/messages/{message_id}")
def update_message(message_id: int, message: Message, db=Depends(get_db)):
    if message_id not in [1, 2, 3]:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message_id": message_id, "updated_message": message, "db_connection": db["db"]}

@app.delete("/messages/{message_id}")
def delete_message(message_id: int, db=Depends(get_db)):
    if message_id not in [1, 2, 3]:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"detail": "Message deleted", "message_id": message_id, "db_connection": db["db"]}

@app.get("/info/")
def get_info():
    headers = {"X-Info-Version": "1.0", "X-Student-Task": "Create Custom Path"}
    return JSONResponse(content={"message": "Custom path created successfully!"}, headers=headers)

@app.get("/messages/{message_id}/with-spam-override")
def get_message_with_spam_override(message_id: int, spam_override: int = None, db=Depends(get_db)):
    if message_id not in [1, 2, 3]:
        raise HTTPException(status_code=404, detail="Message not found")
    message = {"message_id": message_id, "is_spam": 0}  # Simulated message with price
    if spam_override:
        message["is_spam"] = spam_override
    return {"message": message, "db_connection": db["db"]}

@app.get("/headers/")
def get_headers():
    content = {"message": "Go fuck yourself"}
    headers = {"X-Custom-Header": "welcome to the internet", "Content-Language": "en-US"}
    return JSONResponse(content=content, headers=headers)

def background_task(message_id: int):
    time.sleep(5)  # Simulate long task
    print(f"Background task completed for message {message_id}")

@app.post("/messages/{message_id}/background-task/")
def run_background_task(message_id: int, background_tasks: BackgroundTasks, db=Depends(get_db)):
    background_tasks.add_task(background_task, message_id)
    return {"message": "Background task started", "message_id": message_id, "db_connection": db["db"]}