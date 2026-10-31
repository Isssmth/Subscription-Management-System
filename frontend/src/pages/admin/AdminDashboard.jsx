import React, { useState, useEffect } from 'react';
import { productsApi } from '../../api/productsApi';
import { plansApi } from '../../api/plansApi';
import { taxesApi } from '../../api/taxesApi';
import { initialActivities } from '../../api/mockData';

export function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    products: 12,
    activePlans: 8,
    customers: 1250,
    revenue: '₹4.8L',
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      productsApi.getProducts(),
      plansApi.getPlans({ active: true }),
      taxesApi.getTaxes({ activeOnly: true }),
    ]).then(([prodRes, plansRes]) => {
      if (!isMounted) return;
      const prodCount = prodRes.status === 'fulfilled' && prodRes.value?.length > 0 ? prodRes.value.length : 12;
      const planCount = plansRes.status === 'fulfilled' && plansRes.value?.length > 0 ? plansRes.value.length : 8;

      setStats((prev) => ({
        ...prev,
        products: prodCount,
        activePlans: planCount,
        loading: false,
      }));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="admin-page-content">
      {/* Top Page Header */}
      <div className="content-page-header">
        <div>
          <h1 className="content-page-title">Dashboard</h1>
          <p className="content-page-subtitle">Overview of your business</p>
        </div>
      </div>

      {/* 4 Metric KPI Cards matching top-center of reference image */}
      <div className="metrics-kpi-grid">
        {/* Products KPI */}
        <div className="kpi-card" onClick={() => onNavigate('products')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-badge badge-purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Products</span>
            <span className="kpi-number">{stats.products}</span>
          </div>
        </div>

        {/* Active Plans KPI */}
        <div className="kpi-card" onClick={() => onNavigate('plans')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-badge badge-teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="m9 16 2 2 4-4" />
            </svg>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Plans</span>
            <span className="kpi-number">{stats.activePlans}</span>
          </div>
        </div>

        {/* Customers KPI */}
        <div className="kpi-card" onClick={() => onNavigate('users')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-badge badge-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Customers</span>
            <span className="kpi-number">{stats.customers.toLocaleString()}</span>
          </div>
        </div>

        {/* Revenue KPI */}
        <div className="kpi-card" onClick={() => onNavigate('invoices')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-badge badge-green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Revenue</span>
            <span className="kpi-number">{stats.revenue}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Overview Chart + Recent Activity */}
      <div className="dashboard-charts-layout">
        {/* Revenue Overview Card */}
        <div className="content-card chart-card">
          <div className="card-header-clean">
            <h3 className="card-title">Revenue Overview</h3>
          </div>

          <div className="revenue-chart-wrapper">
            <svg viewBox="0 0 460 190" className="revenue-svg-chart">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5E4CFC" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#5E4CFC" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="30" y1="30" x2="440" y2="30" stroke="#F1F3F9" strokeDasharray="3 3" />
              <line x1="30" y1="70" x2="440" y2="70" stroke="#F1F3F9" strokeDasharray="3 3" />
              <line x1="30" y1="110" x2="440" y2="110" stroke="#F1F3F9" strokeDasharray="3 3" />
              <line x1="30" y1="150" x2="440" y2="150" stroke="#F1F3F9" />

              {/* Gradient Area Fill */}
              <path
                d="M 40 135 C 75 140, 95 105, 125 110 C 155 115, 185 85, 220 95 C 255 105, 290 55, 330 65 C 370 75, 400 45, 430 50 L 430 150 L 40 150 Z"
                fill="url(#chartGradient)"
              />

              {/* Line Curve */}
              <path
                d="M 40 135 C 75 140, 95 105, 125 110 C 155 115, 185 85, 220 95 C 255 105, 290 55, 330 65 C 370 75, 400 45, 430 50"
                fill="none"
                stroke="#5E4CFC"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[[40, 135], [125, 110], [220, 95], [330, 65], [430, 50]].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="6" fill="#FFFFFF" stroke="#5E4CFC" strokeWidth="3" />
                </g>
              ))}

              {/* Month X Labels */}
              <text x="40" y="172" textAnchor="middle" className="chart-label">Jan</text>
              <text x="118" y="172" textAnchor="middle" className="chart-label">Feb</text>
              <text x="196" y="172" textAnchor="middle" className="chart-label">Mar</text>
              <text x="274" y="172" textAnchor="middle" className="chart-label">Apr</text>
              <text x="352" y="172" textAnchor="middle" className="chart-label">May</text>
              <text x="430" y="172" textAnchor="middle" className="chart-label">Jun</text>
            </svg>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="content-card activity-card">
          <div className="card-header-clean">
            <h3 className="card-title">Recent Activity</h3>
          </div>

          <div className="activity-list">
            {initialActivities.map((act) => (
              <div key={act.id} className="activity-item">
                <div
                  className="activity-bullet"
                  style={{ backgroundColor: act.iconColor }}
                />
                <div className="activity-details">
                  <h4 className="activity-title">{act.title}</h4>
                  <span className="activity-subtitle">{act.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

