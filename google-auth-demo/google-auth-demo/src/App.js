// src/App.js
import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;


export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      {user ? (
        <ProfilePage user={user} logout={logout} />
      ) : (
        <LoginPage setUser={setUser} />
      )}
    </GoogleOAuthProvider>
  );
}
