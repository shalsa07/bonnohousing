import React from 'react';

const GoogleLocationComponent = ({ src, title = "Google Maps Location", height, className = className || '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-lg shadow-md ${className}`}>
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className
      />
    </div>
  );
};

export default GoogleLocationComponent;