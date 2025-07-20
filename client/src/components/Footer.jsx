// videotube-frontend/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 text-center text-gray-400 text-sm mt-8">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} VideoTube. All rights reserved.</p>
        <p>Built with ❤️ by Rishav</p>
      </div>
    </footer>
  );
};

export default Footer;