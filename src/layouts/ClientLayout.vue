<script setup>
import { ref } from 'vue'
import { 
  currentView, cart, totalItemsInCart, totalAmount, 
  increaseCartItem, decreaseCartItem, removeCartItem,
  handleCheckout, 
  dsDanhMuc, activeCategory,
  currentUserProfile 
} from '../store.js'

// Biến quản lý trạng thái Đóng/Mở của thanh menu bên trái
const isMenuOpen = ref(true) 
</script>

<template>
  <div class="d-flex flex-column vh-100 overflow-hidden bg-light">
    
    <div class="shadow-sm" style="z-index: 1050;">
      <header class="bg-white py-2 border-bottom">
        <div class="container-fluid px-4 d-flex justify-content-between align-items-center">
          <h3 class="text-primary fw-bold m-0" style="cursor: pointer;" @click="currentView = 'client'">☕ BEEPHE</h3>
          
          <div class="d-flex align-items-center gap-2">
        
            <div class="dropdown">
              <button class="btn btn-outline-primary position-relative dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown">
                🛒 Giỏ hàng <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{{ totalItemsInCart }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end p-3 shadow" style="width: 320px;">
            
                <li v-if="cart.length === 0" class="text-center text-muted py-2">Chưa có món nào</li>
                <li v-for="(item, index) in cart" :key="index" class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                  <div class="flex-grow-1 pe-2">
                    <strong class="text-dark d-block mb-2">{{ item.name }}</strong> 
                    
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="input-group input-group-sm" style="width: 100px;">
                        <button @click.stop="decreaseCartItem(index)" class="btn btn-outline-secondary fw-bold px-2">-</button>
                        <input type="text" class="form-control text-center px-1 fw-bold bg-white" :value="item.quantity" readonly>
                        <button @click.stop="increaseCartItem(index)" class="btn btn-outline-secondary fw-bold px-2">+</button>
                      </div>
                      
                      <small class="text-primary fw-bold fs-6">{{ (item.price * item.quantity).toLocaleString() }}đ</small>
                    </div>
                  </div>
                  <button @click.stop="removeCartItem(index)" class="btn btn-sm btn-outline-danger py-2 px-2 ms-2" title="Xóa món này">🗑️</button>
                </li>
                <li v-if="cart.length > 0" class="mt-2 text-center pt-2">
         
                  <div class="d-flex justify-content-between mb-2 fs-5">
                    <span>Tổng cộng:</span>
                    <strong class="text-danger">{{ totalAmount.toLocaleString() }}đ</strong>
                  </div>
                  <button @click="handleCheckout" class="btn btn-primary w-100 fw-bold fs-6 py-2">ĐẶT MÓN NGAY</button>
                </li>
              </ul>
            </div>
            
            <div v-if="currentUserProfile.id">
              <button @click="currentView = 'profile'" class="btn btn-light btn-sm border fs-6 px-3 fw-bold" title="Hồ sơ cá nhân">👤 Hồ sơ</button>
            </div>
            <div class="btn-group" v-else>
              <button @click="currentView = 'login'" class="btn btn-primary btn-sm fw-bold border border-primary">Đăng nhập</button>
            </div>
            
          </div>
        </div>
      </header>
      
      <nav class="navbar navbar-expand navbar-dark bg-primary py-1 border-bottom border-warning border-3">
        <div class="container-fluid px-4 d-flex align-items-center justify-content-start">
          
          <button class="btn btn-primary border-0 fs-4 me-3 px-2 py-0" @click="isMenuOpen = !isMenuOpen" title="Bật/Tắt Menu">
            ☰
          </button>

          <ul class="navbar-nav flex-row gap-4">
            <li class="nav-item">
              <a class="nav-link fw-bold text-uppercase text-white" href="#" @click="currentView = 'client'">Trang chủ</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fw-bold text-uppercase text-white" href="#lien-he">Liên hệ</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="d-flex align-items-stretch flex-grow-1 w-100 overflow-hidden">
      
      <div class="sidebar-wrapper bg-white border-end shadow-sm" :class="{ 'sidebar-open': isMenuOpen }">
        
        <div class="sidebar-content d-flex flex-column h-100">
          <div class="bg-dark text-white py-3 px-3 border-bottom border-warning border-3" style="z-index: 2;">
            <h5 class="fw-bold m-0 text-uppercase text-center text-warning">Thực Đơn</h5>
          </div>
          
          <div class="list-group list-group-flush flex-grow-1 overflow-y-auto sidebar-scroll pb-5">
             <button 
              @click="activeCategory = 'all'; currentView = 'client'" 
              :class="['list-group-item list-group-item-action fw-bold py-3 px-4 border-bottom menu-item text-nowrap', activeCategory === 'all' ? 'active-menu' : 'text-dark']"
            >
              Tất cả đồ uống
            </button>
            
            <button 
              v-for="dm in dsDanhMuc" :key="dm.id" 
              @click="activeCategory = dm.id; currentView = 'client'" 
              :class="['list-group-item list-group-item-action fw-bold py-3 px-4 border-bottom menu-item text-nowrap', activeCategory === dm.id ? 'active-menu' : 'text-dark']"
            >
              {{ dm.name }}
            </button>
          </div>
        </div>

      </div>

      <div class="main-content flex-grow-1 overflow-y-auto w-100">
        <slot />

        <footer id="lien-he" class="bg-dark text-white py-5 mt-5">
          <div class="container text-center">
            <h4 class="text-primary fw-bold mb-3">☕ BEEPHE - Đã uống là phải phê</h4>
            <p class="mb-1">📍 Địa chỉ: 123 Đường Cà Phê, Quận Trà Sữa, Hà Nội</p>
            <p class="mb-1">📞 Điện thoại: 0987.654.321</p>
            <p class="mb-0">📧 Email: cskh@beephe.com</p>
            <div class="mt-4 border-top border-secondary pt-3 text-secondary small">
              &copy; 2026 BEEPHE. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* KHUNG CHỨA MENU TRƯỢT */
.sidebar-wrapper {
  width: 0;
  overflow-x: hidden; 
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}
.sidebar-wrapper.sidebar-open {
  width: 270px;
}

/* NỘI DUNG MENU CỐ ĐỊNH KÍCH THƯỚC */
.sidebar-content {
  width: 270px;
}

/* TÙY CHỈNH THANH CUỘN CỦA MENU */
.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}
.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background: #d68910; 
  border-radius: 10px;
}
.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: #4e342e;
}

/* TÙY CHỈNH THANH CUỘN CỦA NỘI DUNG CHÍNH */
.main-content::-webkit-scrollbar {
  width: 8px;
}
.main-content::-webkit-scrollbar-track {
  background: #f8f9fa;
}
.main-content::-webkit-scrollbar-thumb {
  background: #a1887f; 
  border-radius: 10px;
}
.main-content::-webkit-scrollbar-thumb:hover {
  background: #795548;
}

/* CSS CHO CÁC NÚT DANH MỤC */
.menu-item {
  transition: all 0.2s ease;
  border-left: 4px solid transparent !important;
}
.menu-item:hover {
  background-color: #fef9e7 !important; 
  color: #d68910 !important; 
  padding-left: 1.8rem !important;
}

/* TRẠNG THÁI ĐANG ĐƯỢC CHỌN (ACTIVE) */
.active-menu {
  background-color: #fef9e7 !important;
  color: #d68910 !important;
  border-left: 4px solid #d68910 !important; 
}
</style>