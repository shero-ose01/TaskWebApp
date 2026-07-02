# Task/Note WebApp

A Task management webapp using C# ASP.NET for the backend and Vite+React for frontend.
This is a learning Project, my main focus was on the backend and auth. Frontend was made with react and the for the design/css I used AI to create a template which i edited afterwards myself. 

**It's live at [taskapp.s-ose.de](https://taskapp.s-ose.de)**

# Screenshots
<img width="416" height="224" alt="image" src="https://github.com/user-attachments/assets/326e08f5-a7c6-4d97-83b4-ea157a3b5df0" />
<img width="450" height="276" alt="image" src="https://github.com/user-attachments/assets/ff662c33-efe3-489f-a9ae-54b75836552a" />
<img width="400" height="267" alt="image" src="https://github.com/user-attachments/assets/bc7894c1-9ad4-4a1c-b0fe-bca6a6165be3" />
<img width="374" height="310" alt="image" src="https://github.com/user-attachments/assets/ce70a2e1-4180-4962-bdc2-e1b0a6fd2115" />

## Functionality

**Task management**
- Create, update, delete, list tasks
- Fields: title, description, state (Pending / InProgress / Done), due date
- Filtering and search

**Backend**
- ASP.NET Core 10
- Entity Framework Core 10 with Npgsql
- PostgreSQL
- JWT bearer authentication with BCrypt
- MailKit for SMTP

**Frontend**
- Vite + React + TypeScript

## Self-Host

Setup Docker and selfhosted with nginx and Cloudflare Tunnel under <a href="https://taskapp.s-ose.de">taskapp.s-ose.de</a>.

## Running locally

```bash
cp .env.example
# rename it to .env and fill in the values
docker compose up -d --build
```

## AI Usage
I used AI for web search, example files , debugging/editor functionality and the css/design.  

