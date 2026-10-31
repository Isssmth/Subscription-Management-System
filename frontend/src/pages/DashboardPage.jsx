import React, { useState, useEffect } from 'react';
import { productsApi } from '../api/productsApi';
import { plansApi } from '../api/plansApi';
import { taxesApi } from '../api/taxesApi';

export function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState({
    productsCount: 0,
    plansCount: 0,
    taxesCount: 0,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      productsApi.getProducts(),
      plansApi.getPlans(),
      taxesApi.getTaxes(),
    ]).then(([productsRes, plansRes, taxesRes]) => {
      if (!isMounted) return;
      setStats({
        productsCount: productsRes.status === 'fulfilled' ? (productsRes.value?.length || 0) : 0,
        plansCount: plansRes.status === 'fulfilled' ? (plansRes.value?.length || 0) : 0,
        taxesCount: taxesRes.status === 'fulfilled' ? (taxesRes.value?.length || 0) : 0,
        loading: false,
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="dashboard-view">
      <section className="welcome">
        <p className="eyebrow">BRIGHTLOOP SOFTWARE</p>
        <h1>Subscription Management System</h1>
        <p>
          Products, Variants, Plans, and Taxes module is operational and integrated.
          Manage the product catalog and billing rules below.
        </p>
      </section>

      {/* Metrics Row */}
      <section className="metrics-grid">
        <div className="metric-card" onClick={() => onNavigate('products')}>
          <div className="metric-header">
            <span className="metric-title">Total Products</span>
            <span className="metric-icon">📦</span>
          </div>
          <div className="metric-value">{stats.loading ? '...' : stats.productsCount}</div>
          <span className="metric-subtext">Active goods, services & digital items</span>
        </div>

        <div className="metric-card" onClick={() => onNavigate('plans')}>
          <div className="metric-header">
            <span className="metric-title">Subscription Plans</span>
            <span className="metric-icon">⚡</span>
          </div>
          <div className="metric-value">{stats.loading ? '...' : stats.plansCount}</div>
          <span className="metric-subtext">Daily, weekly, monthly & yearly rules</span>
        </div>

        <div className="metric-card" onClick={() => onNavigate('taxes')}>
          <div className="metric-header">
            <span className="metric-title">Configured Taxes</span>
            <span className="metric-icon">🏷️</span>
          </div>
          <div className="metric-value">{stats.loading ? '...' : stats.taxesCount}</div>
          <span className="metric-subtext">Tax rates for billing module</span>
        </div>
      </section>

      {/* Module Navigation Grid */}
      <section className="grid" aria-label="Application modules">
        <article className="module-card clickable-card" onClick={() => onNavigate('products')}>
          <div className="card-top">
            <h2>Products & Variants</h2>
            <span className="status-pill status-ready">Active</span>
          </div>
          <p>Create and edit products, define types, sales & cost prices, and manage item variants.</p>
          <button type="button" className="card-action-btn">
            Open Products &rarr;
          </button>
        </article>

        <article className="module-card clickable-card" onClick={() => onNavigate('plans')}>
          <div className="card-top">
            <h2>Plans Management</h2>
            <span className="status-pill status-ready">Active</span>
          </div>
          <p>Configure recurring pricing frequencies, pause/renewal policies, and availability dates.</p>
          <button type="button" className="card-action-btn">
            Open Plans &rarr;
          </button>
        </article>

        <article className="module-card clickable-card" onClick={() => onNavigate('taxes')}>
          <div className="card-top">
            <h2>Tax Configurations</h2>
            <span className="status-pill status-ready">Active</span>
          </div>
          <p>Maintain sales tax rates (GST, VAT, etc.) ready for subscription invoices.</p>
          <button type="button" className="card-action-btn">
            Open Taxes &rarr;
          </button>
        </article>

        <article className="module-card">
          <div className="card-top">
            <h2>Subscriptions</h2>
            <span className="status-pill status-teammate">Subscription Team</span>
          </div>
          <p>Create quotations, track customer contracts, and monitor subscription lifecycles.</p>
          <span className="coming-soon">Owned by Subscription module</span>
        </article>

        <article className="module-card">
          <div className="card-top">
            <h2>Invoices & Payments</h2>
            <span className="status-pill status-teammate">Billing Team</span>
          </div>
          <p>Generate recurring invoices using configured plans and taxes, record customer payments.</p>
          <span className="coming-soon">Owned by Billing module</span>
        </article>

        <article className="module-card">
          <div className="card-top">
            <h2>Reports</h2>
            <span className="status-pill status-teammate">Reporting Team</span>
          </div>
          <p>Review Monthly Recurring Revenue (MRR), churn rate, and invoice realizations.</p>
          <span className="coming-soon">Owned by Reporting module</span>
        </article>
      </section>
    </div>
  );
}

