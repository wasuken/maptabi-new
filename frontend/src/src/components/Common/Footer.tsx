import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-center md:justify-start">
            <MapPin className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">マプタビ</span>
          </div>

          <div className="mt-4 md:mt-0">
            <p className="text-center md:text-right text-sm text-gray-500">
              &copy; {new Date().getFullYear()} マプタビ - 地図×日記アプリ
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-center md:justify-start space-x-6">
          <Link to="/about" className="text-gray-500 hover:text-gray-900">
            このアプリについて
          </Link>
          <Link to="/terms" className="text-gray-500 hover:text-gray-900">
            利用規約
          </Link>
          <Link to="/privacy" className="text-gray-500 hover:text-gray-900">
            プライバシーポリシー
          </Link>
          <a
            href="https://github.com/wasuken/maptabi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-900 flex items-center"
          >
            <Github className="h-4 w-4 mr-1" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
