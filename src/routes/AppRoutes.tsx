import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Semesters from "../pages/Semesters";
import Specializations from "../pages/Specializations";
import JobPreferred from "../pages/JobPreferred";
import DISCActivities from "../pages/DISCActivities";
import Analytics from "../pages/Analytics";
import StudentView from "../pages/StudentView";
import Batch from "../pages/Batch";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Students */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/batch"
          element={
            <ProtectedRoute>
              <Batch />
            </ProtectedRoute>
          }
        />

        {/* Semesters */}
        <Route
          path="/semesters"
          element={
            <ProtectedRoute>
              <Semesters />
            </ProtectedRoute>
          }
        />

        {/* Specializations */}
        <Route
          path="/specializations"
          element={
            <ProtectedRoute>
              <Specializations />
            </ProtectedRoute>
          }
        />

        {/* Jobs */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobPreferred />
            </ProtectedRoute>
          }
        />

        {/* DISC Activities */}
        <Route
          path="/disc"
          element={
            <ProtectedRoute>
              <DISCActivities />
            </ProtectedRoute>
          }
        />

        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route path="/student-view" element={<StudentView />} />

        {/* Redirect Unknown URLs */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
