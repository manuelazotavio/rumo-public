import React from 'react';
import { FaPlus } from 'react-icons/fa'; 
import '../styles/AddBtn.css';

const AddBtn = ({ title, onClick }) => {
  return (
    <button type='button' className="add-button" onClick={onClick}>
      <FaPlus className="icon" />
      <span className="text-button">{title}</span>
    </button>
  );
};

export default AddBtn;