import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCounters } from '../services/api';

const LoginPage = () => {
    const [role, setRole] = useState('');
    const [selectedCounter, setSelectedCounter] = useState('');
    const [counters, setCounters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCounters = async () => {
            try {
                const data = await fetchCounters();
                setCounters(data);
            } catch (err) {
                setError('Failed to load counters');
            }
        };
        loadCounters();
    }, []);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        if (selectedRole === 'customer') {
            setSelectedCounter('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (role === 'customer') {
                // Customers don't need to login, just store role and redirect
                localStorage.setItem('userRole', role);
                navigate('/services');
            } else {
                // Store counter staff info
                localStorage.setItem('userRole', role);
                localStorage.setItem('counterId', selectedCounter);
                // TODO: Replace with actual counter dashboard route once implemented
                navigate('/counter/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome to Queue Management
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please select your role to continue
                    </p>
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Role</label>
                            <select
                                value={role}
                                onChange={(e) => handleRoleSelect(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="customer">Customer</option>
                                <option value="counter">Counter Staff</option>
                            </select>
                        </div>

                        {role === 'counter' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select Counter</label>
                                <select
                                    value={selectedCounter}
                                    onChange={(e) => setSelectedCounter(e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    {counters.map((counter) => (
                                        <option key={counter.counter_id} value={counter.counter_id}>
                                            {counter.counter_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || !role || (role === 'counter' && !selectedCounter)}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                        >
                            {loading ? 'Processing...' : 'Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;