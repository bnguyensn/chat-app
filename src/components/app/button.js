import React from 'react';

export default function Button({ children, ...props }) {
  return (
    <div
      className="flex items-center justify-center py-4 px-8 bg-blue-400 text-white cursor-pointer"
      {...props}
    >
      {children}
    </div>
  );
}
