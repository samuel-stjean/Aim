from http.client import responses
from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from jira import JIRA

# Initialize Supabase client
url = "https://tkrrefsejlahthlgbqhy.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcnJlZnNlamxhaHRobGdicWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMTc1ODgsImV4cCI6MjA1NDg5MzU4OH0.E8GQgv6kmlEWkJLZIRzEOvKyS5x4jLDVt9r7Lytmcvw"
supabase: Client = create_client(url, key)

print ("Hello World")
# Initialize Jira Client

jira_server = "https://jpveliz11.atlassian.net/"
email = "jpveliz11@gmail.com"
api_token = "ATATT3xFfGF0zUm1vntFsDFdJv-JZ-O1b-pEYR6qg5tiNDOu0gPcznYM07kHt0hWQsZtKGiXf34jkjxq8eRL0dUyV7fWT3CC8KYe0qLUkHPKWfDwOKRZeGo745NkbsWnS_CZMrcSRr_6tbSbDWHI_vnAadE3JEg281lwa5AsCHDJBeSTz1aaLaI=4E293D48"

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

@app.get("/developer")
def get_users():
    response = supabase.table("developer").select("*").execute()
    return response.data

@app.get("/issues")
def get_issues():
    response1 = supabase.table("issues").select("*").execute()
    return response1.data

# Configure the Gemini API key
genai.configure(api_key="AIzaSyBqRvmzx6ZATJOCY-1mAPVVHKeUXPVEAsA")

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

        # Parse and return the AI's response
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

