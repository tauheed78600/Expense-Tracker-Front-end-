// Navbar.js
import React from "react";
import {
  ArrowLeftRightIcon,
  BarChart3Icon,
  LayoutDashboard,
  LogOut,
  BellDot // Import the Notification icon
} from "lucide-react";
import { motion } from "framer-motion";
import RightArrowIcon from "./../assets/icons/rightArrow.svg";
import Logo from "../assets/Logo.png";

const variants = {
  expanded: { width: "20%" },
  nonexpanded: { width: "6%" },
};

function Navbar({ setCurrentPage }) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [currentPage, setCurrentPageState] = React.useState('dashboard'); // State to track the current page

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCurrentPageState(page); // Update the current page state
    console.log('Navbar currentPage updated:', page);
    // setIsExpanded(false); // Optionally collapse the navbar after selecting a page
  };

  return (
    <motion.div
      animate={isExpanded ? "expanded" : "nonexpanded"}
      variants={variants}
      className={
        "py-10 h-screen flex flex-col border border-r-1 bg-[#FDFDFD] relative" +
        (isExpanded ? " px-10" : " px-6")
      }
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer absolute -right-3 top-10 rounded-full w-6 h-6 bg-[#FF8C8C] flex justify-center items-center"
      >
        <img src={RightArrowIcon} className="w-2" />
      </div>

      <div className="logo-div flex space-x-4 items-center">
        <img src={Logo} />
        <span className={!isExpanded ? "hidden" : "block"}>Expense Tracker</span>
      </div>

      

      <div className="flex flex-col space-y-8 mt-12">
          <div className={`nav-links w-full ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => handlePageChange('dashboard')}>
            <div className="flex space-x-3 w-full p-2 rounded">
              <ArrowLeftRightIcon />
            <span className={!isExpanded ? "hidden" : "block"}>Dashboard</span>
          </div>
        </div>
        <div className={`nav-links w-full ${currentPage === 'transactions' ? 'active' : ''}`} onClick={() => handlePageChange('transactions')}>
          <div className="flex space-x-3 w-full p-2 rounded">
            <LayoutDashboard />
            <span className={!isExpanded ? "hidden" : "block"}>Transactions</span>
          </div>
        </div>

        

        <div className={`nav-links w-full ${currentPage === 'analytics' ? 'active' : ''}`} onClick={() => handlePageChange('analytics')}>
          <div className="flex space-x-3 w-full p-2 rounded ">
            <BarChart3Icon />
            <span className={!isExpanded ? "hidden" : "block"}>Analytics</span>
          </div>
        </div>

        <div className={`nav-links w-full ${currentPage === 'notifications' ? 'active' : ''}`} onClick={() => handlePageChange('notifications')}>
          <div className="flex space-x-3 w-full p-2 rounded">
            <BellDot /> {/* Replace with the actual icon component */}
            <span className={!isExpanded ? "hidden" : "block"}>Notifications</span>
          </div>
        </div>

        <div className={`nav-links w-full ${currentPage === 'logout' ? 'active' : ''}`} onClick={() => handlePageChange('logout')}>
          <div className="flex space-x-3 w-full p-2 rounded  ">
            <LogOut />
            <span className={!isExpanded ? "hidden" : "block"}>
              Log Out
            </span>
          </div>
        </div>

        
      </div>
    </motion.div>
  );
}

export default Navbar;
