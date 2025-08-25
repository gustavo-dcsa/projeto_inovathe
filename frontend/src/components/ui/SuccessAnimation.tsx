import React from 'react';
import './SuccessAnimation.css';
import cooperacaoGif from '../images/cooperacao.gif'; // ajuste o caminho se necessário

const SuccessAnimation = () => {
  return (
    <div className="success-animation-overlay">
      <img
        src={cooperacaoGif}
        alt="Carregando..."
        className="success-animation-gif"
      />
    </div>
  );
};

export default SuccessAnimation;
