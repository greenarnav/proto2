import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const sendEmailData = async (email: string): Promise<void> => {
    try {
      const requestBody = { email_id: email };
      const res = await fetch('http://44.201.122.3/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        // Handle non-200 status codes
        const errorText = await res.text();
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
      }

      const responseData = await res.json();
      console.log('Response:', responseData);
    } catch (error) {
      console.error('Error sending email data:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      localStorage.setItem('email', email);
      await sendEmailData(email);
      navigate('/home');
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-80">
        <input
          type="email"
          placeholder="Enter Your Email ID"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {error && (
          <div className="text-red-500 mt-2 text-sm">
            {error}
          </div>
        )}
        <button 
          type="submit" 
          className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;