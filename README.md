# 🛠️ Job Portal Admin Dashboard

The **Portal Admin Dashboard** is a web-based admin panel designed to manage and monitor a Job Portal system.  
It provides real-time insights, analytics, and full control over users, jobs, companies, and applications.

This project is built as a **separate admin system** and lives inside a local folder with a `dashboard` directory.

---

## 🚀 Features

### 📊 Dashboard Overview
- View **total users**
- View **total applications**
- View **active jobs**
- View **registered companies**

### 📈 Analytics & Insights
- **Growth Overview** with line/bar charts
- **Job Categories Distribution** using pie charts
- Detailed analytics with interactive graphs

### 🧑‍💼 Admin Management
- View all users
- Delete users
- View all job posts
- Delete jobs
- Monitor system activity in real time

---

## 🧩 Tech Stack

### Frontend
- **React + Vite**
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Recharts** (Charts & Graphs)

### Backend
- **Supabase**
  - Authentication (Admin access)
  - Database
  - Storage

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/awokeatanaw/portal-admin-master.git
cd portal-admin-master/dashboard
```
### 2. Install dependencies
```bash
npm install
```
### 3. Environment Variables
Create a .env file inside the dashboard folder:
```bash
Copy code
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the admin dashboard
```bash
npm run dev
```
## 💻 Usage

1.Log in as an Admin

2.View platform statistics and analytics

3.Monitor user and job growth

4.Delete users or job posts when necessary

5.Track job categories and application trends visually

## 📸 Screenshots

(Add dashboard screenshots here)

## 🤝 Contributing

Contributions are welcome!

1.Fork the repository

2.Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

3.Commit your changes
```bash
git commit -m "Add admin feature"
```

Push to your branch and open a Pull Request

## 📄 License

This project is licensed under the MIT License.
