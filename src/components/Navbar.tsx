import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Clock, BarChart, Settings } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const menus = [
    { name: '홈', icon: <Home size={28} />, path: '/home' },
    { name: '히스토리', icon: <Clock size={28} />, path: '/history' },
    { name: '랭킹', icon: <BarChart size={28} />, path: '/ranking' },
    { name: '설정', icon: <Settings size={28} />, path: '/settings' },
  ]

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[28rem] bg-white z-30">
      <div className="flex justify-around items-center h-[4.5rem] px-4 border-t border-gray-100">
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path
          return (
            <Link
              to={menu.path}
              key={menu.name}
              className={`flex flex-col items-center text-xs ${
                isActive ? 'text-black' : 'text-gray-400'
              }`}
            >
              {menu.icon}
              <span>{menu.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Navbar;