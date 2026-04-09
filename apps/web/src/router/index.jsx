import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

import LoginPage from '../pages/Login/LoginPage.jsx';
import QRCheckInPage from '../pages/QRCheckIn/QRCheckInPage.jsx';
import MiQRPage from '../pages/MiQR/MiQRPage.jsx';
import CheckInKioskPage from '../pages/CheckInKiosk/CheckInKioskPage.jsx';
import ClientsPage from '../pages/Clients/ClientsPage.jsx';
import ClientProfilePage from '../pages/ClientProfile/ClientProfilePage.jsx';
import AttendancePage from '../pages/Attendance/AttendancePage.jsx';
import MembershipsPage from '../pages/Memberships/MembershipsPage.jsx';
import MembershipPlansPage from '../pages/MembershipPlans/MembershipPlansPage.jsx';
import MetricsPage from '../pages/Metrics/MetricsPage.jsx';
import TrainingPlansPage from '../pages/TrainingPlans/TrainingPlansPage.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/check-in/:token',
    element: <QRCheckInPage />,
  },
  {
    path: '/kiosk',
    element: <CheckInKioskPage />,
  },
  {
    path: '/mi-qr/:token',
    element: <MiQRPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <Navigate to="/clients" replace /> },
      { path: '/clients', element: <ClientsPage /> },
      { path: '/clients/:id', element: <ClientProfilePage /> },
      { path: '/attendance', element: <AttendancePage /> },
      { path: '/memberships', element: <MembershipsPage /> },
      { path: '/membership-plans', element: <MembershipPlansPage /> },
      { path: '/metrics/:clientId', element: <MetricsPage /> },
      { path: '/training-plans/:clientId', element: <TrainingPlansPage /> },
    ],
  },
]);

export default router;
