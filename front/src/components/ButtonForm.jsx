import React from 'react';

const Button = ({ 
  title, 
  icon: Icon, 
  onClick, 
  variant = 'primary', 
  size = 'button-md',  
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  const variantClasses = {
    primary: 'bg-[#008080] text-white border-transparent hover:enabled:bg-[#006666]',
    outline: 'bg-transparent border-[#008080] text-[#008080] hover:enabled:bg-[#008080]/10',
    ghost: 'bg-transparent text-[#64748b] border-transparent hover:enabled:bg-black/5 hover:enabled:text-[#008080]',
    signin: ' text-white w-full border-transparent'
  };

  const sizeClasses = {
    'button-sm': 'h-[36px] px-4 text-[0.875rem]',
    'button-md': 'h-[48px] px-6 text-[1rem]',
    'button-lg': 'h-[56px] px-8 text-[1.125rem] max-[768px]:h-[50px] max-[768px]:px-6 max-[768px]:text-[1rem]'
  };

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-[10px]
        font-poppins font-semibold rounded-[12px] border-2
        whitespace-nowrap relative overflow-hidden select-none
        transition-all duration-300 cursor-pointer
        leading-none
        disabled:opacity-60 disabled:cursor-not-allowed disabled:grayscale
        ${variantClasses[variant] || ''} 
        ${sizeClasses[size] || ''} 
        ${className}
      `}
    >
      {Icon && (
        <span className="flex items-center justify-center text-[1.5em] leading-none">
          <Icon />
        </span>
      )}
      <span className="leading-none">{title}</span>
    </button>
  );
};

export default Button;