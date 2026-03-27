<script setup>
import { currentView, regUsername, regEmail, regPassword, regConfirmPassword, handleRegister } from '../store.js'
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4 bg-white" style="width: 400px;">
      <h3 class="text-center mb-4 text-primary fw-bold">Đăng ký BEEPHE</h3>
      
      <div class="mb-3">
        <label class="form-label fw-bold">Tài khoản</label>
        <input v-model="regUsername" type="text" class="form-control" placeholder="Nhập tên tài khoản...">
      </div>
      
      <div class="mb-3">
        <label class="form-label fw-bold">Email</label>
        <input v-model="regEmail" type="email" class="form-control" placeholder="Nhập email hợp lệ...">
      </div>
      
      <div class="mb-3">
        <label class="form-label fw-bold">Mật khẩu</label>
        <input v-model="regPassword" type="password" class="form-control" placeholder="Tối thiểu 6 ký tự...">
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Xác nhận Mật khẩu</label>
        <input v-model="regConfirmPassword" type="password" class="form-control" placeholder="Nhập lại mật khẩu...">
      </div>
      
      <button @click="handleRegister" class="btn btn-primary w-100 fw-bold mb-3">Đăng ký ngay</button>
      
      <div class="text-center">
        <button @click="currentView = 'login'" class="btn btn-link text-decoration-none text-muted">
          ← Quay lại Đăng nhập
        </button>
      </div>
    </div>
  </div>
</template>