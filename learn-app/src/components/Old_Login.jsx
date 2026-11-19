//  Create a Login page  for my GenAI-React application
// which is going to  create a simple chatbot based on gemini api
// If the username is admin and password is admin123, then the user
//  should be redirected to the chatbot page. Otherwise, 
// an error message should be displayed.
//use tailwindcss for styling the login page . 
// 

import  { useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

    const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      navigate('/chatbot');
    } else {
      setError('Invalid username or password');
    }
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>    

            <input
              type="text"
              id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300" 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
                Login
            </button>
        </form>
        </div>
    </div>
    );
};
export default Login;














 