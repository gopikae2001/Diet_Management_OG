import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FoodProvider } from './context/FoodContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNavBar from './components/TopNavBar';
import SideBar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import FoodItemForm from './pages/Fooditem';
import FoodItemData from './pages/fooditemdata';
import DietPackageForm from './pages/Dietpackage';
import DietPackageList from './pages/Dietpackagelist';
import DietRequest from './pages/DietRequest';
import DietRequestApproval from './pages/DietRequestApproval';
import DietOrderForm from './pages/DietOrderForm';
import PatientDietHistory from './pages/PatientDietHistory';
import DieticianInterface from './pages/Dietician';
import CanteenInterface from './pages/Canteen';

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  return (
    <FoodProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#d9e0e7' }}>
          <TopNavBar />
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <SideBar collapsed={sidebarCollapsed}/>
            <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
              <Routes>
                <Route path="/" element={<Dashboard sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />} />
                <Route path="/dashboard" element={<Dashboard sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />} />
                <Route path="/food-item" element={<FoodItemForm sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/food-item/:id" element={<FoodItemForm sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/fooditemdata" element={<FoodItemData sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/dietpackage" element={<DietPackageForm sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/dietpackagelist" element={<DietPackageList sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/dietpackage/:id" element={<DietPackageForm sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/dietrequest" element={<DietRequest sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/dietrequestapproval" element={<DietRequestApproval sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/dietorderform" element={<DietOrderForm sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/dietician" element={<DieticianInterface sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/canteen" element={<CanteenInterface sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
                <Route path="/patientdiethistory" element={<PatientDietHistory sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar}/>} />
              </Routes>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={1500} />
      </Router>
    </FoodProvider>
  );
};

export default App;