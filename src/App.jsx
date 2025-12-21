import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import VolunteerRoute from './routes/VolunteerRoute';
import Loading from './components/Loading';

// Layouts
const MainLayout = lazy(() => import('./layout/MainLayout'));
const DashboardLayout = lazy(() => import('./layout/DashboardLayout'));

// Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Search = lazy(() => import('./pages/Search'));
const DonationRequests = lazy(() => import('./pages/DonationRequests'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const CreateDonationRequest = lazy(() => import('./pages/CreateDonationRequest'));
const MyDonationRequests = lazy(() => import('./pages/MyDonationRequests'));
const DonationRequestDetails = lazy(() => import('./pages/DonationRequestDetails'));
const UpdateDonationRequest = lazy(() => import('./pages/UpdateDonationRequest'));
const AllUsers = lazy(() => import('./pages/AllUsers'));
const AllDonationRequests = lazy(() => import('./pages/AllDonationRequests'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Funding = lazy(() => import('./pages/Funding'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="donation-requests" element={<DonationRequests />} />
            <Route path="search" element={<Search />} />
            <Route path="blog" element={<div>Blog (Optional)</div>} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="funding" element={<PrivateRoute><Funding /></PrivateRoute>} />
          </Route>

          <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="create-donation-request" element={<PrivateRoute><CreateDonationRequest /></PrivateRoute>} />
            <Route path="my-donation-requests" element={<PrivateRoute><MyDonationRequests /></PrivateRoute>} />
            <Route path="donation-requests/:id" element={<DonationRequestDetails />} />
            <Route path="donation-requests/edit/:id" element={<PrivateRoute><UpdateDonationRequest /></PrivateRoute>} />
            <Route path="all-users" element={<AdminRoute><AllUsers /></AdminRoute>} />
            <Route path="all-blood-donation-request" element={<VolunteerRoute><AllDonationRequests /></VolunteerRoute>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
