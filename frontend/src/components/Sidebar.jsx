import React from 'react';
import {
  LogoIcon,
  DashboardIcon,
  ProductsIcon,
  PlansIcon,
  TaxesIcon,
  SubscriptionsIcon,
  QuotationsIcon,
  InvoicesIcon,
  UsersIcon,
  SettingsIcon,
} from './Icons';

export function Sidebar({ activeRoute, onNavigate, isMobileOpen, onCloseMobile }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'products', label: 'Products', icon: ProductsIcon },
    { id: 'plans', label: 'Plans', icon: PlansIcon },
    { id: 'taxes', label: 'Taxes', icon: TaxesIcon },
    { id: 'subscriptions', label: 'Subscriptions', icon: SubscriptionsIcon },
    { id: 'quotations', label: 'Quotations', icon: QuotationsIcon },
    { id: 'invoices', label: 'Invoices', icon: InvoicesIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleItemClick = (id) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {isMobileOpen && <div className="sidebar-mobile-backdrop" onClick={onCloseMobile} />}
      <aside className={`app-sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand" onClick={() => handleItemClick('dashboard')} style={{ cursor: 'pointer' }}>
          <LogoIcon size={30} />
          <span className="brand-text">Brightloop</span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <span className="sidebar-icon">
                  <Icon size={19} />
                </span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

