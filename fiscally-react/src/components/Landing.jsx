import React from "react";

const Landing = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Fiscally</h1>
      <p className="text-gray-600 mb-6 max-w-md text-center">
        Track your income, expenses, and balance with clear insights
        and powerful analytics.
      </p>

      <div className="flex gap-4">
        <button
          onClick={onLogin}
          className="px-6 py-2 bg-purple-700 text-white rounded-lg"
        >
          Login
        </button>
        <button
          onClick={onRegister}
          className="px-6 py-2 border border-purple-700 text-purple-700 rounded-lg"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Landing;
