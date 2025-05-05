import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import Home from "./Pages/Home";

import Login from "./Pages/Login";

import ApplicationForm from "./Pages/ApplicationForm";
import Competitions from './Pages/Competitions';

function App() {
  

  return (
    <>
    {/*<Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/apply" element={<ApplicationForm />} />
      </Routes>
    </Router>*/}
    <Competitions></Competitions>
    </>
  );
}

export default App;
