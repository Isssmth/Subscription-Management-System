import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Notification } from './components/Notification';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Admin / Staff Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProductsList } from './pages/admin/ProductsList';
import { ProductForm } from './pages/admin/ProductForm';
import { PlansList } from './pages/admin/PlansList';
import { TaxesList } from './pages/admin/TaxesList';
import { QuotationsList } from './pages/admin/QuotationsList';
import { CreateQuotation } from './pages/admin/CreateQuotation';
import { SubscriptionsList } from './pages/admin/SubscriptionsList';
import { SubscriptionDetails } from './pages/admin/SubscriptionDetails';
import { InvoicesList } from './pages/admin/InvoicesList';
import { UsersList } from './pages/admin/UsersList';

// Customer Portal
import { CustomerPortal } from './pages/customer/CustomerPortal';

function App() {
  // Navigation & View Mode State
  const [viewMode, setViewMode] = useState('admin'); // 'admin' | 'customer' | 'auth-login' | 'auth-register' | 'auth-forgot'
  const [adminRoute, setAdminRoute] = useState('dashboard'); // 'dashboard' | 'products' | 'product-form' | 'plans' | 'taxes' | 'quotations' | 'create-quotation' | 'subscriptions' | 'subscription-details' | 'invoices' | 'users' | 'settings'

  // Subview Entity State
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Layout UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleAdminNavigate = (route) => {
    setAdminRoute(route);
    if (route !== 'product-form') setEditingProduct(null);
  };

  // Switch to Add/Edit Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setAdminRoute('product-form');
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setAdminRoute('product-form');
  };

  // Switch to Quotation Creation
  const handleOpenCreateQuotation = () => {
    setAdminRoute('create-quotation');
  };

  // Switch to Subscription Details
  const handleOpenSubscriptionDetails = (sub) => {
    setSelectedSubscription(sub);
    setAdminRoute('subscription-details');
  };

  // Auth screen handlers
  if (viewMode === 'auth-login') {
    return (
      <div className="auth-root">
        <Notification notification={notification} onClose={() => setNotification(null)} />
        <LoginPage
          onLoginSuccess={(user) => {
            showNotification('success', `Welcome back, ${user.name}!`);
            setViewMode(user.role === 'Customer' ? 'customer' : 'admin');
          }}
          onNavigateToForgot={() => setViewMode('auth-forgot')}
          onNavigateToRegister={() => setViewMode('auth-register')}
        />
      </div>
    );
  }

  if (viewMode === 'auth-register') {
    return (
      <div className="auth-root">
        <Notification notification={notification} onClose={() => setNotification(null)} />
        <RegisterPage
          onRegisterSuccess={(user) => {
            showNotification('success', `Account created! Welcome, ${user.name}!`);
            setViewMode(user.role === 'Customer' ? 'customer' : 'admin');
          }}
          onBackToLogin={() => setViewMode('auth-login')}
        />
      </div>
    );
  }

  if (viewMode === 'auth-forgot') {
    return (
      <div className="auth-root">
        <Notification notification={notification} onClose={() => setNotification(null)} />
        <ForgotPasswordPage
          onBackToLogin={() => setViewMode('auth-login')}
          onShowNotification={showNotification}
        />
      </div>
    );
  }

  // Customer Portal Mode
  if (viewMode === 'customer') {
    return (
      <div className="customer-root">
        <Notification notification={notification} onClose={() => setNotification(null)} />
        <CustomerPortal
          onSwitchToAdmin={() => setViewMode('admin')}
          onShowNotification={showNotification}
        />
      </div>
    );
  }

  // Admin / Staff Layout (Default matching reference design)
  return (
    <div className="admin-app-layout">
      {/* Deep Indigo Sidebar */}
      <Sidebar
        activeRoute={
          adminRoute === 'product-form'
            ? 'products'
            : adminRoute === 'create-quotation'
            ? 'quotations'
            : adminRoute === 'subscription-details'
            ? 'subscriptions'
            : adminRoute
        }
        onNavigate={handleAdminNavigate}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace */}
      <div className="admin-main-wrapper">
        <Header
          onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          currentViewMode={viewMode}
          onChangeViewMode={(mode) => setViewMode(mode)}
        />

        <main className="admin-main-body">
          <Notification notification={notification} onClose={() => setNotification(null)} />

          {adminRoute === 'dashboard' && (
            <AdminDashboard onNavigate={handleAdminNavigate} />
          )}

          {adminRoute === 'products' && (
            <ProductsList
              onAddProduct={handleOpenAddProduct}
              onEditProduct={handleOpenEditProduct}
              onShowNotification={showNotification}
            />
          )}

          {adminRoute === 'product-form' && (
            <ProductForm
              product={editingProduct}
              onBack={() => setAdminRoute('products')}
              onSaveSuccess={() => setAdminRoute('products')}
              onShowNotification={showNotification}
            />
          )}

          {adminRoute === 'plans' && (
            <PlansList onShowNotification={showNotification} />
          )}

          {adminRoute === 'taxes' && (
            <TaxesList onShowNotification={showNotification} />
          )}

          {adminRoute === 'quotations' && (
            <QuotationsList
              onCreateNew={handleOpenCreateQuotation}
              onShowNotification={showNotification}
            />
          )}

          {adminRoute === 'create-quotation' && (
            <CreateQuotation
              onBack={() => setAdminRoute('quotations')}
              onSaveSuccess={() => setAdminRoute('quotations')}
              onShowNotification={showNotification}
            />
          )}

          {adminRoute === 'subscriptions' && (
            <SubscriptionsList
              onSelectSubscription={handleOpenSubscriptionDetails}
            />
          )}

          {adminRoute === 'subscription-details' && (
            <SubscriptionDetails
              subscription={selectedSubscription}
              onBack={() => setAdminRoute('subscriptions')}
              onShowNotification={showNotification}
            />
          )}

          {adminRoute === 'invoices' && (
            <InvoicesList />
          )}

          {adminRoute === 'users' && (
            <UsersList />
          )}

          {adminRoute === 'settings' && (
            <div className="admin-page-content">
              <div className="content-page-header">
                <h1 className="content-page-title">Settings</h1>
                <p className="content-page-subtitle">Platform and company configuration</p>
              </div>
              <div className="content-card">
                <p className="text-secondary">Brightloop Subscription Management System • Version 1.0.0</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
