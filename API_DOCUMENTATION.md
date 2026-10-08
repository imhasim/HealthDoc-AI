# HealthDoc-AI API Documentation

Base URL:

http://127.0.0.1:8000/api

---

## Authentication

HealthDoc-AI uses JWT (JSON Web Token) authentication.

For protected endpoints, send the access token in the request header:

```text
Authorization: Bearer <access_token>


1. User Registration
Endpoint
POST /api/register/
Description

Creates a new user account.

Request Body
{
  "username": "testuser1",
  "email": "test@gmail.com",
  "password": "your_password"
}
Success Response
{
  "message": "User registered successfully."
}


2. Login
Endpoint
POST /api/token/
Description

Authenticates the user and returns JWT access and refresh tokens.

Request Body
{
  "username": "testuser1",
  "password": "your_password"
}
Success Response
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}


3. Refresh Access Token
Endpoint
POST /api/token/refresh/
Description

Generates a new access token using the refresh token.

Request Body
{
  "refresh": "<refresh_token>"
}
Success Response
{
  "access": "<new_access_token>"
}


4. User Profile
Endpoint
GET /api/profile/
Authentication

Required.

Headers
Authorization: Bearer <access_token>
Description

Returns information about the authenticated user.

Example Response
{
  "username": "testuser1",
  "email": "test@gmail.com"
}


5. List User Documents
Endpoint
GET /api/documents/
Authentication

Required.

Description

Returns documents belonging to the authenticated user.

Headers
Authorization: Bearer <access_token>
Example Response
[
  {
    "id": 34,
    "file": "/documents/medical_report.pdf",
    "uploaded_at": "2026-10-08T12:30:00Z"
  }
]


6. Upload Medical PDF
Endpoint
POST /api/documents/upload/
Authentication

Required.

Content-Type
multipart/form-data
Headers
Authorization: Bearer <access_token>
Form Data
file: medical_report.pdf
Description

Uploads a medical PDF and processes it through the RAG pipeline.

The backend performs:

PDF validation
PDF text extraction
Text chunking
Sentence Transformer embeddings
ChromaDB storage
Success Response

The API returns information about the uploaded document.

Possible Errors
400 - Invalid PDF or request
401 - Authentication required
500 - Server error


7. Chat With Medical Document
Endpoint
POST /api/documents/chat/
Authentication

Required.

Headers
Authorization: Bearer <access_token>
Request Body
{
  "document_id": 34,
  "question": "What is the hemoglobin level?"
}
Description

Answers questions using information retrieved from the selected medical document.

The RAG pipeline:

Question
    ↓
Document Selection
    ↓
Similarity Search
    ↓
Relevant Chunks
    ↓
Context
    ↓
Llama 3.2
    ↓
Answer
Example Response
{
  "question": "What is the hemoglobin level?",
  "answer": "The hemoglobin level is 13.8 g/dL.",
  "sources": [
    {
      "document_id": 34
    }
  ]
}


8. Delete Document
Endpoint
DELETE /api/documents/<id>/
Authentication

Required.

Headers
Authorization: Bearer <access_token>
Example
DELETE /api/documents/34/
Description

Deletes a document belonging to the authenticated user.

The system also removes the corresponding document data from the vector database.

Success Response
{
  "messages": "document delete successfully"
}
Security

A user cannot delete another user's document.

API Security

HealthDoc-AI uses JWT authentication and user-level authorization.

Protected endpoints verify the authenticated user before accessing documents.

Users cannot:

Access another user's documents
Delete another user's documents
Chat with another user's documents
Error Handling

The API handles common errors including:

Status Code	Meaning
200	Request successful
201	Resource created
400	Bad request
401	Authentication required / invalid token
404	Resource not found
500	Internal server error


RAG Processing Pipeline
Medical PDF
     ↓
PDF Text Extraction
     ↓
Text Chunking
     ↓
Sentence Transformer
     ↓
Vector Embeddings
     ↓
ChromaDB
     ↓
Similarity Search
     ↓
Relevant Context
     ↓
Ollama + Llama 3.2
     ↓
AI Answer



Technology Used
Frontend
React
React Router
Axios
CSS
Vite
Backend
Python
Django
Django REST Framework
Simple JWT
Database
PostgreSQL
AI / RAG
Sentence Transformers
all-MiniLM-L6-v2
ChromaDB
LangChain Text Splitter
Ollama
Llama 3.2
Testing

The API was tested for:

User registration
Login
JWT authentication
Token refresh
Profile access
PDF upload
Invalid file handling
Document listing
Document deletion
User-specific document access
Unauthorized document access
RAG-based document questions
Chat responses
Error handling
