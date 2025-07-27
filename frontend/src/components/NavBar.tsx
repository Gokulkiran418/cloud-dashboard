import React from 'react';

const NavBar: React.FC = () => (
  <nav className="bg-black/80 backdrop-blur-sm text-white shadow-lg border-b border-purple-500/20 px-4 py-3">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <span className="text-xl font-bold tracking-wide text-purple-400">☁️ CloudOpt</span>
      <div className="flex gap-4 items-center">
        <a
          href="https://yourcompany.com"
          className="underline text-purple-300 hover:text-purple-100 text-xs transition-colors"
          aria-label="Visit company website"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
      </div>
    </div>
  </nav>
);

export default NavBar;
