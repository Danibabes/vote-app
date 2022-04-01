import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

//!  Components
import Login from './components/Login';
import Welcome from './components/Welcome';
import PageBallot from './pages/PageBallot';


const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate('/');
    } else {
      navigate('/welcome');
    }
  }, [])


  return (
    <>
      <Routes>
        <Route exact path='/' element={<Login/> } />
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/ballot' element={<PageBallot/>} />
      </Routes>
    </>
  )
}

export default App;