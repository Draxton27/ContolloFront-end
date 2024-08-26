import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useStore from "../useStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

export default function Register() {
    const { password, passwordConfirmation, error, setPassword, setPasswordConfirmation, setError, clearError } = useStore();
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // Function to display toast notifications
    const notify = (message) => {
        toast(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    // Verify JWT in cookies and validate it with the backend
    useEffect(() => {
        const jwt = Cookies.get('jwt');
        if (jwt) {
            fetch("http://localhost:26417/api/auth/tokeninfo", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.userId) {
                    navigate('/tasks'); // Redirect to tasks if token is valid
                } else {
                    Cookies.remove('jwt'); // Remove invalid JWT
                    notify("Invalid session. Please register or log in again.");
                }
            })
            .catch(error => {
                Cookies.remove('jwt'); // Remove JWT if validation fails
                notify("Error validating session. Please register or log in again.");
            });
        }
    }, [navigate]);

    // Handle registration form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const entry = {
            id: "",
            email: "",
            password: "",
            notes: []
        };

        entry.email = email;
        entry.password = password;

        // Password validation checks
        if (password !== passwordConfirmation) {
            notify('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            notify('Password must be at least 8 characters long');
            return;
        }
        
        if (!/[A-Z]/.test(password)) {
            notify('Password must contain at least one uppercase letter');
            return;
        }

        if (!/[a-z]/.test(password)) {
            notify('Password must contain at least one lowercase letter');
            return;
        }

        if (!/[0-9]/.test(password)) {
            notify('Password must contain at least one number');
            return;
        }

        clearError(); // Clear any existing errors

        try {
            const response = await fetch('http://localhost:26417/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include", // Include cookies in the request
                body: JSON.stringify(entry), // Send the registration data to the server
            });

            if (response.ok) {
                notify('User registered successfully');
                navigate('/tasks'); // Redirect to tasks after successful registration
            } else {
                const errorData = await response.json();
                notify(`Error: ${errorData.message}`); // Notify user of registration errors
            }
        } catch (error) {
            notify("ERROR"); // Notify user if registration fails
        } finally {
            setPassword(''); // Clear password field
            setPasswordConfirmation(''); // Clear password confirmation field
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Contollo Consulting"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create an account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form method="POST" className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="passwordConfirmation" className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirm password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="passwordConfirmation"
                                    name="passwordConfirmation"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to='/auth/login' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Log in now</Link>
                    </p>
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}
