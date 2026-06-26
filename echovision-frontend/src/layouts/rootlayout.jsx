import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

function RootLayout() {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <div className="wave-wrapper">
        <svg className="organic-waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave path-1" d="M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z"></path>
          <path className="wave path-2" d="M0,160 C320,0,420,300,720,160 C1020,20,1120,320,1440,160 V320 H0 Z"></path>
          <path className="wave path-3" d="M0,160 C160,200,320,100,480,160 C640,220,800,100,960,160 C1120,220,1280,100,1440,160 V320 H0 Z"></path>
        </svg>
      </div>

      <Header />
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}



export default RootLayout;