import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel p-6 ${
        hoverEffect ? 'hover:translate-y-[-4px] hover:border-brandIndigo/40 hover:shadow-neonIndigo transition-all duration-350 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
