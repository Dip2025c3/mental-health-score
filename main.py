# import joblib
# import pandas as pd

# from fastapi import FastAPI
# from pydantic import BaseModel,Field
# from typing import Literal

# model = joblib.load('mental_health_model.pkl')

# app = FastAPI()


# class StudentData (BaseModel):
     
#    Age                  :int=Field(...,ge=10, le=100)
#    Gender               :str=Literal['male','female']
#    Country              :str
#    Academic_Level       :str=Literal['Undergraduate', 'Graduate', 'High School']
#    Most_Used_Platform   :str=Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter',
#        'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp',
#        'WeChat']
#    Purpose_Of_Use       :str=Literal['Networking', 'Education', 'Entertainment', 'News']
#    Avg_Daily_Usage_Hours:float=Field(...,ge=0, le=24)
#    Daily_Unlocks        :int=Field(...,ge=0)
#    Study_Hours          :float=Field(...,ge=0,le=24)
# Physical_Activity_Hours :float=Field(...,ge=0,le=24)
# Sleep_Hours_Per_Night:float=Field(...,ge=0,le=24)
# Stress_Level         :str=Literal['Medium', 'Low', 'Very High', 'High']




# class PredictionResponse(BaseModel):
#     predicted_mental_health_score:float
 


# @app.get('/')
# def greet():
#     return "hello welcome to my world"

# top_countries='Other',
# 'India',
# 'USA',
# 'Canada',
# 'Australia',
# 'UK',
# 'Germany',
# 'Mexico',
# 'Turkey',
# 'France'

# @app.post('/predict',response_model=PredictionResponse)
# def predict(data:StudentData):
#     country_group=data.country if data.country in top_countries else "other"
#     input_row=pd.DataFrame([{
    
#     'Age': data.age,
#     'Gender': data.gender,
#     'Country': data.country,
#     'Academic_Level': data.academic_level,
#     'Most_Used_Platform': data.most_used_platform,
#     'Purpose_Of_Use': data.purpose_of_use,
#     'Avg_Daily_Usage_Hours': data.avg_daily_usage_hours,
#     'Daily_Unlocks': data.daily_unlocks,
#     'Study_Hours': data.study_hours,
#     'Physical_Activity_Hours': data.physical_activity_hours,
#     'Sleep_Hours_Per_Night': data.sleep_hours_per_night,
#     'Stress_Level': data.stress_level,
#     'Mental_Health_Score': data.mental_health_score,
#     'group_country': data.group_country
# }
#     ])
    
# prediction=model.predict(input_row)[0]

# return PredictionResponse(predicted_mental_health_score=round(float(prediction),2))
 

import joblib
import pandas as pd

from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware


# Load trained model
model = joblib.load("mental_health_model.pkl")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# =========================
# Input Data Model
# =========================

class StudentData(BaseModel):

    age: int = Field(..., ge=10, le=100)

    gender: Literal["male", "female"]

    country: str

    academic_level: Literal[
        "Undergraduate",
        "Graduate",
        "High School"
    ]

    most_used_platform: Literal[
        "Facebook",
        "LinkedIn",
        "Instagram",
        "Snapchat",
        "Twitter",
        "YouTube",
        "TikTok",
        "LINE",
        "KakaoTalk",
        "VKontakte",
        "WhatsApp",
        "WeChat"
    ]

    purpose_of_use: Literal[
        "Networking",
        "Education",
        "Entertainment",
        "News"
    ]

    avg_daily_usage_hours: float = Field(
        ...,
        ge=0,
        le=24
    )

    daily_unlocks: int = Field(
        ...,
        ge=0
    )

    study_hours: float = Field(
        ...,
        ge=0,
        le=24
    )

    physical_activity_hours: float = Field(
        ...,
        ge=0,
        le=24
    )

    sleep_hours_per_night: float = Field(
        ...,
        ge=0,
        le=24
    )

    stress_level: Literal[
        "Medium",
        "Low",
        "Very High",
        "High"
    ]


# =========================
# Output Data Model
# =========================

class PredictionResponse(BaseModel):

    predicted_mental_health_score: float


# =========================
# Top Countries
# =========================

top_countries = (
    "Other",
    "India",
    "USA",
    "Canada",
    "Australia",
    "UK",
    "Germany",
    "Mexico",
    "Turkey",
    "France"
)


# =========================
# Home Route
# =========================

@app.get("/")
def greet():

    return {
        "message": "Hello, welcome to my world"
    }


# =========================
# Prediction Route
# =========================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(data: StudentData):

    # Group country
    country_group = (
        data.country
        if data.country in top_countries
        else "Other"
    )

    # Create input DataFrame
    input_row = pd.DataFrame([
        {
            "Age": data.age,
            "Gender": data.gender,
            "Country": data.country,
            "Academic_Level": data.academic_level,
            "Most_Used_Platform": data.most_used_platform,
            "Purpose_Of_Use": data.purpose_of_use,
            "Avg_Daily_Usage_Hours": data.avg_daily_usage_hours,
            "Daily_Unlocks": data.daily_unlocks,
            "Study_Hours": data.study_hours,
            "Physical_Activity_Hours": data.physical_activity_hours,
            "Sleep_Hours_Per_Night": data.sleep_hours_per_night,
            "Stress_Level": data.stress_level,
            "group_country": country_group
        }
    ])

    # Make prediction
    prediction = model.predict(input_row)[0]

    # Return prediction
    return PredictionResponse(
        predicted_mental_health_score=round(
            float(prediction),
            2
        )
    )

