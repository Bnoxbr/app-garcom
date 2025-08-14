import React from 'react';

interface PlaceholderImageProps {
  type: 'profile' | 'restaurant' | 'food' | 'general';
  size?: string;
  className?: string;
  alt?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
  type, 
  size = "150x150", 
  className = "", 
  alt = "Placeholder" 
}) => {
  const getIconByType = (type: string) => {
    switch (type) {
      case 'profile':
        return 'fa-user';
      case 'restaurant':
        return 'fa-utensils';
      case 'food':
        return 'fa-hamburger';
      default:
        return 'fa-image';
    }
  };

  const [width, height] = size.split('x').map(Number);

  return (
    <div 
      className={`bg-gray-200 flex items-center justify-center rounded ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      title={alt}
    >
      <i className={`fas ${getIconByType(type)} text-gray-400 text-${Math.floor(width/8)}`}></i>
    </div>
  );
};

export default PlaceholderImage;