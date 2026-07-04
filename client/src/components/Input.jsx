import React from 'react';

export const Input = ({
  label,
  error,
  name,
  type = 'text',
  placeholder = '',
  register = () => ({}),
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase ml-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="glass-input dark:bg-slate-900/60 dark:border-indigo-500/10 focus:border-brandIndigo text-sm"
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium ml-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
};

export default Input;
