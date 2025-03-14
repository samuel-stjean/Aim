import ast
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

print(url)

key = os.getenv("SUPABASE_KEY")

print(key)

supabase: Client = create_client(url, key)



# Initialize Jira Client Into Correct Project
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


class User(BaseModel):
    id: int
    firstName: str
    lastName: str
    username: str
    email: str
    password: str
    confirmPassword: str

class Developer(BaseModel):
    id: int
    name: str
    hours_of_work_assigned_this_week: int
    user_id: int

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
    id: int
    project_description: str
    project_name: str
    project_manager_email: str

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
            'issuetype': {'name': 'Bug'},
            'assignee': {'name': 'john.doe'} # Replace 'Bug' with the desired issue type
        }

        # Convert dictionary to a string
        issue_data_str = str(issue_data1)

        # Prepare the input for the Gemini API
        prompt = (
            "For the given project I want you to generate a series of subtasks in the form of jira tickets that are all necessary to complete "
            "the bigger task (meaning the project). Now for each issue I want you to recommend "
            "a developer to assign the ticket to based on their "
            "available hours and relevant skills. For the Jira ticket recommendations please use this template format. "
            f"{issue_data_str}"
            f"Issue: {issue}. Developers: {developers}."
            "Now for the response itself please only give me the ticket suggestions themselves and the assignee within the format as instructed"
        )


        # Use the generative AI model to generate content
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        tickets = extract_tickets(response.text)

        print(tickets)

        return tickets

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate a recommendation.")

# Function to generate a broad project outline
@app.get("/project_outline")
def generate_project_outline(project_goal: str, project_scope: str, project_timeline: str):
    try:
        # Construct the prompt for Gemini
        prompt = (
            "You are an expert Agile project manager. Based on the provided project details, generate a high-level project outline "
            "including an overview of necessary sprints. Each sprint should have a general description of its purpose and expected outcomes, "
            "but avoid breaking it down into detailed tasks. The project manager will prompt separately for sprint breakdowns. "
            "\n\n"
            f"Project Goal: {project_goal}\n"
            f"Project Scope: {project_scope}\n"
            f"Project Timeline: {project_timeline}\n"
            "\n"
            "Now, generate a high-level outline of the project’s sprints, keeping it broad and without individual task details."
        )

        # Use the generative AI model to generate content
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        return {"project_outline": response.text}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate project outline.")


@app.post("/createUser")
def add_user(user: User):
    response = supabase.table("user").insert(user.dict()).execute()
    print(response)
    return response.data

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
def add_project(project: Project):
    response = supabase.table("projects").insert(project.dict()).execute()
    return response.data

@app.get("/login")
def login_user(email: str, password: str):

    response = supabase.table("user").select("*").eq("email", email).eq("password", password).execute()
        
    if not response.data:

        return 
    
    else:  
        return response.data

def extract_tickets(text):

    pattern = re.compile(
        r"\{"
        r"\s*'project'\s*:\s*\{'key'\s*:\s*'.*?'\},"
        r"\s*'summary'\s*:\s*'.*?',"
        r"\s*'description'\s*:\s*'.*?',"
        r"\s*'issuetype'\s*:\s*\{'name'\s*:\s*'.*?'\},"
        r"\s*'assignee'\s*:\s*\{'name'\s*:\s*'.*?'\}"
        r"\s*\}", 
        re.DOTALL
    )
    
    matches = pattern.findall(text)

    tickets = []

    for match in matches:
        # Convert the match string into a dictionary safely using ast.literal_eval
        try:
            ticket_dict = ast.literal_eval(match)
            tickets.append(ticket_dict)
        except Exception as e:
            print(f"Error parsing ticket: {e}")
    
    processed_tickets = [

        {
            'project': item['project']['key'],  # Extracting 'key' from 'project'
            'summary': item['summary'],
            'description': item['description'],
            'issuetype': item['issuetype']['name'],  # Extracting 'name' from 'issuetype'
            'assignee': item['assignee']['name']  # Extracting 'name' from 'assignee'
        }

        for item in tickets

    ]
    
    return processed_tickets  # Return list of valid JSON tickets

