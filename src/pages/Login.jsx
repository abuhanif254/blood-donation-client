import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const Login = () => {
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const handleGoogleLogin = async () => {
        try {
            await googleLogin();
            Swal.fire({
                icon: 'success',
                title: 'Welcome!',
                text: 'Google Login successful',
                timer: 1500,
                showConfirmButton: false
            });
            navigate(from, { replace: true });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Could not login with Google. Ensure backend supports it or try email.',
            });
        }
    };

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            await Swal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                text: 'Login successful',
                timer: 1500,
                showConfirmButton: false
            });
            navigate(from, { replace: true });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || 'Invalid email or password',
            });
        }
    };

    // Auto-fill credentials for easy testing
    const handleDemoLogin = (role) => {
        if (role === 'admin') {
            setValue('email', 'admin@blood.com');
            setValue('password', '123456');
        } else {
            setValue('email', 'testuser@example.com');
            setValue('password', 'password123');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-neutral dark:bg-neutral-dark py-10 px-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 sm:p-10">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to continue to BloodUnity</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="input-field"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="input-label mb-0">Password</label>
                            <a href="#" className="text-xs text-primary font-semibold hover:underline">Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className="input-field"
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary py-3.5 text-base"
                    >
                        Sign In
                    </button>
                </form>

                {/* Demo Login Buttons */}
                <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-center text-slate-600 dark:text-slate-400 mb-3 font-semibold">
                        🎯 Quick Login (For Testing)
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => handleDemoLogin('admin')}
                            className="flex-1 flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            Login as Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDemoLogin('user')}
                            className="flex-1 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            Demo User
                        </button>
                    </div>
                    <p className="text-xs text-center text-slate-500 dark:text-slate-500 mt-2">
                        Admin: admin@blood.com / 123456
                    </p>
                </div>

                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
                    <span className="px-4 text-slate-400 text-xs uppercase tracking-wide font-medium">Or continue with</span>
                    <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary dark:hover:border-primary transition cursor-pointer group">
                        <FcGoogle className="w-5 h-5" /> <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-accent dark:hover:border-accent transition group">
                        <FaFacebook className="w-5 h-5 text-blue-600 group-hover:text-blue-700" /> <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Facebook</span>
                    </button>
                </div>

                <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
