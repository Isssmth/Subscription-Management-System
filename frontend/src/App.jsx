import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Notification } from './components/Notification';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { PlansPage } from './pages/PlansPage';
import { TaxesPage } from './pages/TaxesPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [planFilterProductId, setPlanFilterProductId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'plans') {
      setPlanFilterProductId(null);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    setActiveTab('product-details');
  };

  const handleNavigateToPlans = (productId) => {
    setPlanFilterProductId(productId);
    setActiveTab('plans');
  };

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab === 'product-details' ? 'products' : activeTab} onSelectTab={handleTabChange} />

      <main className="page">
        <Notification notification={notification} onClose={() => setNotification(null)} />

        {activeTab === 'dashboard' && (
          <DashboardPage onNavigate={handleTabChange} />
        )}

        {activeTab === 'products' && (
          <ProductsPage
            onSelectProduct={handleSelectProduct}
            onShowNotification={showNotification}
          />
        )}

        {activeTab === 'product-details' && selectedProductId && (
          <ProductDetailsPage
            productId={selectedProductId}
            onBack={() => setActiveTab('products')}
            onNavigateToPlans={handleNavigateToPlans}
            onShowNotification={showNotification}
          />
        )}

        {activeTab === 'plans' && (
          <PlansPage
            initialProductId={planFilterProductId}
            onShowNotification={showNotification}
          />
        )}

        {activeTab === 'taxes' && (
          <TaxesPage onShowNotification={showNotification} />
        )}
      </main>
    </div>
  );
}

export default App;
