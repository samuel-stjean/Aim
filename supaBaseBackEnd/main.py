from http.client import responses

from fastapi import FastAPI
from supabase import create_client, Client
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


# Initialize Supabase client
url = "https://nywwjdgkyydxealbuvjz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55d3dqZGdreXlkeGVhbGJ1dmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1ODE5OTgsImV4cCI6MjA1MzE1Nzk5OH0.491gmLt4FMVRro2qLuk697NhEHuRyJElf2jSDsx3Eyc"
supabase: Client = create_client(url, key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify domains
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

class Developer(BaseModel):
    id: int
    name: str
    hours_of_work_assigned_this_week: int

class Issue(BaseModel):
    id: int
    description: str
    urgency_level: int
    status: bool
    issue_name: str

# Endpoint to get users
@app.get("/developer")
def get_users():
    response = supabase.table("developer").select("*").execute()
    return response.data
@app.get("/issues")
def get_issues():
    response1 = supabase.table("issues").select("*").execute()
    return response1.data

# Endpoint to add a user
@app.post("/developer")
def add_user(developer: Developer):
    response = supabase.table("developer").insert(developer.dict()).execute()
    return response.data

@app.post("/issues")
def add_issue(issue: Issue):
    response1 = supabase.table("issues").insert(issue.dict()).execute()
    return response1.data
