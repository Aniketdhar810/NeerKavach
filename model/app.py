"""
NeerKavach - Water Quality ML Prediction Service
FastAPI-based service for disease risk prediction using ensemble models (SVM + KNN)
"""

import os
import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from sklearn.preprocessing import LabelEncoder, RobustScaler
from sklearn.model_selection import KFold
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor

# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PKL_PATH = os.path.join(MODEL_DIR, "water_disease_model.pkl")
DATASET_PATH = os.path.join(MODEL_DIR, "ML_Final_Water_Disease_Training_Dataset_with_sources.csv")

# Water source mapping (frontend -> model)
WATER_SOURCE_MAP = {
    "Borewell": "Well",
    "Municipal Supply": "Tap",
    "Surface Water (River/Lake)": "River",
    "Open Well": "Well",
    "Pond": "Pond",
    "River": "River",
    "Lake": "Lake",
    "Spring": "Spring",
    "Tap": "Tap",
    "Well": "Well",
}

# ─────────────────────────────────────────────────────────────────────────────
# Pydantic Models for Request/Response
# ─────────────────────────────────────────────────────────────────────────────

class WaterTestInput(BaseModel):
    """Input parameters for water quality prediction"""
    waterSource: str = Field(..., description="Type of water source")
    pH: float = Field(..., ge=0, le=14, description="pH Level")
    turbidity: float = Field(..., ge=0, description="Turbidity in NTU")
    dissolvedOxygen: Optional[float] = Field(8.0, ge=0, description="Dissolved Oxygen in mg/L")
    nitrateLevel: Optional[float] = Field(0.5, ge=0, description="Nitrate Level in mg/L")
    contaminantLevel: Optional[float] = Field(10.0, ge=0, description="Contaminant Level in ppm")
    bacteriaCount: Optional[float] = Field(1000, ge=0, description="Bacteria Count in CFU/mL")
    fecalColiform: Optional[str] = Field("Absent", description="Fecal Coliform status")
    totalColiform: Optional[float] = Field(100, ge=0, description="Total Coliform count")
    temperature: Optional[float] = Field(25.0, description="Temperature in Celsius")


class DiseaseRisk(BaseModel):
    """Individual disease risk prediction"""
    name: str
    probability: float


class PredictionResponse(BaseModel):
    """Response from prediction endpoint"""
    riskLevel: str
    riskPercent: float
    diseases: List[DiseaseRisk]


class HotspotData(BaseModel):
    """Hotspot information for heatmap"""
    id: int
    waterSource: str
    contaminantLevel: float
    pH: float
    turbidity: float
    temperature: float
    diarrhea: float
    cholera: float
    typhoid: float
    riskLevel: str
    riskPercent: float


# ─────────────────────────────────────────────────────────────────────────────
# ML Model Class
# ─────────────────────────────────────────────────────────────────────────────

class WaterDiseaseModel:
    """Ensemble model for water disease prediction using SVM + KNN"""
    
    def __init__(self):
        self.encoder = None
        self.scaler = None
        self.svm_d = None  # Diarrhea SVM
        self.svm_c = None  # Cholera SVM
        self.svm_t = None  # Typhoid SVM
        self.knn_d = None  # Diarrhea KNN
        self.knn_c = None  # Cholera KNN
        self.knn_t = None  # Typhoid KNN
        self.is_trained = False
    
    def train(self, df: pd.DataFrame):
        """Train the ensemble models on the dataset"""
        print("Training ML models...")
        
        # Encode categorical column
        self.encoder = LabelEncoder()
        df_encoded = df.copy()
        df_encoded["Water Source Type"] = self.encoder.fit_transform(df["Water Source Type"])
        
        # Input features
        X = df_encoded[
            [
                "Water Source Type",
                "Contaminant Level (ppm)",
                "pH Level",
                "Turbidity (NTU)",
                "Dissolved Oxygen (mg/L)",
                "Nitrate Level (mg/L)",
                "Bacteria Count (CFU/mL)",
                "Fecal Coliform",
                "Total Coliform",
                "Temperature"
            ]
        ]
        
        # Targets
        y_d = df_encoded["Diarrheal Cases Likelihood (%)"]
        y_c = df_encoded["Cholera Cases Likelihood (%)"]
        y_t = df_encoded["Typhoid Cases Likelihood (%)"]
        
        # Scale features
        self.scaler = RobustScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        # Train SVM models
        self.svm_d = SVR(kernel='rbf', C=50, gamma=0.2, epsilon=0.05)
        self.svm_c = SVR(kernel='rbf', C=50, gamma=0.2, epsilon=0.05)
        self.svm_t = SVR(kernel='rbf', C=50, gamma=0.2, epsilon=0.05)
        
        self.svm_d.fit(X_scaled, y_d)
        self.svm_c.fit(X_scaled, y_c)
        self.svm_t.fit(X_scaled, y_t)
        
        # Train KNN models
        self.knn_d = KNeighborsRegressor(n_neighbors=5)
        self.knn_c = KNeighborsRegressor(n_neighbors=5)
        self.knn_t = KNeighborsRegressor(n_neighbors=5)
        
        self.knn_d.fit(X_scaled, y_d)
        self.knn_c.fit(X_scaled, y_c)
        self.knn_t.fit(X_scaled, y_t)
        
        self.is_trained = True
        print("Model training complete!")
    
    def predict(self, data: WaterTestInput) -> PredictionResponse:
        """Make prediction for given water test data"""
        if not self.is_trained:
            raise ValueError("Model not trained yet!")
        
        # Map water source to model expected value
        water_source = WATER_SOURCE_MAP.get(data.waterSource, "Well")
        
        # Convert fecal coliform to numeric
        fecal_coliform_map = {
            "Absent": 0,
            "Present (Trace)": 50,
            "Present (Significant)": 500
        }
        fecal_value = fecal_coliform_map.get(data.fecalColiform, 0)
        
        # Create input dataframe
        input_df = pd.DataFrame({
            "Water Source Type": [water_source],
            "Contaminant Level (ppm)": [data.contaminantLevel or 10.0],
            "pH Level": [data.pH],
            "Turbidity (NTU)": [data.turbidity],
            "Dissolved Oxygen (mg/L)": [data.dissolvedOxygen or 8.0],
            "Nitrate Level (mg/L)": [data.nitrateLevel or 0.5],
            "Bacteria Count (CFU/mL)": [data.bacteriaCount or 1000],
            "Fecal Coliform": [fecal_value],
            "Total Coliform": [data.totalColiform or 100],
            "Temperature": [data.temperature or 25.0]
        })
        
        # Encode water source
        try:
            input_df["Water Source Type"] = self.encoder.transform(input_df["Water Source Type"])
        except ValueError:
            # If unknown water source, default to most common
            input_df["Water Source Type"] = 0
        
        # Scale input
        X_scaled = self.scaler.transform(input_df)
        
        # Ensemble predictions (70% SVM + 30% KNN)
        diarrhea = float(0.7 * self.svm_d.predict(X_scaled)[0] + 0.3 * self.knn_d.predict(X_scaled)[0])
        cholera = float(0.7 * self.svm_c.predict(X_scaled)[0] + 0.3 * self.knn_c.predict(X_scaled)[0])
        typhoid = float(0.7 * self.svm_t.predict(X_scaled)[0] + 0.3 * self.knn_t.predict(X_scaled)[0])
        
        # Clamp values between 0 and 100
        diarrhea = max(0, min(100, diarrhea))
        cholera = max(0, min(100, cholera))
        typhoid = max(0, min(100, typhoid))
        
        # Calculate overall risk
        max_risk = max(diarrhea, cholera, typhoid)
        avg_risk = (diarrhea + cholera + typhoid) / 3
        risk_percent = round((max_risk * 0.6 + avg_risk * 0.4), 1)
        
        # Determine risk level
        if risk_percent >= 50:
            risk_level = "high"
        elif risk_percent >= 25:
            risk_level = "moderate"
        else:
            risk_level = "low"
        
        return PredictionResponse(
            riskLevel=risk_level,
            riskPercent=risk_percent,
            diseases=[
                DiseaseRisk(name="Diarrhea", probability=round(diarrhea, 1)),
                DiseaseRisk(name="Cholera", probability=round(cholera, 1)),
                DiseaseRisk(name="Typhoid", probability=round(typhoid, 1))
            ]
        )
    
    def save(self, path: str):
        """Save trained model to pickle file"""
        model_state = {
            'encoder': self.encoder,
            'scaler': self.scaler,
            'svm_d': self.svm_d,
            'svm_c': self.svm_c,
            'svm_t': self.svm_t,
            'knn_d': self.knn_d,
            'knn_c': self.knn_c,
            'knn_t': self.knn_t,
            'is_trained': self.is_trained
        }
        with open(path, 'wb') as f:
            pickle.dump(model_state, f)
        print(f"Model saved to {path}")
    
    def load(self, path: str):
        """Load trained model from pickle file"""
        with open(path, 'rb') as f:
            model_state = pickle.load(f)
        self.encoder = model_state['encoder']
        self.scaler = model_state['scaler']
        self.svm_d = model_state['svm_d']
        self.svm_c = model_state['svm_c']
        self.svm_t = model_state['svm_t']
        self.knn_d = model_state['knn_d']
        self.knn_c = model_state['knn_c']
        self.knn_t = model_state['knn_t']
        self.is_trained = model_state['is_trained']
        print(f"Model loaded from {path}")


# ─────────────────────────────────────────────────────────────────────────────
# FastAPI Application
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="NeerKavach ML API",
    description="Water Quality Disease Risk Prediction API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
model = WaterDiseaseModel()
dataset_df = None


@app.on_event("startup")
async def startup_event():
    """Initialize model on startup"""
    global model, dataset_df
    
    # Load dataset
    if os.path.exists(DATASET_PATH):
        dataset_df = pd.read_csv(DATASET_PATH)
        print(f"Dataset loaded: {len(dataset_df)} records")
    else:
        print(f"WARNING: Dataset not found at {DATASET_PATH}")
        dataset_df = None
    
    # Load or train model
    if os.path.exists(MODEL_PKL_PATH):
        model.load(MODEL_PKL_PATH)
    elif dataset_df is not None:
        model.train(dataset_df)
        model.save(MODEL_PKL_PATH)
    else:
        print("WARNING: No model or dataset available!")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "NeerKavach ML API",
        "model_trained": model.is_trained
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model.is_trained,
        "dataset_records": len(dataset_df) if dataset_df is not None else 0
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(data: WaterTestInput):
    """
    Predict disease risk based on water quality parameters.
    
    Returns:
        - riskLevel: 'low', 'moderate', or 'high'
        - riskPercent: Overall risk percentage (0-100)
        - diseases: List of individual disease probabilities
    """
    if not model.is_trained:
        raise HTTPException(status_code=503, detail="Model not trained yet")
    
    try:
        prediction = model.predict(data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/hotspots", response_model=List[HotspotData])
async def get_hotspots():
    """
    Get sample hotspot data for heatmap visualization.
    Returns high-risk locations from the dataset, sorted by risk level.
    """
    if dataset_df is None:
        raise HTTPException(status_code=503, detail="Dataset not loaded")
    
    # Calculate risk for all records first
    df_with_risk = dataset_df.copy()
    df_with_risk["diarrhea"] = df_with_risk["Diarrheal Cases Likelihood (%)"]
    df_with_risk["cholera"] = df_with_risk["Cholera Cases Likelihood (%)"]
    df_with_risk["typhoid"] = df_with_risk["Typhoid Cases Likelihood (%)"]
    df_with_risk["max_risk"] = df_with_risk[["diarrhea", "cholera", "typhoid"]].max(axis=1)
    df_with_risk["avg_risk"] = df_with_risk[["diarrhea", "cholera", "typhoid"]].mean(axis=1)
    df_with_risk["risk_percent"] = (df_with_risk["max_risk"] * 0.6 + df_with_risk["avg_risk"] * 0.4).round(1)
    
    # Sort by risk and get top high-risk samples
    df_sorted = df_with_risk.sort_values("risk_percent", ascending=False)
    
    # Get top 30 high-risk samples
    high_risk_samples = df_sorted.head(30)
    
    hotspots = []
    for idx, row in high_risk_samples.iterrows():
        risk_percent = row["risk_percent"]
        
        if risk_percent >= 50:
            risk_level = "high"
        elif risk_percent >= 25:
            risk_level = "moderate"
        else:
            risk_level = "low"
        
        hotspots.append(HotspotData(
            id=int(idx),
            waterSource=row["Water Source Type"],
            contaminantLevel=round(row["Contaminant Level (ppm)"], 2),
            pH=round(row["pH Level"], 2),
            turbidity=round(row["Turbidity (NTU)"], 2),
            temperature=round(row["Temperature"], 1),
            diarrhea=round(row["diarrhea"], 1),
            cholera=round(row["cholera"], 1),
            typhoid=round(row["typhoid"], 1),
            riskLevel=risk_level,
            riskPercent=risk_percent
        ))
    
    return hotspots


@app.post("/retrain")
async def retrain_model():
    """Force retrain the model from dataset"""
    global model
    
    if dataset_df is None:
        raise HTTPException(status_code=503, detail="Dataset not loaded")
    
    try:
        model.train(dataset_df)
        model.save(MODEL_PKL_PATH)
        return {"status": "success", "message": "Model retrained and saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────────────────────────────────────
# Run with: uvicorn app:app --host 0.0.0.0 --port 5001 --reload
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
