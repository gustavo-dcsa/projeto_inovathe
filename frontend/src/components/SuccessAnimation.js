import React from 'react';
import './SuccessAnimation.css'; // I will create this file next

const SuccessAnimation = ({ message }) => {
  return (
    <div className="success-animation-overlay">
      <div className="success-animation-container">
        <div className="bee"></div>
        <div className="honey-drip"></div>
        <h2 className="text-2xl font-bold text-[#014D49] mb-4">Thank You!</h2>
        <p className="text-lg text-[#014D49]">{message}</p>
      </div>
    </div>
  );
};

export default SuccessAnimation;
