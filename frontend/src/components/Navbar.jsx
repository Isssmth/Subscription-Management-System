import React from 'react';

export function Navbar({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products & Variants' },
    { id: 'plans', label: 'Plans' },
    { id: 'taxes', label: 'Taxes' },
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-brand-section">
        <div className="brand" onClick={() => onSelectTab('dashboard')} style={{ cursor: 'pointer' }}>
          Brightloop
        </div>
        <span className="tag">Subscription Management</span>
      </div>

      <nav className="navbar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

