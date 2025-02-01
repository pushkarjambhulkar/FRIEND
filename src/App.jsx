import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./component/signup";
import Login from "./component/login";
import Home from "./component/Home";

import "./index.css"; // This line is correct
 <Route path="/" element={<Home />} />


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;