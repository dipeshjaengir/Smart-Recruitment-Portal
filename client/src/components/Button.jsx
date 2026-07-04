import React from 'react';
import { FiLoader } from 'react-icons/fi';

export const Button = ({
  children,
  variant = 'violet',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyle = "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    violet: "bg-gradient-to-r from-brandViolet to-brandIndigo text-white shadow-neonIndigo hover:brightness-110",
    cyan: "bg-gradient-to-r from-brandCyan to-brandBlue text-darkBg font-semibold shadow-neonCyan hover:brightness-110",
    glass: "bg-indigo-500/10 border border-indigo-500/25 hover:bg-brandIndigo/25 text-slate-100",
    danger: "bg-red-500/10 border border-red-500/25 hover:bg-red-500/25 text-red-500",
    secondary: "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <FiLoader className="animate-spin text-lg" />}
      {children}
    </button>
  );
};

export default Button;
