<script setup>
import { currentView, cart, totalItemsInCart, totalAmount, removeFromCart, handleCheckout, handleLogout } from '../store.js'
</script>

<template>
  <div>
    <div class="sticky-top bg-white shadow-sm" style="z-index: 1000;">
      <header class="py-2 border-bottom">
        <div class="container d-flex justify-content-between align-items-center">
          <h3 class="text-primary fw-bold m-0">☕ Quán nước BEEPHE</h3>
          <div class="d-flex align-items-center gap-2">
            <div class="dropdown">
              <button class="btn btn-outline-primary position-relative dropdown-toggle" type="button" data-bs-toggle="dropdown">
                🛒 Đơn hàng <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{{ totalItemsInCart }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end p-3" style="width: 300px;">
                <li v-if="cart.length === 0" class="text-center text-muted">Chưa có món nào</li>
                <li v-for="(item, index) in cart" :key="index" class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                  <div><strong>{{ item.name }} x{{ item.quantity }}</strong><br><small class="text-danger">{{ (item.price * item.quantity).toLocaleString() }}đ</small></div>
                  <button @click.stop="removeFromCart(index)" class="btn btn-sm btn-link text-danger">Xóa</button>
                </li>
                <li v-if="cart.length > 0" class="mt-2 text-center">
                  <strong>Tổng: {{ totalAmount.toLocaleString() }}đ</strong>
                  <button @click="handleCheckout" class="btn btn-primary w-100 mt-2">Đặt món ngay</button>
                </li>
              </ul>
            </div>
            <div class="btn-group">
              <button @click="currentView = 'profile'" class="btn btn-light btn-sm border" title="Hồ sơ cá nhân">👤</button>
              <button @click="handleLogout" class="btn btn-outline-danger btn-sm border-start-0" title="Đăng xuất">Thoát</button>
            </div>
          </div>
        </div>
      </header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary py-1">
        <div class="container justify-content-center">
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link fw-bold px-4" href="#">TRANG CHỦ</a></li>
            <li class="nav-item"><a class="nav-link fw-bold px-4" href="#tra-sua">TRÀ SỮA</a></li>
            <li class="nav-item"><a class="nav-link fw-bold px-4" href="#cafe">CAFE</a></li>
            <li class="nav-item"><a class="nav-link fw-bold px-4" href="#lien-he">LIÊN HỆ</a></li>
          </ul>
        </div>
      </nav>
    </div>
    <slot />
    <footer id="lien-he" class="bg-dark text-white py-4 text-center">
      <p class="m-0">☕ Tiệm Nước Của Mai - Chúc bạn một ngày tốt lành!</p>
    </footer>
  </div>
</template>