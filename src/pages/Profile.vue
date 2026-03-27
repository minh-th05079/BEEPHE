<script setup>
import { 
  currentView, currentUserProfile, handleUpdateProfile,
  oldPassword, newPassword, confirmNewPassword, handleChangePassword 
} from '../store.js'
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm border-0 mb-4 bg-white">
          <div class="card-header bg-primary text-white fw-bold py-3">👤 Thông tin cá nhân</div>
          <div class="card-body p-4">
            <div class="mb-3"><label class="form-label fw-bold">Họ và tên</label><input v-model="currentUserProfile.fullname" type="text" class="form-control"></div>
            <div class="mb-3"><label class="form-label fw-bold">Số điện thoại</label><input v-model="currentUserProfile.phone" type="text" class="form-control"></div>
            <div class="mb-4"><label class="form-label fw-bold">Địa chỉ</label><textarea v-model="currentUserProfile.address" class="form-control" rows="2"></textarea></div>
            <button @click="handleUpdateProfile" class="btn btn-primary w-100 fw-bold">Lưu thay đổi</button>
          </div>
        </div>

        <div class="card shadow-sm border-0 bg-white">
          <div class="card-header bg-dark text-white fw-bold py-3">🔒 Đổi mật khẩu</div>
          <div class="card-body p-4">
            <div class="mb-3"><label class="form-label fw-bold">Mật khẩu cũ</label><input v-model="oldPassword" type="password" class="form-control"></div>
            <div class="mb-3"><label class="form-label fw-bold">Mật khẩu mới</label><input v-model="newPassword" type="password" class="form-control" placeholder="Tối thiểu 6 ký tự"></div>
            <div class="mb-4"><label class="form-label fw-bold">Xác nhận mật khẩu</label><input v-model="confirmNewPassword" type="password" class="form-control"></div>
            <button @click="handleChangePassword" class="btn btn-primary w-100 fw-bold">Cập nhật mật khẩu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>