import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationPlaceholderProps {
  children: React.ReactNode;
  to?: string;
  className?: string;
  onClick?: () => void;
}

const NavigationPlaceholder: React.FC<NavigationPlaceholderProps> = ({ 
  children, 
  to, 
  className = "",
  onClick
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      console.log('Navegação sem destino definido');
      alert('Funcionalidade em desenvolvimento');
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
      type="button"
    >
      {children}
    </button>
  );
};

export default NavigationPlaceholder;