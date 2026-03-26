<script setup>
import { username, password, handleLogin, currentView } from '../store.js'
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px;">
      <h3 class="text-center mb-4 text-success fw-bold">BEEPHE Login</h3>
      <div class="alert alert-info py-2" style="font-size: 0.9rem">
        <small><b>Khách:</b> kh123 / 123</small><br>
        <small><b>Admin:</b> admin / 123</small>
      </div>
      <div class="mb-3">
        <label class="form-label">Tài khoản</label>
        <input v-model="username" type="text" class="form-control">
      </div>
      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <input v-model="password" type="password" class="form-control">
      </div>
      <button @click="handleLogin" class="btn btn-success w-100 fw-bold">Đăng nhập</button>
      
      <div class="text-center mt-3 border-top pt-3">
        <button @click="currentView = 'register'" class="btn btn-link text-decoration-none text-muted p-0 mb-2 d-block w-100">
          Chưa có tài khoản? <span class="text-success fw-bold">Đăng ký ngay</span>
        </button>
        <button @click="currentView = 'forgot-password'" class="btn btn-link text-decoration-none text-warning p-0 d-block w-100">
          Quên mật khẩu?
        </button>
      </div>
    </div> </div>
</template>