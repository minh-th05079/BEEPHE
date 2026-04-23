<script setup>
import { adminTab, handleLogout } from '../store.js'
</script>

<template>
  <div class="admin-layout d-flex flex-column vh-100 overflow-hidden">
    
    <header class="admin-header bg-white border-bottom py-2 px-4 d-flex justify-content-between align-items-center shadow-sm" style="z-index: 1050;">
      <h3 class="text-primary fw-bold m-0">☕ Tiệm Nước BEEPHE - Quản Trị</h3>
      <button @click="handleLogout" class="btn btn-sm btn-outline-danger">Đăng xuất</button>
    </header>

    <div class="d-flex flex-grow-1 overflow-hidden">
      
      <aside class="sidebar bg-dark text-white p-3 shadow overflow-y-auto" style="width: 280px; flex-shrink: 0;">
        <ul class="nav flex-column gap-2 mt-2">
          
          <li class="nav-item">
            <button @click="adminTab = 'thong-ke'" :class="['btn w-100 text-start text-white fw-bold text-nowrap', adminTab === 'thong-ke' ? 'btn-primary' : '']">
              📊 Thống kê Doanh thu
            </button>
          </li>
          
          <li class="nav-item">
            <button @click="adminTab = 'danh-muc'" :class="['btn w-100 text-start text-white fw-bold text-nowrap', adminTab === 'danh-muc' ? 'btn-primary' : '']">
              🗂️ Quản lý Danh mục
            </button>
          </li>
          
          <li class="nav-item">
            <button @click="adminTab = 'san-pham'" :class="['btn w-100 text-start text-white fw-bold text-nowrap', adminTab === 'san-pham' ? 'btn-primary' : '']">
              📦 Quản lý Sản phẩm
            </button>
          </li>
          
          <li class="nav-item">
            <button @click="adminTab = 'hoa-don'" :class="['btn w-100 text-start text-white fw-bold text-nowrap', adminTab === 'hoa-don' ? 'btn-primary' : '']">
              📑 Quản lý Hoá đơn
            </button>
          </li>
          
          <li class="nav-item">
            <button @click="adminTab = 'khach-hang'" :class="['btn w-100 text-start text-white fw-bold text-nowrap', adminTab === 'khach-hang' ? 'btn-primary' : '']">
              👥 Quản lý Khách hàng
            </button>
          </li>
          
          <li class="nav-item">
            <button @click="adminTab = 'ma-giam-gia'" :class="['btn w-100 text-start text-white fw-bold text-nowrap', adminTab === 'ma-giam-gia' ? 'btn-primary' : '']">
              🎟️ Quản lý Mã giảm giá
            </button>
          </li>
          
        </ul>
      </aside>

      <main class="flex-grow-1 p-4 bg-light overflow-y-auto">
        <slot></slot>
      </main>
      
    </div>
  </div>
</template>

<style scoped>
/* Tuỳ chỉnh thanh cuộn cho mượt mà (có thể giữ hoặc bỏ tuỳ ý) */
.sidebar::-webkit-scrollbar { width: 6px; }
.sidebar::-webkit-scrollbar-track { background: #343a40; }
.sidebar::-webkit-scrollbar-thumb { background: #d68910; border-radius: 4px; }

main::-webkit-scrollbar { width: 8px; }
main::-webkit-scrollbar-track { background: #f8f9fa; }
main::-webkit-scrollbar-thumb { background: #a1887f; border-radius: 4px; }
</style>