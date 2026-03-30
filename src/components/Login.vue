<script setup>
import { username, password, handleLogin, currentView } from '../store.js'
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4 bg-white" style="width: 400px;">
      <h3 class="text-center mb-4 text-primary fw-bold">BEEPHE Login</h3>
      <div class="alert alert-info py-2" style="font-size: 0.9rem">
        <small><b>Khách:</b> kh123 / 123</small><br>
        <small><b>Admin:</b> admin / 123</small>
      </div>
      
      <div class="mb-3">
        <label class="form-label fw-bold">Tài khoản / Email / SĐT</label>
        <input v-model="username" type="text" class="form-control" placeholder="Nhập tên tài khoản, email hoặc SĐT...">
      </div>
      
      <div class="mb-3">
        <label class="form-label fw-bold">Mật khẩu</label>
        <input v-model="password" type="password" class="form-control" placeholder="Nhập mật khẩu...">
      </div>
      
      <button @click="handleLogin" class="btn btn-primary w-100 fw-bold">Đăng nhập</button>
      
      <div class="text-center mt-3 border-top pt-3">
        <button @click="currentView = 'register'" class="btn btn-link text-decoration-none text-muted p-0 mb-2 d-block w-100">
          Chưa có tài khoản? <span class="text-primary fw-bold">Đăng ký ngay</span>
        </button>
        <button @click="currentView = 'forgot-password'" class="btn btn-link text-decoration-none text-danger p-0 d-block w-100 fw-bold">
          Quên mật khẩu?
        </button>
      </div>
    </div>
  </div>
</template>