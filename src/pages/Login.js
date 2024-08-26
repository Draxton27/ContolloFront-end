import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../useStore";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const entry = {
  email: "",
  password: "",
};

export default function Login() {
  const { password, setPassword, clearError } = useStore();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false); // State to manage redirection and prevent loops

  // Function to show error notifications
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

  // Check for JWT in cookies and validate it with the backend
  useEffect(() => {
    const jwt = Cookies.get('jwt');
    if (jwt && !isRedirecting) {  // Proceed only if there's no ongoing redirection
      setIsRedirecting(true);  // Mark as redirecting to prevent multiple redirections
      fetch("http://localhost:26417/api/auth/tokeninfo", {
        method: "GET",
        credentials: "include", 
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Invalid JWT");
        }
        return response.json();
      })
      .then(data => {
        if (data.userId) {
          navigate('/tasks');  // Redirect to tasks if JWT is valid
        } else {
          notify("Invalid session. Please log in again.");
          Cookies.remove('jwt');
          setIsRedirecting(false);  // Reset redirecting state if redirection is not needed
        }
      })
      .catch(error => {
        Cookies.remove('jwt');
        notify("Error validating session. Please log in again.");
        setIsRedirecting(false);  // Reset redirecting state on error
      });
    }
  }, [navigate, isRedirecting]);

  // Handle form submission for login
  const handleSubmit = async (event) => {
    event.preventDefault();

    entry.email = email;
    entry.password = password;

    clearError();  // Clear previous errors

    const url = "http://localhost:26417/api/auth/login";

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",  // Ensure cookies are included in the request
        body: JSON.stringify(entry),  // Send email and password to the backend
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('jwt', data.token, { secure: false, sameSite: 'strict' });  // Store the JWT in cookies
        navigate('/tasks');  // Redirect to tasks on successful login
      } else {
        const errorData = await response.json();
        notify(`Error: ${errorData.message}`);  // Notify the user if there's an error
      }
    } catch (error) {
      notify("ERROR");  // Notify the user if the request fails
    } finally {
      setPassword('');  // Clear the password field
    }
  }

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
            Log in into your account
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
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to='/auth/register' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign Up</Link>
          </p>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}
