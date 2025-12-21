import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useVolunteer from '../hooks/useVolunteer';

const VolunteerRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [isVolunteer, isVolunteerLoading] = useVolunteer();
    const location = useLocation();

    if (loading || isVolunteerLoading) {
        return <div>Loading...</div>;
    }

    if (user && isVolunteer) {
        return children;
    }

    return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default VolunteerRoute;
