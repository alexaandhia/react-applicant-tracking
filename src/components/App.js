import React from 'react';
import { Routes, Route } from 'react-router-dom';
import "./app.css";
import Header from './Header';
import Footer from './Footer';
import SideNav from './SideNav';
import Home from './Home';
import FormAdd from './FormAdd';
import Applicants from './Applicants';
import Skill from './Skill';

function App() {
  return (
    <div className="wrapper">
      <Header/>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<FormAdd />} />
          <Route path="/data" element={<Applicants />} />
          <Route path="/skill" element={<Skill />} />
       </Routes>
      <SideNav/>
      <Footer/>
      
      
    </div>
  );
}

export default App;
