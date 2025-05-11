Chat App with Real-time Features

This project is a chat application built with React for the frontend, Node.js for the backend, and MongoDB (local) as the database. The app includes real-time messaging, user typing status, last seen status, and online status using Socket.IO.

```Features
Real-time messaging: Users can send and receive messages instantly.

Typing status: Shows when a user is typing a message.

Online/Offline status: Displays if a user is online or offline.

Last seen: Shows when the user was last active.
```

```Tech Stack
Frontend: React.js

Backend: Node.js, Express.js, Socket.IO

Database: MongoDB (Local instance)

Real-time Communication: Socket.IO
```

```Prerequisites
Before you begin, ensure you have the following installed:

Node.js (Version 14 or later)

MongoDB (Local Instance)
```

```Setup
1. Clone the repository:
bash
Copy
Edit
git clone <repository-url>
cd <repository-name>
2. Frontend Setup (React)
Go to the frontend directory:

cd front-end
Install the dependencies:

npm install
3. Backend Setup (Node.js, Socket.IO)
Go to the server directory:

cd server
Install the backend dependencies:

npm install
```

```4. MongoDB Setup
Ensure you have MongoDB running locally. If you're using MongoDB locally, the connection URL in the backend (server/app.js) is set to connect to the default local MongoDB instance (mongodb://localhost:27017/your-database-name).

If MongoDB is running on a different port or if you're using a different instance, update the mongoose.connect URL accordingly in server/db.js.

5. Start the Application
To start both the frontend and backend:

Frontend (React):
In the front-end folder:

npm run dev
This will run the frontend on http://localhost:3000.

Backend (Node.js with Socket.IO):
In the server folder:

npm start
This will run the backend on http://localhost:3002.
```

```Usage
User Login: Upon entering the app, users can provide a username to log in.

Sending Messages: Once logged in, users can send messages in real-time.

Typing Status: If a user is typing, it will show a "typing..." message.

Online/Offline Status: Each user will be notified when another user is online or offline.

Last Seen: The app will display the last time a user was active.
```

```Notes
No environment variables are required for this project since it uses a local MongoDB instance.

The project uses Socket.IO for real-time communication between the frontend and backend.

The last seen feature updates the timestamp of the last activity and displays it to others in real-time.
```

```Contributing
Feel free to fork the repository and submit pull requests. Any improvements or suggestions are welcome.
```
