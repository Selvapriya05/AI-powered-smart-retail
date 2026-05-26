import React from 'react';
import CustomerSidebar from './CustomerSidebar';

export default function CustomerLayout({ children, title, cartCount = 0, wishlistCount = 0 }) {
  return (
    <div className="dashboard-container">
      <CustomerSidebar cartCount={cartCount} wishlistCount={wishlistCount} />
      <main className="dashboard-main">
        <div className="page-header">
          <h1 className="page-title">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
