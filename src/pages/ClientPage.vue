<script setup>
import { dsDanhMuc, filteredProducts, addToCart, activeCategory } from '../store.js'
</script>

<template>
  <div>
    <div class="position-relative text-center mb-5">
      <img src="/images/banner.jpg" class="w-100" style="height: 380px; object-fit: cover; filter: brightness(0.85);">
      <div class="position-absolute top-50 start-50 translate-middle p-4 shadow-lg" style="background: rgba(78, 52, 46, 0.9); border-radius: 20px; border: 3px solid #f5b041; width: 80%; max-width: 600px;">
        <h1 class="display-3 fw-bold mb-3" style="color: #f5b041; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">BEEPHE</h1>
        <p class="fs-4 text-white m-0" style="letter-spacing: 1px;">BEEPHE Đã Uống Là Phải Phê!</p>
      </div>
    </div>

    <div class="container my-5" id="menu-section">
      
      <h2 class="text-primary border-bottom border-primary border-3 pb-2 mb-4 fw-bold text-uppercase text-center">
        {{ activeCategory === 'all' ? 'Tất cả đồ uống' : dsDanhMuc.find(d => d.id === activeCategory)?.name }}
      </h2>

      <div class="row g-4 justify-content-center">
        <div class="col-6 col-md-4 col-lg-3" v-for="item in filteredProducts" :key="item.id">
          
          <div :class="['card bg-white h-100 shadow-sm border-0 position-relative transition-hover', item.tonKho <= 0 ? 'opacity-75' : '']">
            
            <div v-if="item.tonKho <= 0" class="position-absolute top-50 start-50 translate-middle w-100 text-center" style="z-index: 2;">
              <span class="badge bg-danger fs-5 py-2 px-3 shadow rounded-pill">ĐÃ HẾT HÀNG</span>
            </div>
            
            <div class="p-3 text-center bg-light" style="border-radius: 12px 12px 0 0;">
              <img :src="item.img" class="card-img-top mix-blend-multiply" style="height: 180px; object-fit: contain;">
            </div>
            
            <div class="card-body text-center d-flex flex-column p-4">
              <h5 class="fs-5 fw-bold mb-2 text-dark">{{ item.name }}</h5>
              <p class="text-primary fw-bold fs-4 mb-2">{{ item.price.toLocaleString() }}đ</p>
              
              <small class="text-muted mb-4 d-block fw-semibold" style="font-size: 0.9rem;">
                {{ item.tonKho > 0 ? `Còn lại: ${item.tonKho} sản phẩm` : 'Tạm hết hàng' }}
              </small>
              
              <div class="mt-auto">
                <button 
                  @click="addToCart(item)" 
                  :class="['btn w-100 fw-bold py-2 shadow-sm', item.tonKho > 0 ? 'btn-primary' : 'btn-secondary']"
                  :disabled="item.tonKho <= 0"
                >
                  {{ item.tonKho > 0 ? '🛒 THÊM VÀO GIỎ' : 'KHÔNG THỂ MUA' }}
                </button>
              </div>
            </div>

          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="col-12 py-5 text-center bg-white rounded shadow-sm border mt-4">
          <div class="display-1 text-muted mb-3">🥤</div>
          <h4 class="text-secondary fw-bold">Chưa có sản phẩm nào trong danh mục này.</h4>
          <p class="text-muted">Vui lòng chọn danh mục khác hoặc quay lại sau!</p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hiệu ứng trỏ chuột cho thẻ sản phẩm */
.transition-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.transition-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
.mix-blend-multiply {
  mix-blend-mode: multiply;
}
</style>