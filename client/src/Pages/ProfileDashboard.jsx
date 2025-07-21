import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { User, Lock, LogOut, Link2 } from 'lucide-react';
import UserOverview from '../Components/Profile/UserOverview';
import UserSocialLinks from '../Components/Profile/UserAdditionalInfo';
import ChangePassword from '../Components/Profile/ChangePassword';
import AccountActions from '../Components/Profile/AccountsAction';
import Navbar from '../Components/Navbar';
import CustomAlert from '../Components/CustomAlert'; 
import Loader from '../Components/Loader';

const tabs = [
  { name: 'Overview', key: 'overview', icon: <User className="w-5 h-5" /> },
  { name: 'Social Links', key: 'social', icon: <Link2 className="w-5 h-5" /> },
  { name: 'Change Password', key: 'password', icon: <Lock className="w-5 h-5" /> },
  { name: 'Actions', key: 'actions', icon: <LogOut className="w-5 h-5" /> },
];

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);


  useEffect(() => {
    axios.get('/api/auth/me')
      .then(res => {
        setUserData(res.data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch user data", err);
        setLoading(false);
        setAlert({ type: 'error', message: 'Failed to load user data' }); // Optional
      });
  }, []);

  const dismissAlert = () => {
    setAlert(null);
  };

  const renderComponent = () => {
    if (loading) return <Loader />;
    if (!userData) return <p className="text-center text-red-500">Failed to load data</p>;

    switch (activeTab) {
      case 'overview':
        return <UserOverview user={userData} setUser={setUserData} setAlert={setAlert} />;
      case 'social':
        return <UserSocialLinks user={userData} setUser={setUserData} setAlert={setAlert} />;
      case 'password':
        return <ChangePassword user={userData} setAlert={setAlert}   />;
      case 'actions':
        return <AccountActions user={userData} setAlert={setAlert} />;
      default:
        return <UserOverview user={userData} />;
    }
  };


  return (
    <div className="w-full">
      <Navbar />

      {/* Use Custom Alert Component */}
      {alert && <CustomAlert type={alert.type} message={alert.message} onClose={dismissAlert} />}

      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col fixed top-1/2 left-0 -translate-y-1/2 
            bg-white rounded-tr-xl rounded-br-xl shadow-xl overflow-hidden
            py-6 px-2 space-y-3 w-16 group hover:w-48 transition-all duration-300 ease-in-out z-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`group flex items-center px-4 py-2 font-medium 
                transition-all duration-300 w-full overflow-hidden rounded-full
                ${activeTab === tab.key ? 'bg-black text-white cursor-pointer' : 'text-black hover:bg-slate-100 cursor-pointer'}`}
            >
              <div className="mr-2">{tab.icon}</div>
              <span className="whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out">
                {tab.name}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Bottom Tabs */}
        <div className="md:hidden flex justify-around bg-white p-2 shadow fixed bottom-0 w-full z-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center font-medium text-sm 
                ${activeTab === tab.key ? 'text-black' : 'text-slate-400'}`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-0 md:ml-20 p-6 pb-24 md:pb-6">
          <div className="md:w-[95%] w-full md:bg-gray-100 rounded-xl md:p-10 p-2">
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}
