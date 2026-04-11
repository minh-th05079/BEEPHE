<script setup>
import { ref } from 'vue'
import { 
  currentView, cart, totalItemsInCart, totalAmount, 
  increaseCartItem, decreaseCartItem, removeCartItem,
  dsDanhMuc, activeCategory,
  currentUserProfile 
} from '../store.js'

const isMenuOpen = ref(true) 
</script>

<template>
  <div class="d-flex flex-column vh-100 overflow-hidden bg-light">
    
    <div class="shadow-sm" style="z-index: 1050;">
      
      <header :class="['py-2 border-bottom transition-all position-relative', 
                currentUserProfile.loaiKhach === 'VIP' ? 'vip-header' : 
                currentUserProfile.loaiKhach === 'Quen' ? 'quen-header' : 'bg-white']">
        
        <div v-if="currentUserProfile.loaiKhach === 'VIP'" class="sparkle-layer"></div>
        <div v-if="currentUserProfile.loaiKhach === 'Quen'" class="silver-sparkle-layer"></div>

        <div class="container-fluid px-4 d-flex justify-content-between align-items-center position-relative" style="z-index: 2;">
          <h3 :class="['fw-bold m-0', 
              currentUserProfile.loaiKhach === 'VIP' ? 'text-white text-shadow-gold' : 
              currentUserProfile.loaiKhach === 'Quen' ? 'text-dark text-shadow-silver' : 'text-primary']" 
              style="cursor: pointer; letter-spacing: 2px;" @click="currentView = 'client'">
            ☕ BEEPHE 
            <span v-if="currentUserProfile.loaiKhach === 'VIP'" class="vip-crown">👑</span>
            <span v-if="currentUserProfile.loaiKhach === 'Quen'" class="quen-diamond">💎</span>
          </h3>
          
          <div class="d-flex align-items-center gap-2">
            
            <div v-if="currentUserProfile.loaiKhach === 'VIP'" class="badge rounded-pill vip-badge d-flex align-items-center px-4 py-2 shadow-lg me-2 border border-warning">
              <span class="fs-6 fw-bold">🌟 KHÁCH VIP - {{ currentUserProfile.user }}</span>
            </div>
            <div v-else-if="currentUserProfile.loaiKhach === 'Quen'" class="badge rounded-pill quen-badge d-flex align-items-center px-4 py-2 shadow-lg me-2 border border-secondary">
              <span class="fs-6 fw-bold">🌟 KHÁCH QUEN - {{ currentUserProfile.user }}</span>
            </div>

            <div class="dropdown">
              <button :class="['btn position-relative dropdown-toggle fw-bold', 
                currentUserProfile.loaiKhach === 'VIP' ? 'btn-warning text-dark border-0 shadow-lg' : 
                currentUserProfile.loaiKhach === 'Quen' ? 'btn-light text-dark border-0 shadow-lg' : 'btn-outline-primary']" 
                type="button" data-bs-toggle="dropdown">
                🛒 Giỏ hàng <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{{ totalItemsInCart }}</span>
              </button>
              
              <ul class="dropdown-menu dropdown-menu-end p-3 shadow-lg" style="width: 320px; border-radius: 12px;">
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
                  <button @click="currentView = 'checkout'" class="btn btn-primary w-100 fw-bold fs-6 py-2">TỚI THANH TOÁN</button>
                </li>
              </ul>
            </div>
            
            <div v-if="currentUserProfile.id">
              <button @click="currentView = 'profile'" class="btn btn-light btn-sm border fs-6 px-3 fw-bold shadow-sm" title="Hồ sơ cá nhân">👤 Hồ sơ</button>
            </div>
            <div class="btn-group" v-else>
              <button @click="currentView = 'login'" class="btn btn-primary btn-sm fw-bold border border-primary">Đăng nhập</button>
            </div>
          </div>
        </div>
      </header>
      
      <nav class="navbar navbar-expand navbar-dark bg-primary py-1 border-bottom border-warning border-3">
        <div class="container-fluid px-4 d-flex align-items-center justify-content-start">
          <button class="btn btn-primary border-0 fs-4 me-3 px-2 py-0" @click="isMenuOpen = !isMenuOpen" title="Bật/Tắt Menu">☰</button>
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
.sidebar-wrapper {
  width: 0;
  overflow-x: hidden; 
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}
.sidebar-wrapper.sidebar-open { width: 270px; }
.sidebar-content { width: 270px; }
.sidebar-scroll::-webkit-scrollbar { width: 6px; }
.sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
.sidebar-scroll::-webkit-scrollbar-thumb { background: #d68910; border-radius: 10px; }
.sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #4e342e; }

.main-content::-webkit-scrollbar { width: 8px; }
.main-content::-webkit-scrollbar-track { background: #f8f9fa; }
.main-content::-webkit-scrollbar-thumb { background: #a1887f; border-radius: 10px; }
.main-content::-webkit-scrollbar-thumb:hover { background: #795548; }

.menu-item { transition: all 0.2s ease; border-left: 4px solid transparent !important; }
.menu-item:hover { background-color: #fef9e7 !important; color: #d68910 !important; padding-left: 1.8rem !important; }
.active-menu { background-color: #fef9e7 !important; color: #d68910 !important; border-left: 4px solid #d68910 !important; }
.transition-all { transition: all 0.5s ease; }

/* ========================================= */
/* --- STYLE SIÊU CẤP DÀNH CHO KHÁCH VIP --- */
/* ========================================= */
.vip-header {
  background: linear-gradient(-45deg, #FFDF00, #D4AF37, #996515, #FFDF00, #F3E5AB);
  background-size: 400% 400%;
  animation: goldSweep 4s ease infinite, goldPulse 2s infinite alternate;
  border-bottom: 4px solid #ffcc00 !important;
}
.text-shadow-gold { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 15px #fff; }
.vip-crown { display: inline-block; animation: floatCrown 2s ease-in-out infinite; font-size: 1.4rem; margin-left: 8px; }

.vip-badge {
  background: linear-gradient(135deg, #fff200, #ffaa00);
  color: #5c3a00;
  text-shadow: 0 1px 1px rgba(255,255,255,0.5);
  animation: pulseGold 2s infinite;
  border: 2px solid #FFDF00 !important;
}

.sparkle-layer {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%; pointer-events: none;
  background-image: radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;
  opacity: 0.5;
  animation: sparkleAnim 3s linear infinite;
  z-index: 1;
}

@keyframes goldPulse {
  from { box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4); }
  to { box-shadow: 0 4px 30px rgba(255, 215, 0, 0.9), 0 0 20px #FFDF00; }
}
@keyframes goldSweep { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes floatCrown { 0%, 100% { transform: translateY(0) rotate(-10deg); } 50% { transform: translateY(-5px) rotate(10deg) scale(1.1); } }
@keyframes pulseGold { 0%, 100% { transform: scale(1); box-shadow: 0 0 5px #ffd700; } 50% { transform: scale(1.05); box-shadow: 0 0 20px #ffd700, 0 0 10px #fff; } }
@keyframes sparkleAnim { 0% { background-position: 0 0, 15px 15px; } 100% { background-position: 30px 30px, 45px 45px; } }

/* ========================================= */
/* --- STYLE DÀNH CHO KHÁCH QUEN (BẠC) ---   */
/* ========================================= */
.quen-header {
  background: linear-gradient(-45deg, #E5E4E2, #FFFFFF, #BDBDBD, #E5E4E2);
  background-size: 300% 300%;
  animation: silverSweep 5s ease infinite, platinumPulse 2.5s infinite alternate;
  border-bottom: 4px solid #b0bec5 !important;
}
.text-shadow-silver { text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.9), 0 0 8px #fff; }
.quen-diamond { display: inline-block; animation: spinDiamond 4s linear infinite; font-size: 1.3rem; margin-left: 8px; }

.quen-badge {
  background: linear-gradient(135deg, #ffffff, #E5E4E2);
  color: #2c3e50;
  text-shadow: 0 1px 1px rgba(255,255,255,0.8);
  box-shadow: 0 0 12px rgba(176, 190, 197, 0.8) !important;
  border: 2px solid #b0bec5 !important;
}

.silver-sparkle-layer {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%; pointer-events: none;
  background-image: radial-gradient(rgba(255, 255, 255, 1) 2px, transparent 2px);
  background-size: 40px 40px;
  background-position: 0 0;
  opacity: 0.3;
  animation: sparkleAnim 5s linear infinite;
  z-index: 1;
}

@keyframes platinumPulse {
  from { box-shadow: 0 4px 10px rgba(176, 190, 197, 0.4); }
  to { box-shadow: 0 4px 25px rgba(176, 190, 197, 0.9), 0 0 15px #FFFFFF; }
}
@keyframes silverSweep { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes spinDiamond { 0% { transform: rotateY(0deg) scale(1); } 50% { transform: rotateY(180deg) scale(1.1); } 100% { transform: rotateY(360deg) scale(1); } }
</style>