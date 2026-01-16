import React from 'react';
import '../styles/Button.css';

const Button = ({ title, icon: Icon, onClick, variant, others }) => {
  return (
    <button className={`button-original ${variant} ${others}`} onClick={onClick}>
      {Icon && <span className="button-icon"><Icon /></span>}
      {title}
    </button>
  );
};

export default Button;
