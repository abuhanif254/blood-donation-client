import useAuth from './useAuth';

const useAdmin = () => {
    const { user, loading } = useAuth();
    const isAdmin = !loading && user?.role === 'admin';
    return [isAdmin, loading];
};

export default useAdmin;
