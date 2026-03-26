<script setup>
import { currentView, regUsername, regPassword, regConfirmPassword, handleRegister } from '../store.js'
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px;">
      <h3 class="text-center mb-4 text-primary fw-bold">BEEPHE Đăng ký</h3>
      
      <div class="mb-3">
        <label class="form-label">Tài khoản mới</label>
        <input v-model="regUsername" type="text" class="form-control" placeholder="Nhập tên tài khoản...">
      </div>
      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <input v-model="regPassword" type="password" class="form-control" placeholder="Nhập mật khẩu...">
      </div>
      <div class="mb-3">
        <label class="form-label">Xác nhận Mật khẩu</label>
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