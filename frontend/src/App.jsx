import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PetList from './pages/PetList/PetList';
import PetDetail from './pages/PetDetail/PetDetail';
import AdoptionRequest from './pages/AdoptionRequest/AdoptionRequest';
import MyAdoptions from './pages/MyAdoptions/MyAdoptions';
import SubmitPet from './components/SubmitPet/SubmitPet';
import OnlyAdmin from './pages/OnlyAdmin/OnlyAdmin';
import Organization from './pages/Organization/Organization';
import ToastTest from './components/ToastTest/ToastTest';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './styles/global.css';
import Footer from './pages/Home/Footer';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pets/all" element={<PetList />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/adopt/:petId" element={<AdoptionRequest />} />
            <Route path="/my-adoptions" element={<MyAdoptions />} />
            <Route path="/submit-pet" element={<SubmitPet />} />
            <Route path="/only-admin" element={<OnlyAdmin />} />
            <Route path="/toast-test" element={<ToastTest />} />

            <Route 
              path="/organization" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Organization />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;
