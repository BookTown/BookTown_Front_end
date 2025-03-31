import React from 'react';
import { Link } from 'react-router-dom';

interface ListFrameProps {
  title: string;
  horizontal?: boolean;
  link: string;
  children: React.ReactNode;
}

const ListFrame = ({ title, horizontal = true, link, children }: ListFrameProps) => {
  return (
    <div className="px-4 py-2">
      <div className='flex items-center justify-between'>
        <h3 className="text-2xl mx-2 mb-2">{title}</h3>
        <Link to={`/${link}`} className='pr-2 text-[#4B8E96]'>모두 보기</Link>
      </div>
      <div className={`flex ${horizontal ? 'gap-3 overflow-x-auto' : 'flex-col gap-2'}`}>
        {children}
      </div>
    </div>
  );
};

export default ListFrame;