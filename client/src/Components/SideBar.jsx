import React from 'react';
import { User, FolderKanban } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';

export default function SideBar() {
  const { username } = useParams(); // grab username from URL
  const location = useLocation();

  const tabs = [
    { name: 'User Page', path: `/${username}`, icon: <User className="w-5 h-5" /> },
    { name: 'Collections', path: `/${username}/collections`, icon: <FolderKanban className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed top-1/2 left-0 -translate-y-1/2 
          bg-white rounded-tr-xl rounded-br-xl shadow-xl overflow-hidden
          py-6 px-2 space-y-3 w-16 group hover:w-48 transition-all duration-300 ease-in-out z-10">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`group flex items-center px-4 py-2 font-medium  
              transition-all duration-300 w-full overflow-hidden rounded-full
              ${location.pathname === tab.path ? 'bg-black text-white' : 'text-black  hover:bg-slate-100'}`}
          >
            <div className="mr-2 ">{tab.icon}</div>
            <span className="whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out">
              {tab.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Mobile Bottom Tabs */}
      <div className="md:hidden flex justify-around bg-white p-2 shadow fixed bottom-0 w-full z-10">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center font-medium text-sm 
              ${location.pathname === tab.path ? 'text-black' : 'text-slate-400'}`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
