import React from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title }) {
  return (
    <div className="dashboard-container">
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="page-header">
          <h1 className="page-title">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
