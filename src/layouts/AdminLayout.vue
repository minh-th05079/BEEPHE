<script setup>
import { adminTab, handleLogout } from '../store.js'
</script>

<template>
  <div class="admin-layout">
    <header class="admin-header bg-white border-bottom py-2 px-4 d-flex justify-content-between align-items-center sticky-top shadow-sm">
      <h3 class="text-primary fw-bold m-0">☕ Tiệm Nước BEEPHE - Quản Trị</h3>
      <button @click="handleLogout" class="btn btn-sm btn-outline-danger">Đăng xuất</button>
    </header>

    <div class="d-flex" style="min-height: calc(100vh - 56px);">
      <aside class="sidebar bg-dark text-white p-3 shadow" style="width: 250px;">
        <ul class="nav flex-column gap-2 mt-2">
          <li class="nav-item">
            <button @click="adminTab = 'thong-ke'" :class="['btn w-100 text-start text-white fw-bold', adminTab === 'thong-ke' ? 'btn-primary' : '']">📊 Thống kê Doanh thu</button>
          </li>
          
          <li class="nav-item">
            <button @click="adminTab = 'danh-muc'" :class="['btn w-100 text-start text-white', adminTab === 'danh-muc' ? 'btn-primary' : '']">🗂️ Quản lý Danh mục</button>
          </li>
          <li class="nav-item">
            <button @click="adminTab = 'san-pham'" :class="['btn w-100 text-start text-white', adminTab === 'san-pham' ? 'btn-primary' : '']">📦 Quản lý Sản phẩm</button>
          </li>
          <li class="nav-item">
            <button @click="adminTab = 'hoa-don'" :class="['btn w-100 text-start text-white', adminTab === 'hoa-don' ? 'btn-primary' : '']">📑 Quản lý Hoá đơn</button>
          </li>
          <li class="nav-item">
            <button @click="adminTab = 'khach-hang'" :class="['btn w-100 text-start text-white', adminTab === 'khach-hang' ? 'btn-primary' : '']">👥 Quản lý Khách hàng</button>
          </li>
          <li class="nav-item">
            <button @click="adminTab = 'ma-giam-gia'" :class="['btn w-100 text-start text-white', adminTab === 'ma-giam-gia' ? 'btn-primary' : '']">🎟️ Quản lý Mã giảm giá</button>
          </li>
        </ul>
      </aside>

      <main class="flex-grow-1 p-4 bg-light overflow-auto">
        <slot></slot>
      </main>
    </div>
  </div>
</template>