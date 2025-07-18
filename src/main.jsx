import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/Auth/authContext"; // Correct import path
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterSubscriber from "./pages/AccountManagement/registerSubscriber";
import SearchSubscriber from "./pages/AccountManagement/searchSubscriber";
import ViewPendingSubscriber from "./pages/AccountManagement/viewPendingSubscriber";
import ViewWebUsers from "./pages/WebUsers/viewWebUsers";
import RegisterNewUsers from "./pages/WebUsers/registerNewUser";
import ManageUserLevel from "./pages/WebUsers/manageUserLevel";
import RolesConfiguration from "./pages/WebUsers/rolesConfiguration";
import AuditTrail from "./pages/AuditTrail/auditTrail";
import AllocateCash from "./pages/Funds/allocateCash";
import WalletToBank from "./pages/Funds/walletToBank";
import BatchUploadedFiles from "./pages/Funds/batchUploadedFiles";
import BatchPaymentUpload from "./pages/Funds/batchPaymentUpload";
import BatchFiles from "./pages/Funds/batchFiles";
import RequestReports from "./pages/Reports/requestReports";
import PrivateRoute from "./components/Auth/PrivateRoute";
import "./i18n";
import Layout from "./components/Layout";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Router basename="/demoapp-merchant">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          {/* Account Management */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Layout username="John Doe"><SearchSubscriber /></Layout>} />}
          />
          <Route
            path="/account/register"
            element={<PrivateRoute element={<Layout username="John Doe"><RegisterSubscriber /></Layout>} />}
          />
          <Route
            path="/account/search"
            element={<PrivateRoute element={<Layout username="John Doe"><SearchSubscriber /></Layout>} />}
          />
          <Route
            path="/account/view-pending"
            element={<PrivateRoute element={<Layout username="John Doe"><ViewPendingSubscriber /></Layout>} />}
          />
          {/* Web Users */}
          <Route
            path="/web-users/view-web-users"
            element={<PrivateRoute element={<Layout username="John Doe"><ViewWebUsers /></Layout>} />}
          />
          <Route
            path="/web-users/register-new-user"
            element={<PrivateRoute element={<Layout username="John Doe"><RegisterNewUsers /></Layout>} />}
          />
          <Route
            path="/web-users/manage-user-level"
            element={<PrivateRoute element={<Layout username="John Doe"><ManageUserLevel /></Layout>} />}
          />
          <Route 
            path="/web-users/roles-configuration"
            element={<PrivateRoute element={<Layout username="John Doe"><RolesConfiguration /></Layout>} />}
          />
          {/* Funds */}
          <Route
            path="/funds/allocate-cash"
            element={<PrivateRoute element={<Layout username="John Doe"><AllocateCash /></Layout>} />}
          />
          <Route
            path="/funds/wallet-to-bank"
            element={<PrivateRoute element={<Layout username="John Doe"><WalletToBank /></Layout>} />}
          />
          <Route
            path="/funds/batch-uploaded-files"
            element={<PrivateRoute element={<Layout username="John Doe"><BatchUploadedFiles /></Layout>} />}
          />
          <Route
            path="/funds/batch-payment-upload"
            element={<PrivateRoute element={<Layout username="John Doe"><BatchPaymentUpload /></Layout>} />}
          />
          <Route
            path="/funds/batch-files"
            element={<PrivateRoute element={<Layout username="John Doe"><BatchFiles /></Layout>} />}
          />
          {/* Reports */}
          <Route
            path="/reports/request-reports"
            element={<PrivateRoute element={<Layout username="John Doe"><RequestReports /></Layout>} />}
          />
          {/* Audit Trail */}
          <Route
            path="/audit-trail"
            element={<PrivateRoute element={<Layout username="John Doe"><AuditTrail /></Layout>} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
