import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

import LoginPage from '../pages/Login/LoginPage.jsx';
import QRCheckInPage from '../pages/QRCheckIn/QRCheckInPage.jsx';
import MiQRPage from '../pages/MiQR/MiQRPage.jsx';
import CheckInKioskPage from '../pages/CheckInKiosk/CheckInKioskPage.jsx';
import KioscoPage from '../pages/Kiosco/KioscoPage.jsx';
import KioscoScanPage from '../pages/Kiosco/KioscoScanPage.jsx';
import UnauthorizedPage from '../pages/Unauthorized/UnauthorizedPage.jsx';

import ClientsPage from '../pages/Clients/ClientsPage.jsx';
import ClientProfilePage from '../pages/ClientProfile/ClientProfilePage.jsx';
import AttendancePage from '../pages/Attendance/AttendancePage.jsx';
import MembershipsPage from '../pages/Memberships/MembershipsPage.jsx';
import MembershipPlansPage from '../pages/MembershipPlans/MembershipPlansPage.jsx';
import MetricsPage from '../pages/Metrics/MetricsPage.jsx';
import GymMetricsPage from '../pages/GymMetrics/GymMetricsPage.jsx';
import TrainingPlansPage from '../pages/TrainingPlans/TrainingPlansPage.jsx';
import UsersPage from '../pages/Users/UsersPage.jsx';
import MyProfilePage from '../pages/MyProfile/MyProfilePage.jsx';
import FinancesPage from '../pages/Finances/FinancesPage.jsx';
import FinanceDetailPage from '../pages/Finances/FinanceDetailPage.jsx';

const router = createBrowserRouter([
  { path: '/login',            element: <LoginPage /> },
  { path: '/check-in/:token',   element: <QRCheckInPage /> },
  { path: '/mi-qr/:token',      element: <MiQRPage /> },
  { path: '/kiosk',             element: <CheckInKioskPage /> },
  { path: '/kiosco',            element: <KioscoPage /> },
  { path: '/kiosco-scan/:token', element: <KioscoScanPage /> },
  { path: '/unauthorized',     element: <UnauthorizedPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      { path: '/',                          element: <Navigate to="/clients" replace /> },
      { path: '/clients',                   element: <ClientsPage /> },
      { path: '/clients/:id',               element: <ClientProfilePage /> },
      { path: '/attendance',                element: <AttendancePage /> },
      { path: '/memberships',               element: <MembershipsPage /> },
      { path: '/membership-plans',          element: <MembershipPlansPage /> },
      { path: '/metrics/:clientId',         element: <MetricsPage /> },
      { path: '/gym-metrics',               element: <GymMetricsPage /> },
      { path: '/training-plans/:clientId',  element: <TrainingPlansPage /> },
      { path: '/users',                     element: <ProtectedRoute module="users" required="full"><UsersPage /></ProtectedRoute> },
      { path: '/my-profile',                element: <MyProfilePage /> },
      { path: '/finances',                  element: <ProtectedRoute module="finances" required="read"><FinancesPage /></ProtectedRoute> },
      { path: '/finances/:categoryId',      element: <ProtectedRoute module="finances" required="read"><FinanceDetailPage /></ProtectedRoute> },
    ],
  },
]);

export default router;
