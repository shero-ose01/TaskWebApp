import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TasksPage } from "./pages/TasksPage";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";
import { EmailVerificationPage } from "./pages/EmailVerificationPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/tasks" element={<TasksPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
