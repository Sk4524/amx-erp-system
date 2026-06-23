from fastapi import FastAPI

from forecasting import forecast_demand

app = FastAPI()

# HEALTH CHECK
@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "AI Forecasting Service"
    }

# TRAIN MODEL
@app.post("/train")
def train():

    # MOCK TRAINING
    return {
        "message": "Model trained successfully"
    }

# PREDICT DEMAND
@app.post("/predict")
def predict(data: dict):

    history = data.get("history", [])

    prediction = forecast_demand(history)

    return {
        "prediction": prediction
    }