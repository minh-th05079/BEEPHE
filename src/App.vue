<script setup>
import { currentView } from './store.js'

import Login from './components/Login.vue'
import Register from './components/Register.vue' 
import ForgotPassword from './components/ForgotPassword.vue' 

import ClientLayout from './layouts/ClientLayout.vue'
import ClientPage from './pages/ClientPage.vue'
import Profile from './pages/Profile.vue' 

import AdminLayout from './layouts/AdminLayout.vue'
import AdminPage from './pages/AdminPage.vue'
</script>

<template>
  <Login v-if="currentView === 'login'" />
  <Register v-else-if="currentView === 'register'" /> 
  <ForgotPassword v-else-if="currentView === 'forgot-password'" /> 

  <ClientLayout v-else-if="currentView === 'client'">
    <ClientPage />
  </ClientLayout>
  
  <ClientLayout v-else-if="currentView === 'profile'"> 
    <Profile />
  </ClientLayout>

  <AdminLayout v-else-if="currentView === 'admin'">
    <AdminPage />
  </AdminLayout>
</template>