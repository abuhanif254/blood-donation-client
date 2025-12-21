import useAuth from './useAuth';

const useVolunteer = () => {
    const { user, loading } = useAuth();
    // Admin is also a volunteer implicitly for access purposes usually, 
    // but strict check: user?.role === 'volunteer'
    // Requirements say "Admin has access to all features", so Admin should pass volunteer checks too.
    const isVolunteer = !loading && (user?.role === 'volunteer' || user?.role === 'admin');
    return [isVolunteer, loading];
};

export default useVolunteer;
