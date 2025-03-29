import ast
import os
from http.client import responses
from typing import Optional
from fastapi import FastAPI, HTTPException, Request  
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from supabase import create_client, Client
from pydantic import BaseModel, Field
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
    project_id: int
    sprint_id: int

class Ticket(BaseModel):
    ticket_id: int
    issue_id: int
    project: str
    summary: str
    description: str
    issuetype: str
    sprint_id: int

class Project(BaseModel):
    id: int | None = None
    project_name: str
    project_description: str | None = None
    project_manager_email: str | None = None  # Add this
    sprint_duration_weeks: int | None = None  # Rename field
    start_date: str | None = None
    end_date: str | None = None
    project_manager_id: int


class Sprint(BaseModel):
    id: int
    name: str
    start_date: str
    end_date: str
    status: str
    project_id: int

class Recommendation(BaseModel):
    id: int
    issue_id: int
    developer_id: int
    sprint_id: int | None = None  # Nullable
    project_id: int | None = None  # Nullable
    recommendation_type: str  # 'sprint' or 'project'
    description: str

class Team(BaseModel):
    team_name: str
    user_id: int  # <- make this required

class Member(BaseModel):
    id: int | None = None
    name: str
    team_id: int
    skills: list[str]




print(" Final Team model schema:", Team.schema())



@app.get("/developer")
def get_users():
    response = supabase.table("developer").select("*").execute()
    return response.data

# @app.get("/team")
# def get_team(user_id: int):
#     response = supabase.table("developer").select("*").eq("user_id", user_id).execute()
#     return response.data

@app.get("/issues")
def get_issues():
    response1 = supabase.table("issues").select("*").execute()
    return response1.data

# @app.get("/projects")
# def get_projects():
#     response = supabase.table("projects").select("*").execute()
#     return response.data

@app.get("/projects")
def get_projects(request: Request):
    id_query = request.query_params.get("id")

    query = supabase.table("projects").select("*")

    if id_query:
        # Expecting query like "eq.7"
        match = re.match(r"eq\.(\d+)", id_query)
        if match:
            project_id = int(match.group(1))
            query = query.eq("id", project_id)

    response = query.execute()
    return response.data

@app.post("/projects")
def add_project(project: Project):
    try:
        project_data = project.dict(exclude_none=True)  # Remove null values
        response = supabase.table("projects").insert(project_data).execute()
        return {"message": "Project added successfully", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sprints")
def get_sprints():
    response = supabase.table("sprints").select("*").execute()
    return response.data

# Configure the Gemini API key
genai.configure(api_key=os.getenv("GEMINI_KEY"))

# Function to generate a recommendation for a specific issue

@app.get("/recommendations/sprint/{sprint_id}")
def get_sprint_recommendations(sprint_id: int):
    response = supabase.table("recommendations").select("*").eq("sprint_id", sprint_id).execute()
    return response.data

@app.get("/recommendations/project/{project_id}")
def get_project_recommendations(project_id: int):
    response = supabase.table("recommendations").select("*").eq("project_id", project_id).execute()
    return response.data

# GET All Teams
# @app.get("/teams")
# def get_teams():
#     response = supabase.table("teams").select("*").execute()
#     return response.data

@app.get("/teams")
def get_teams(user_id: int):
    response = supabase.table("teams").select("*").eq("user_id", user_id).execute()
    return response.data


#  GET Specific Team Details
@app.get("/teams/{team_id}")
def get_team(team_id: int):
    response = supabase.table("teams").select("*").eq("id", team_id).execute()
    return response.data

# GET All Developers in a Team
@app.get("/teams/{team_id}/developers")
def get_team_developers(team_id: int):
    response = supabase.table("developer").select("*").eq("team_id", team_id).execute()
    return response.data


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


# @app.post("/createUser")
# def add_user(user: User):
#     response = supabase.table("user").insert(user.dict()).execute()
#     print(response)
#     return response.data

@app.post("/createUser")
def add_user(user: User):
    response = supabase.table("user").insert(user.dict()).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="User creation failed.")
    
    new_user = response.data[0]
    
    # Automatically create a team for the new user
    team_insert = {
        "team_name": f"{new_user['firstName']}'s Team",
        "user_id": new_user["id"]
    }
    
    supabase.table("teams").insert(team_insert).execute()

    return response.data




# @app.post("/developer")
# def add_user(developer: Developer):
#     response = supabase.table("developer").insert(developer.dict()).execute()
#     return response.data

@app.post("/issues")
def add_issue(issue: Issue):
    response1 = supabase.table("issues").insert(issue.dict()).execute()
    return response1.data

@app.post("/tickets")
def add_issue(ticket: Ticket):
    response1 = supabase.table("tickets").insert(ticket.dict()).execute()
    return response1.data


@app.post("/sprints")
def add_sprint(sprint: Sprint):
    response = supabase.table("sprints").insert(sprint.dict()).execute()
    return response.data

@app.post("/recommendations")
def add_recommendation(recommendation: Recommendation):
    response = supabase.table("recommendations").insert(recommendation.dict()).execute()
    return response.data

# POST (Create a New Team)
# @app.post("/teams")
# def add_team(team: Team):
#     response = supabase.table("teams").insert(team.dict()).execute()
#     return response.data

@app.post("/teams")
async def add_team(team: Team):  # use TeamCreate if you're using it
    print("✅ BACKEND RECEIVED team model:", team)
    response = supabase.table("teams").insert(team.dict(exclude_unset=True)).execute()
    return response.data




# Assign a Developer to a Team
@app.post("/teams/{team_id}/add_developer/{developer_id}")
def assign_developer_to_team(team_id: int, developer_id: int):
    response = supabase.table("developer").update({"team_id": team_id}).eq("id", developer_id).execute()
    return response.data


@app.get("/login")
def login_user(email: str, password: str):

    response = supabase.table("user").select("id, firstName, lastName, email, username").eq("email", email).eq("password", password).execute()
        
    if not response.data:
        return 
    
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


# GET all members for a specific team
@app.get("/teams/{team_id}/members")
def get_members(team_id: int):
    response = supabase.table("members").select("*").eq("team_id", team_id).execute()
    return response.data

# POST a new member
@app.post("/members")
def add_member(member: Member):
    print(" Received member:", member)
    try:
        response = supabase.table("members").insert(member.dict(exclude_none=True)).execute()
        return response.data
    except Exception as e:
        print(" Error inserting member:", e)
        raise HTTPException(status_code=500, detail=str(e))

# PUT (edit) a member
@app.put("/members/{member_id}")
def update_member(member_id: int, member: Member):
    response = supabase.table("members").update(member.dict(exclude_none=True)).eq("id", member_id).execute()
    return response.data

# DELETE a member
@app.delete("/members/{member_id}")
def delete_member(member_id: int):
    response = supabase.table("members").delete().eq("id", member_id).execute()
    return {"message": "Member deleted"}


