import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PetList from './pages/PetList/PetList';
import PetDetail from './pages/PetDetail/PetDetail';
import MyAdoptions from './pages/MyAdoptions/MyAdoptions';
import SubmitPet from './components/SubmitPet/SubmitPet';
import OnlyAdmin from './pages/OnlyAdmin/OnlyAdmin';
import FilteredPets from './pages/FilteredPets/FilteredPets';
import './styles/global.css';
import UnderDevelopment from './components/UnderDevelopment.jsx';
import Footer from './pages/Home/Footer';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pets" element={<FilteredPets />} />
        <Route path="/pets/all" element={<PetList />} />
        <Route path="/pets/:id" element={<PetDetail />} />
        <Route path="/my-adoptions" element={<MyAdoptions />} />
        <Route path="/submit-pet" element={<SubmitPet />} />
        <Route path="/only-admin" element={<OnlyAdmin />} />
        <Route path="/about" element={<UnderDevelopment />} />
        <Route path="/contact" element={<UnderDevelopment />} />
        <Route path="/privacy-policy" element={<UnderDevelopment />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
