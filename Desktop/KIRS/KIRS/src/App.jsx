import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Reportfounditems from './Reportfounditems';
import Reportlostitems from './Reportlostitems';
import Verifyidentity from './Verifyidentity';
import AdminDashboard from './AdminDashboard';
import NewUsers from './NewUsers';
import ViewFoundItems from './ViewFoundItems';
import ViewLostItems from './ViewLostItems';
import AdminViewLost from './AdminViewLost';
import AdminViewFound from './AdminViewFound';
import AdminLogin from './AdminLogin';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/Home' element={<Home />} /> 
        <Route path='/Reportfounditems' element={<Reportfounditems />} />
        <Route path='/Reportlostitems' element={<Reportlostitems />} />
        <Route path='/Verifyidentity' element={<Verifyidentity />} />
        <Route path='/AdminDashboard' element={<AdminDashboard />} />
        <Route path='/NewUsers' element={<NewUsers />} />
        <Route path='/ViewFoundItems' element={<ViewFoundItems />} />
        <Route path='/ViewLostItems' element={<ViewLostItems />} />
        <Route path='/AdminViewLost' element={<AdminViewLost />} />
        <Route path='/AdminViewFound' element={<AdminViewFound />} />
        <Route path='/AdminLogin' element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
