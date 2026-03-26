<script setup>
import { currentView, currentUserProfile, handleUpdateProfile } from '../store.js'
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white fw-bold py-3">
            👤 Thông tin cá nhân
          </div>
          <div class="card-body p-4">
            <div class="mb-3">
              <label class="form-label fw-bold">Họ và tên</label>
              <input v-model="currentUserProfile.fullname" type="text" class="form-control">
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Số điện thoại</label>
              <input v-model="currentUserProfile.phone" type="text" class="form-control">
            </div>
            <div class="mb-4">
              <label class="form-label fw-bold">Địa chỉ giao hàng mặc định</label>
              <textarea v-model="currentUserProfile.address" class="form-control" rows="2"></textarea>
            </div>
            <div class="d-flex gap-2">
              <button @click="handleUpdateProfile" class="btn btn-success flex-grow-1 fw-bold">Lưu thay đổi</button>
              <button @click="currentView = 'client'" class="btn btn-secondary flex-grow-1 fw-bold">Hủy bỏ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>