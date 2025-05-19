# FT-FT-SD-40-Team-90-68262ac5

# 🧠 MemeHub

MemeHub is a full-stack web application that allows users to create, share, and manage memes. Users can register, log in, upload memes with tags and images, and view them in a dynamic dashboard.

## 📦 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Uploads:** Multer
- **Environment Management:** dotenv

---

## 🚀 Features

- 🔐 User Authentication (Register/Login)
- 📤 Upload memes (with image and tags)
- 📋 View all memes with sorting options
- 🗑️ Edit and Delete memes
- 📊 Dashboard with meme stats (votes, views, comments)
- 🧾 Clean UI with responsive design

---

## 🗂️ Folder Structure

project-root/
│
├── public/ # Frontend files (HTML, CSS, JS)
│ ├── index.html
│ ├── create.html
│ ├── dashboard.html
│ ├── login.html
│ ├── register.html
│ └── styles.css
│
├── uploads/ # Uploaded meme images
│
├── models/ # Mongoose models
│ ├── Meme.js
│ └── User.js
│
├── middleware/
│ └── auth.js # JWT verification middleware
│
├── .env # Environment variables (e.g. JWT secret)
├── .gitignore
├── package.json
└── server.js # Main backend entry

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/tusharjaiswal28/FT-FT-SD-40-Team-90-68262ac5.git
cd FT-FT-SD-40-Team-90-68262ac5

2. Install dependencies

npm install

3. Create .env file

PORT=3000
JWT_SECRET=your_super_secret_key
MONGO_URI=mongodb://127.0.0.1:27017/memehub

4. Start the server

node server.js
```