# Real-Time Chat Application

This is a real-time chat application that allows users to send and receive messages in real time. It provides features like creating chat rooms, joining existing ones, and exchanging messages with other users in the same room. The application uses Firebase for backend services and Google account authentication.

## Features

- User Authentication: Users can log in and log out using their Google accounts via Firebase Authentication.
- Chat Rooms: Users can create, join, and leave chat rooms.
- Real-Time Messaging: Messages sent by users appear in the chat room in real time.
- Message History: The application stores the history of messages for each chat room, visible to users when they   join the room.
- Private Messaging: Users can send private messages to other users.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Socket.IO
- Firebase Authentication

## Prerequisites

- Node.js installed
- MongoDB database connection
- Firebase project with Authentication enabled

## Getting Started

1. Clone the repository:

     git clone https://github.com/satyaveer1994/real-time-chat-app.git




2. Install dependencies:

        cd real-time-chat-app
        npm install



3. Configure the application:
   - Set up your MongoDB connection by updating the database URL in `config/database.js`.
   - Configure your Firebase project by updating the Firebase configuration in `config/firebase.js`.

4. Start the application:

        node src/index.js



5. Open your web browser and visit `http://localhost:3000` to access the chat application.

## Folder Structure

- `controllers`: Contains the application's controllers for handling routes and logic.
- `models`: Defines the database models using Mongoose.
- `routes`: Defines the application's routes.

## Contribution

Contributions are welcome! If you find any issues or have suggestions for improvement, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
