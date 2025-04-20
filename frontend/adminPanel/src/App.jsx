import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
const  apiURL = import.meta.env.VITE_SERVER_URL;

import Navbar from './components/Navbar/Navbar.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Content from './pages/content/Content.jsx';
import Feedback from './pages/feedback/Feedback.jsx';

function App() {
  console.log("I am here in app.jsc handeling");
  const LoginForm = () => {
    const [username, setUn] = useState('');
    const [pwd, setPwd] = useState('');
    const [isToRemember, setIsToRemember] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
      console.log("sending Login", username, pwd)
      e.preventDefault();
      console.log("I am here in app.jsc handeling");
      fetch(apiURL + '/adminLogin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username, 
          pwd: pwd,
          isToRemember: isToRemember
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            navigate('/');
          } else {
            alert("Invalid Credinials")
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });

    }

    return (
      <form action="" className='loginForm' onSubmit={(e) => { handleLogin(e) }}>
        <h2>Authenticate</h2>
        <hr />
        <div className='credsBox'>
          <label htmlFor="username">Enter Username</label>
          <input required value={username} type="text" placeholder='username' id='username' onChange={(e) => { setUn(e.target.value) }} />
        </div>
        <div className='credsBox'>
          <label htmlFor="pwd">Enter Password</label>
          <input required value={pwd} type="password" placeholder='password' id='pwd' onChange={(e) => { setPwd(e.target.value) }} />
        </div>
        <div className='extraHolder'>
          <div className='rememberMeBox'>
            <input checked={isToRemember} type="checkbox" name="" id="remember" onChange={(e) => { setIsToRemember((pre) => !pre) }} />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <a href="" className='forgotPwd'>Forgot Password ?</a>
        </div>
        <button className='loginBtn' type="submit">Login</button>
      </form>
    );
  }
  return (
    <BrowserRouter>
    <Navbar />
      <div>
        <div id="mainContentDiv">
          hi
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/content" element={<Content />} />
            <Route path="/feedback" element={<Feedback />} /> 
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
