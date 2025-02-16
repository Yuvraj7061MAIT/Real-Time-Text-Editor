# Real-Time-Editor

## Overview
Real-Time-Editor is a collaborative text editor that allows multiple users to edit documents in real time. It consists of a **frontend** (React) and a **backend** (Node.js with Express, MongoDB, and Socket.io).

---

## Folder Structure
```
Real-Time-Editor/
│── frontend/       # React application
│── backend/        # Node.js backend
```

---

## Backend Setup (Node.js, Express, MongoDB, Socket.io)

### Prerequisites
- [Node.js](https://nodejs.org/) 
- [MongoDB](https://www.mongodb.com/) (local or cloud instance like MongoDB Atlas)

### Installation
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Environment Variables
Create a `.env` file in the `backend` directory with the following content:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### Running the Backend Server
```sh
node server.js
```
The server will start at `http://localhost:5000`.

---

## Frontend Setup (React)

### Prerequisites
- [Node.js](https://nodejs.org/) 

### Installation
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Frontend Server
```sh
npm start
```
The React app will be available at `http://localhost:3000`.

---

## Features
- Real-time document collaboration
- WebSocket-based communication using Socket.io
- Backend powered by Express and MongoDB for document storage
- REST API for fetching and updating documents

---

## API Routes
### **Backend API Endpoints**
#### 1. Create a New Document
- **Endpoint:** `POST /api/docs`
- **Description:** Creates a new document.
- **Request Body:** `{ "content": "Document content here" }`

#### 2. Fetch a Document by ID
- **Endpoint:** `GET /api/docs/:id`
- **Description:** Retrieves a document by its ID.

#### 3. Update a Document
- **Endpoint:** `PATCH /api/docs/:id`
- **Description:** Updates an existing document.
- **Request Body:** `{ "content": "Updated content" }`

---

## WebSocket Events
### **Client to Server Events**
- `joinDocument`: Joins a document room
- `updateDocument`: Sends updated document content

### **Server to Client Events**
- `loadDocument`: Sends initial document content
- `documentUpdated`: Broadcasts updates to all users in the room

---

## Running Both Frontend & Backend Together
1. Open **two terminal windows**.
2. Start the backend:
   ```sh
   cd backend && node server.js
   ```
3. Start the frontend:
   ```sh
   cd frontend && npm start
   ```
4. Open `http://localhost:3000` in your browser to access the application.

