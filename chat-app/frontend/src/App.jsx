import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Chat from './pages/Chat';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/chats" /> : <Login />} />
      <Route path="/chats" element={user ? <Chat /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? "/chats" : "/login"} />} />
    </Routes>
  );
}

export default App;
