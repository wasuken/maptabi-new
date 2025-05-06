import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} 地図×日記アプリ</p>
      </div>
    </footer>
  );
};

export default Footer;
