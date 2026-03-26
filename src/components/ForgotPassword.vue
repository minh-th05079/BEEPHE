<script setup>
import { currentView, forgotUsername, handleForgotPassword } from '../store.js'
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px;">
      <h3 class="text-center mb-4 text-warning fw-bold">Khôi phục mật khẩu</h3>
      
      <p class="text-muted text-center small mb-4">
        Nhập tên tài khoản của bạn, hệ thống sẽ cấp lại mật khẩu mới.
      </p>

      <div class="mb-3">
        <label class="form-label fw-bold">Tên tài khoản</label>
        <input v-model="forgotUsername" type="text" class="form-control" placeholder="Nhập tài khoản của bạn...">
      </div>
      
      <button @click="handleForgotPassword" class="btn btn-warning w-100 fw-bold mb-3">Lấy lại mật khẩu</button>
      
      <div class="text-center border-top pt-3">
        <button @click="currentView = 'login'" class="btn btn-link text-decoration-none text-muted">
          ← Quay lại Đăng nhập
        </button>
      </div>
    </div>
  </div>
</template>