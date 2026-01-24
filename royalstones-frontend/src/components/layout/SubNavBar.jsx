import React from 'react'
import { useLocation } from 'react-router-dom';

const SubNavBar = () => {
    const location = useLocation();
    return (
        <div className={`bg-[#C09578] text-[#FFFFEE] text-sm justify-center gap-10 py-2 sm:text-[10px] sm:gap-10 md:gap-30 lg:text-[14px] lg:gap-40 ${
            location.pathname === '/login' || location.pathname === '/register' 
              ? 'hidden' 
              : 'hidden md:flex'
          }`}>
            <div>We can ship anywhere in the world.</div>
            <div>All our Products are ready available in stock.</div>
            <div>Orders ship within 24–48 hours.</div>
        </div>


    )
}

export default SubNavBar