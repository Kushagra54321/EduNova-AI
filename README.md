# EduNova AI - Your Personal AI Study Assistant 🚀

EduNova AI is an all-in-one, AI-powered learning platform designed to revolutionize the way students study. Built with a modern, glassmorphism-inspired UI and seamless animations, it provides students with a smart, interactive, and personalized educational experience.

## 🌐 Live Demo
Check out the live application here: **[EduNova AI on Render](https://edunova-ai-xauf.onrender.com)**


## ✨ Key Features

- **🤖 AI Chat Assistant**: Ask questions and get instant, intelligent answers tailored for students.
- **📝 Smart Study Mode**: Upload PDFs or provide YouTube video links to instantly generate context-aware notes and summaries.
- **🧠 Quiz Generation**: Automatically create custom quizzes from your study material to test your knowledge.
- **📅 Study Planner**: Organize your learning with dynamic study plans.
- **📊 Progress Tracking**: Track your performance, study streaks, and learning milestones with intuitive analytics.
- **👤 User Profiles**: Personalized experience including study level customization, account security management, and Google Sign-in integration.
- **🌗 Dark/Light Mode**: Seamlessly toggle between dark and light themes for optimal reading comfort.
- **🎨 Modern UI/UX**: Stunning interface featuring glassmorphism and smooth micro-animations powered by Framer Motion.

## 🛠️ Technology Stack

### Frontend
- **React 19** with **Vite**
- **Tailwind CSS v4** for styling and responsive design
- **Framer Motion** for elegant animations and transitions
- **Recharts** for interactive data visualization
- **Lucide React** for beautiful icons
- **Axios** for API requests

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** for data storage
- **Groq SDK** for high-performance AI inference
- **JWT (JSON Web Tokens)** & **Bcrypt.js** for secure authentication
- **Multer** for handling file uploads (PDFs)
- **pdf-parse** & **youtube-transcript** for extracting text from study materials

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- [Groq API Key](https://console.groq.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/EduNova-AI.git
   cd EduNova-AI
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GROQ_API_KEY=your_groq_api_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory and configure your API URL if necessary:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:5173` (or the port provided by Vite).

## 📁 Project Structure

```text
EduNova-AI/
├── backend/               # Express server, routes, controllers, models, utils
│   ├── controllers/       # Application logic (e.g., smartStudyController)
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── utils/             # Helper functions (e.g., youtubeTranscript.js)
│   └── server.js          # Entry point
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages (Signup, Dashboard, etc.)
│   │   ├── context/       # React Context details (Theme, Auth)
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── index.css          # Global styles & Tailwind configs
│   └── vite.config.js     # Vite configuration
└── README.md              # Project documentation
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
