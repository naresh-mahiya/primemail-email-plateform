# PrimeMail - Modern Email Platform

![PrimeMail Logo](https://via.placeholder.com/150x50?text=PrimeMail)

PrimeMail is a modern, feature-rich email platform built with the MERN stack and AI capabilities. It provides a Gmail-like interface with advanced email management capabilities and intelligent features to enhance productivity.

## Features

- **User Authentication**: Secure registration and login system
- **Email Composition**: Create and send emails to multiple recipients
- **Email Organization**: Inbox, Sent, and Starred views
- **Email Threading**: View complete email conversations in threads
- **Email Actions**: Reply, forward, star/unstar, and delete emails
- **Email Scheduling**: Schedule emails to be sent at a later time
- **Email Tracking**: Track when emails are read by recipients with blue read ticks
- **Responsive UI**: Modern interface built with React and Tailwind CSS


##Actively working hard on the following features:

- **Attachment Support**: Send and receive files of various formats
- **Advanced Search**: Find any email instantly with powerful search capabilities
- **AI-Powered Features**:
  - Email summarization to quickly grasp long conversations
  - Smart email composition assistance
  - Automatic email categorization (Urgent, Work, Personal, etc.)
- **Cross-Platform Integration**: Seamless communication with other email services
- **Two-Factor Authentication (2FA)**: Enhanced security for your email account
- **Email Drafts**: Save emails to finish composing later
- **Smart Categories & Labels**: Organize your emails with custom categories

## Tech Stack

### Frontend
- React 18
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API requests
- React Hot Toast for notifications
- React Avatar for user avatars

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- node-cron for scheduling emails

## Project Structure

```
primemail/
├── backend/                # Backend server code
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database connection
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   └── index.js            # Server entry point
│
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/                # Source code
│       ├── assets/         # Images and other assets
│       ├── components/     # React components
│       ├── hooks/          # Custom React hooks
│       ├── redux/          # Redux store and slices
│       ├── App.jsx         # Main application component
│       └── main.jsx        # Application entry point
```

## Getting Started


### Installation

1. Clone the repository
   ```
   git clone https://github.com/naresh-mahiya/primemail-email-plateform.git
   cd primemail
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the backend directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`



## Author

- **Naresh Mahiya** - [GitHub Profile](https://github.com/naresh-mahiya)

## License

This project is licensed under the ISC License
