<script setup>
import { currentView, forgotEmail, handleForgotPassword } from '../store.js'
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4 bg-white" style="width: 400px;">
      <h3 class="text-center mb-4 text-primary fw-bold">Khôi phục mật khẩu</h3>
      <p class="text-muted text-center small mb-4">Nhập Email đã đăng ký, hệ thống sẽ gửi mật khẩu mới cho bạn.</p>
      <div class="mb-3">
        <label class="form-label fw-bold">Email</label>
        <input v-model="forgotEmail" type="email" class="form-control" placeholder="Nhập email của bạn...">
      </div>
      <button @click="handleForgotPassword" class="btn btn-primary w-100 fw-bold mb-3">Lấy lại mật khẩu</button>
      <div class="text-center border-top pt-3">
        <button @click="currentView = 'login'" class="btn btn-link text-decoration-none text-muted">← Quay lại Đăng nhập</button>
      </div>
    </div>
  </div>
</template>