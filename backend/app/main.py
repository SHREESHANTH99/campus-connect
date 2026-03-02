from fastapi import FastAPI
from fastapi import WebSocket
from app.websockets.chat import websocket_endpoint


app = FastAPI(title="Campus Connect API")

@app.get("/")
async def root():
    return {"status": "Campus Connect Backend Running"}
@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)