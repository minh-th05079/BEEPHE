<script setup>
import { currentView } from './store.js'

import Login from './components/Login.vue'
import Register from './components/Register.vue' 
import ForgotPassword from './components/ForgotPassword.vue' 

import ClientLayout from './layouts/ClientLayout.vue'
import ClientPage from './pages/ClientPage.vue'
import Profile from './pages/Profile.vue' 
import Checkout from './pages/Checkout.vue' // Import thêm Checkout

import AdminLayout from './layouts/AdminLayout.vue'
import AdminPage from './pages/AdminPage.vue'
</script>

<template>
  <Login v-if="currentView === 'login'" />
  <Register v-else-if="currentView === 'register'" /> 
  <ForgotPassword v-else-if="currentView === 'forgot-password'" /> 

  <ClientLayout v-else-if="currentView === 'client' || currentView === 'checkout' || currentView === 'profile'">
    <ClientPage v-if="currentView === 'client'" />
    <Checkout v-if="currentView === 'checkout'" /> 
    <Profile v-if="currentView === 'profile'" />
  </ClientLayout>

  <AdminLayout v-else-if="currentView === 'admin'">
    <AdminPage />
  </AdminLayout>
</template>

<style>
/* Theme Vàng Nâu Tổ Ong */
:root {
  --honey-yellow: #f5b041;
  --honey-dark: #d68910;
  --honey-light: #fef9e7;
  --brown-dark: #4e342e;
  --brown-light: #795548;
}

body {
  background-color: var(--honey-light) !important;
}

/* Ghi đè màu mặc định của Bootstrap */
.bg-primary, .bg-success, .bg-dark { 
  background-color: var(--brown-dark) !important; 
  color: var(--honey-yellow) !important;
}
.btn-primary, .btn-success, .btn-warning { 
  background-color: var(--honey-yellow) !important; 
  border-color: var(--honey-dark) !important; 
  color: var(--brown-dark) !important; 
  font-weight: bold;
}
.btn-primary:hover, .btn-success:hover, .btn-warning:hover { 
  background-color: var(--honey-dark) !important; 
  color: white !important;
}
.text-primary, .text-success, .text-warning { 
  color: var(--honey-dark) !important; 
}
.border-primary { 
  border-color: var(--honey-yellow) !important;
}
.navbar-dark .nav-link { 
  color: var(--honey-yellow) !important; 
}
.navbar-dark .nav-link:hover { 
  color: white !important;
}
.card { 
  border-color: var(--honey-yellow); 
  border-radius: 12px; 
}

/* Scrollbars */
html { scroll-behavior: smooth; }
.dropdown-menu::-webkit-scrollbar, main::-webkit-scrollbar { width: 5px; }
.dropdown-menu::-webkit-scrollbar-thumb, main::-webkit-scrollbar-thumb { background: var(--honey-dark); border-radius: 5px; }
</style>