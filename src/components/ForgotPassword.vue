<script setup>
import { 
  forgotStep, forgotUsername, forgotContact, forgotOtpInput, 
  userToReset, forgotNewPass, forgotConfirmPass, 
  checkForgotUsername, checkForgotContact, verifyForgotOtp, 
  resetPasswordSubmit, huyForgotPassword 
} from '../store.js'
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4 bg-white" style="width: 400px;">
      
      <div v-if="forgotStep === 1">
        <h3 class="text-center mb-4 text-primary fw-bold">Tìm tài khoản</h3>
        <p class="text-muted text-center small mb-4">Nhập tên tài khoản của bạn để khôi phục.</p>
        <div class="mb-3">
          <label class="form-label fw-bold">Tài khoản</label>
          <input v-model="forgotUsername" type="text" class="form-control" placeholder="Nhập tên đăng nhập...">
        </div>
        <button @click="checkForgotUsername" class="btn btn-primary w-100 fw-bold mb-3">Tiếp tục</button>
      </div>

      <div v-if="forgotStep === 2">
        <h3 class="text-center mb-4 text-primary fw-bold">Xác minh</h3>
        <p class="text-center text-dark mb-4">Xin chào <strong class="text-danger">{{ userToReset?.user }}</strong>!<br><span class="small text-muted">Vui lòng nhập Email hoặc SĐT đã đăng ký với tài khoản này để nhận mã OTP.</span></p>
        <div class="mb-3">
          <label class="form-label fw-bold">Email / SĐT</label>
          <input v-model="forgotContact" type="text" class="form-control" placeholder="Nhập thông tin xác minh...">
        </div>
        <button @click="checkForgotContact" class="btn btn-primary w-100 fw-bold mb-3">Gửi mã OTP</button>
      </div>

      <div v-if="forgotStep === 3">
        <h3 class="text-center mb-4 text-warning fw-bold">Nhập mã OTP</h3>
        <p class="text-muted text-center small mb-4">Mã xác nhận đã được gửi. Vui lòng kiểm tra và nhập vào bên dưới.</p>
        <div class="mb-3">
          <label class="form-label fw-bold">Mã OTP (6 chữ số)</label>
          <input v-model="forgotOtpInput" type="text" class="form-control text-center fs-4 fw-bold tracking-widest" placeholder="------" maxlength="6">
        </div>
        <button @click="verifyForgotOtp" class="btn btn-warning text-dark w-100 fw-bold mb-3">Xác nhận OTP</button>
      </div>

      <div v-if="forgotStep === 4">
        <h3 class="text-center mb-4 text-success fw-bold">Tạo mật khẩu mới</h3>
        <p class="text-muted text-center small mb-4">Xác thực thành công! Vui lòng đặt lại mật khẩu mới.</p>
        <div class="mb-3">
          <label class="form-label fw-bold">Mật khẩu mới</label>
          <input v-model="forgotNewPass" type="password" class="form-control" placeholder="Tối thiểu 6 ký tự...">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Xác nhận mật khẩu</label>
          <input v-model="forgotConfirmPass" type="password" class="form-control" placeholder="Nhập lại mật khẩu mới...">
        </div>
        <button @click="resetPasswordSubmit" class="btn btn-success w-100 fw-bold mb-3">Lưu mật khẩu</button>
      </div>

      <div class="text-center border-top pt-3">
        <button @click="huyForgotPassword" class="btn btn-link text-decoration-none text-muted">
          ← Quay lại Đăng nhập
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.tracking-widest { letter-spacing: 0.5rem; }
</style>