import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { DataLayerProvider } from './context/DataLayerContext';
import { useSyncUserDataOnLogin } from './hooks/useSyncUserDataOnLogin';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { DataLayerTest } from './components/DataLayerTest';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

import './index.css';

function App() {
/**
 * App content component that includes all routes and syncs user data on login
 */
function AppContent() {
  // Sync cart and other user data when user logs in
  useSyncUserDataOnLogin();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<div className="py-20 text-center text-2xl">Page Not Found</div>} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DataLayerProvider>
        <DataLayerTest />
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <WishlistProvider>
                <AppContent />
              </WishlistProvider>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </DataLayerProvider>
    </BrowserRouter>
  );
}

export default App;
