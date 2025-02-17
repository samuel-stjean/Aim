import os
from http.client import responses
from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from jira import JIRA
from dotenv import load_dotenv
import json
import re

load_dotenv()

# Initialize Supabase client
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

# Initialize Jira Client
jira_server = "https://jpveliz11.atlassian.net/"
email = "jpveliz11@gmail.com"
api_token = os.getenv("JIRA_KEY")

jira = JIRA(server=jira_server, basic_auth=(email, api_token))

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

class Ticket(BaseModel):
    ticket_id: int
    issue_id: int
    project: str
    summary: str
    description: str
    issuetype: str

class Project(BaseModel):
    project_id: int | None = None
    project_name: str
    project_description: str

@app.get("/developer")
def get_users():
    response = supabase.table("developer").select("*").execute()
    return response.data

@app.get("/issues")
def get_issues():
    response1 = supabase.table("issues").select("*").execute()
    return response1.data

@app.get("/projects")
def get_projects():
    response = supabase.table("projects").select("*").execute()
    if response.error:
        raise HTTPException(status_code=400, detail=response.error.message)
    return response.data

# Configure the Gemini API key
genai.configure(api_key=os.getenv("GEMINI_KEY"))

# Function to generate a recommendation for a specific issue
@app.get("/recommendation/{issue_id}")
def get_recommendation(issue_id: int):
    try:
        # Fetch the specific issue and all developers from Supabase
        issue_response = supabase.table("issues").select("*").eq("id", issue_id).execute()
        developers_response = supabase.table("developer").select("*").execute()

        if not issue_response.data:
            raise HTTPException(status_code=404, detail=f"Issue with id {issue_id} not found.")
        if not developers_response.data:
            raise HTTPException(status_code=404, detail="No developers found.")

        issue = issue_response.data[0]  # Single issue
        developers = developers_response.data

        issue_data1 = {
            'project': {'key': 'SCRUM'},
            'summary': 'Issue Name',
            'description': 'Details of the issue.',
            'issuetype': {'name': 'Bug'},  # Replace 'Bug' with the desired issue type
        }

        # Convert dictionary to a string
        issue_data_str = str(issue_data1)

        # Prepare the input for the Gemini API
        prompt = (
            "Generate a Jira ticket recommendation. "
            "For the given issue, recommend a developer to assign the ticket to based on their "
            "available hours and relevant skills. And also recommend a set of Jira tickets that should be made in order "
            "to complete this issue. Use this template format for the Jira Ticket Recommendations."
            f"{issue_data_str}"
            f"Issue: {issue}. Developers: {developers}."
        )


        # Use the generative AI model to generate content
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        tickets = extract_json_tickets(response.text)

        for i in tickets:

            print(i)

        return response.text

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate a recommendation.")

@app.post("/developer")
def add_user(developer: Developer):
    response = supabase.table("developer").insert(developer.dict()).execute()
    return response.data

@app.post("/issues")
def add_issue(issue: Issue):
    response1 = supabase.table("issues").insert(issue.dict()).execute()
    return response1.data

@app.post("/tickets")
def add_issue(ticket: Ticket):
    response1 = supabase.table("tickets").insert(ticket.dict()).execute()
    return response1.data

@app.post("/projects")
def create_project(project: Project):
    # Convert the Project model to a dict; insert into "projects" table
    response = supabase.table("projects").insert(project.dict()).execute()
    if response.error:
        raise HTTPException(status_code=400, detail=response.error.message)
    return response.data

def extract_json_tickets(text):
    # Regular expression to match JSON-like structures
    json_pattern = re.compile(r'```json\s*(\{.*?\})\s*```', re.DOTALL)
    
    # Find all JSON snippets in the text
    json_matches = json_pattern.findall(text)
    
    tickets = []
    
    for json_text in json_matches:

        try:
            # Convert single quotes to double quotes to make it valid JSON
            json_text = json_text.replace("'", '"')
            ticket = json.loads(json_text)
            tickets.append(ticket)

        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
    
    return tickets