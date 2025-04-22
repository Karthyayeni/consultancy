import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Product Management',
      description: 'Add, edit, delete and manage all your products.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      path: '/admin/products',
      colorClass: 'blue-card',
    },
    {
      title: 'Customer Management',
      description: 'View, update, and manage customer details.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zm8 2c-1.5 0-4.5.75-4.5 2.25V17h9v-1.75C20.5 13.75 17.5 13 16 13zM8 13c-1.5 0-4.5.75-4.5 2.25V17h9v-1.75C12.5 13.75 9.5 13 8 13z" />
        </svg>
      ),
      path: '/admin/customers',
      colorClass: 'blue-card',
    },
    {
      title: 'Order Management',
      description: 'Track and manage customer orders smoothly.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ),
      path: '/admin/orders',
      colorClass: 'green-card',
    },
    {
      title: 'Generate Report',
      description: 'Visualize sales and performance reports easily.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
          <line x1="0" y1="20" x2="24" y2="20"></line>
        </svg>
      ),
      path: '/admin/sales-report',
      colorClass: 'purple-card',
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="store-header">
          <div className="store-logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 16H18M6 18C6 18.6 5.6 19 5 19C4.4 19 4 18.6 4 18C4 17.4 4.4 17 5 17C5.6 17 6 17.4 6 18ZM16 18C16 18.6 15.6 19 15 19C14.4 19 14 18.6 14 18C14 17.4 14.4 17 15 17C15.6 17 16 17.4 16 18Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="store-title">RAJAA STORES</h1>
        </div>
        
        <h2 className="dashboard-subtitle">Admin Dashboard</h2>
        
        <div className="cards-grid">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`dashboard-card ${card.colorClass}`}
            >
              <div className="card-header">
                <div className="icon-container">
                  {card.icon}
                </div>
              </div>
              
              <div className="card-body">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>

              <div className="card-footer">
                <button 
                  onClick={() => navigate(card.path)}
                  className={`access-button ${card.colorClass}-button`}
                >
                  Access
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;