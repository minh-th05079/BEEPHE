<script setup>
import { ref, computed } from 'vue'
import { dsDanhMuc, filteredProducts, addToCart, activeCategory, searchQuery, currentUserProfile } from '../store.js'

const selectedProduct = ref(null)

const selectedSize = ref('M')
const selectedTemp = ref('Lạnh')
const selectedIce = ref('Bình thường')
const selectedQuantity = ref(1) 

const currentPrice = computed(() => {
  if (!selectedProduct.value) return 0
  let basePrice = selectedProduct.value.price
  
  if (selectedSize.value === 'M') basePrice += 5000
  if (selectedSize.value === 'L') basePrice += 10000
  return basePrice
})

const openDetail = (item) => {
  selectedProduct.value = item
  selectedSize.value = 'M' 
  selectedTemp.value = 'Lạnh'
  selectedIce.value = 'Bình thường'
  selectedQuantity.value = 1 
}

const decreaseQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--
  }
}

const increaseQuantity = () => {
  if (selectedProduct.value && selectedQuantity.value < selectedProduct.value.tonKho) {
    selectedQuantity.value++
  } else {
    alert('Vượt quá số lượng tồn kho!')
  }
}

const confirmAddToCart = () => {
  let optionsStr = `Size ${selectedSize.value}`
  if (selectedTemp.value === 'Lạnh') { optionsStr += ` - Lạnh - ${selectedIce.value}` } 
  else { optionsStr += ` - Nóng` }

  const customItem = {
    ...selectedProduct.value,
    name: `${selectedProduct.value.name} (${optionsStr})`,
    price: currentPrice.value 
  }

  addToCart(customItem, selectedQuantity.value)
  selectedProduct.value = null 
}
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
      
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center border-bottom border-primary border-3 pb-2 mb-4">
        <h2 class="text-primary fw-bold text-uppercase mb-3 mb-md-0">
          {{ activeCategory === 'all' ? 'Tất cả đồ uống' : dsDanhMuc.find(d => String(d.id) === String(activeCategory))?.name }}
        </h2>

        <div class="input-group shadow-sm" style="max-width: 350px;">
          <span class="input-group-text bg-white border-primary text-primary">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control border-primary" 
            placeholder="Tìm món đồ uống..."
          >
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''" 
            class="btn btn-outline-danger border-primary border-start-0"
            title="Xóa tìm kiếm"
          >
            ✖
          </button>
        </div>
      </div>

      <div class="row g-4 justify-content-center">
        <div class="col-6 col-md-4 col-lg-3" v-for="item in filteredProducts" :key="item.id">
          
          <div :class="['card bg-white h-100 shadow-sm position-relative transition-hover', 
                        item.tonKho <= 0 ? 'opacity-75' : '',
                        currentUserProfile.loaiKhach === 'VIP' ? 'card-vip' : 
                        currentUserProfile.loaiKhach === 'Quen' ? 'card-quen' : 'border-0']">
            <div v-if="item.tonKho <= 0" class="position-absolute top-50 start-50 translate-middle w-100 text-center" style="z-index: 2;">
              <span class="badge bg-danger fs-5 py-2 px-3 shadow rounded-pill">ĐÃ HẾT HÀNG</span>
            </div>
            
            <div class="p-3 text-center bg-light" style="border-radius: 12px 12px 0 0; cursor: pointer;" @click="openDetail(item)">
              <img :src="item.img" class="card-img-top mix-blend-multiply" style="height: 180px; object-fit: contain;">
            </div>
            
            <div class="card-body text-center d-flex flex-column p-4">
              <h5 class="fs-5 fw-bold mb-2 text-dark" style="cursor: pointer;" @click="openDetail(item)">{{ item.name }}</h5>
              <p class="text-primary fw-bold fs-4 mb-2">{{ item.price.toLocaleString() }}đ</p>
              
              <small class="text-muted mb-4 d-block fw-semibold" style="font-size: 0.9rem;">
                {{ item.tonKho > 0 ? `Còn lại: ${item.tonKho} sản phẩm` : 'Tạm hết hàng' }}
              </small>
              
              <div class="mt-auto d-flex gap-2">
                <button @click="openDetail(item)" class="btn btn-outline-primary fw-bold flex-grow-1 shadow-sm py-2">Chi tiết</button>
                <button @click="addToCart(item)" :class="['btn fw-bold px-3 shadow-sm py-2', item.tonKho > 0 ? 'btn-primary' : 'btn-secondary']" :disabled="item.tonKho <= 0" title="Thêm nhanh mặc định">🛒</button>
              </div>
            </div>
          </div>

        </div>

        <div v-if="filteredProducts.length === 0" class="col-12 py-5 text-center bg-white rounded shadow-sm border mt-4">
          <div class="display-1 text-muted mb-3">🥤</div>
          <h4 class="text-secondary fw-bold" v-if="searchQuery">Không tìm thấy món nào tên "{{ searchQuery }}"</h4>
          <h4 class="text-secondary fw-bold" v-else>Chưa có sản phẩm nào trong danh mục này.</h4>
        </div>
      </div>
    </div>

    <div v-if="selectedProduct" class="modal-backdrop fade show" style="z-index: 1060;"></div>
    
    <div v-if="selectedProduct" class="modal fade show d-block" tabindex="-1" style="z-index: 1065;" @click.self="selectedProduct = null">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div :class="['modal-content border-0 shadow-lg rounded-4 overflow-hidden position-relative animate-pop',
                      currentUserProfile.loaiKhach === 'VIP' ? 'modal-vip' : 
                      currentUserProfile.loaiKhach === 'Quen' ? 'modal-quen' : '']">
          
          <button @click="selectedProduct = null" class="btn-close position-absolute top-0 end-0 m-3 z-3" style="background-color: white; padding: 10px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></button>
          
          <div class="row g-0">
            <div class="col-md-5 bg-light d-flex align-items-center justify-content-center p-4">
              <img :src="selectedProduct.img" class="img-fluid mix-blend-multiply transition-hover" style="max-height: 350px; object-fit: contain;">
            </div>
            
            <div class="col-md-7 d-flex flex-column justify-content-center p-4 p-md-5 bg-white">
              <div class="mb-2">
                <span class="badge bg-warning text-dark px-3 py-2 fs-6 rounded-pill">
                  {{ dsDanhMuc.find(d => String(d.id) === String(selectedProduct.category))?.name || 'Đồ uống' }}
                </span>
              </div>
              
              <h2 class="fw-bold text-dark mb-1">{{ selectedProduct.name }}</h2>
              <h3 class="text-primary fw-bold mb-3">{{ currentPrice.toLocaleString() }} VNĐ</h3>
               
              <div class="mb-4 bg-light p-3 rounded-3 border border-warning">
                <h6 class="fw-bold mb-3 text-dark border-bottom pb-2">⚙️ Tùy chỉnh đồ uống:</h6>
                <div class="mb-3">
                  <label class="form-label text-muted small fw-bold mb-2">1. Chọn Size</label>
                  <div class="d-flex gap-2">
                    <button @click="selectedSize = 'S'" :class="['btn btn-sm flex-grow-1 fw-bold', selectedSize === 'S' ? 'btn-warning text-dark border-warning' : 'btn-outline-secondary']">Size S</button>
                    <button @click="selectedSize = 'M'" :class="['btn btn-sm flex-grow-1 fw-bold', selectedSize === 'M' ? 'btn-warning text-dark border-warning' : 'btn-outline-secondary']">Size M (+5k)</button>
                    <button @click="selectedSize = 'L'" :class="['btn btn-sm flex-grow-1 fw-bold', selectedSize === 'L' ? 'btn-warning text-dark border-warning' : 'btn-outline-secondary']">Size L (+10k)</button>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label text-muted small fw-bold mb-2">2. Nhiệt độ</label>
                  <div class="d-flex gap-2">
                    <button @click="selectedTemp = 'Lạnh'" :class="['btn btn-sm flex-grow-1 fw-bold', selectedTemp === 'Lạnh' ? 'btn-info text-white border-info' : 'btn-outline-info']">❄️ Lạnh</button>
                    <button @click="selectedTemp = 'Nóng'" :class="['btn btn-sm flex-grow-1 fw-bold', selectedTemp === 'Nóng' ? 'btn-danger text-white border-danger' : 'btn-outline-danger']">🔥 Nóng</button>
                  </div>
                </div>

                <div v-if="selectedTemp === 'Lạnh'">
                  <label class="form-label text-muted small fw-bold mb-2">3. Lượng đá</label>
                  <div class="d-flex gap-2">
                    <button @click="selectedIce = 'Ít đá'" :class="['btn btn-sm flex-grow-1 fw-bold', selectedIce === 'Ít đá' ? 'btn-primary border-primary' : 'btn-outline-primary']">Ít đá</button>
                    <button @click="selectedIce = 'Bình thường'" :class="['btn btn-sm flex-grow-1 fw-bold', selectedIce === 'Bình thường' ? 'btn-primary border-primary' : 'btn-outline-primary']">Bình thường</button>
                    <button @click="selectedIce = 'Nhiều đá'" :class="['btn btn-sm flex-grow-1 fw-bold', selectedIce === 'Nhiều đá' ? 'btn-primary border-primary' : 'btn-outline-primary']">Nhiều đá</button>
                  </div>
                </div>
              </div>
              
              <div class="d-flex align-items-center mb-4 p-3 bg-light rounded-3 border">
                <span class="fw-bold me-3 text-dark">Trạng thái kho:</span>
                <span v-if="selectedProduct.tonKho > 0" class="text-success fw-bold fs-5">✔️ Còn {{ selectedProduct.tonKho }} ly</span>
                <span v-else class="text-danger fw-bold fs-5">❌ Đã hết nguyên liệu</span>
              </div>
              
              <div v-if="selectedProduct.tonKho > 0" class="d-flex align-items-center mb-4">
                <span class="fw-bold me-3 text-dark">Số lượng:</span>
                <div class="input-group input-group-lg" style="width: 150px;">
                  <button @click="decreaseQuantity" class="btn btn-outline-secondary fw-bold">-</button>
                  <input type="text" class="form-control text-center fw-bold bg-white" :value="selectedQuantity" readonly>
                  <button @click="increaseQuantity" class="btn btn-outline-secondary fw-bold">+</button>
                </div>
              </div>
              
              <button 
                @click="confirmAddToCart" 
                :class="['btn btn-lg w-100 fw-bold shadow-sm py-3', selectedProduct.tonKho > 0 ? 'btn-primary' : 'btn-secondary']"
                :disabled="selectedProduct.tonKho <= 0"
              >
                {{ selectedProduct.tonKho > 0 ? `🛒 THÊM VÀO GIỎ - ${(currentPrice * selectedQuantity).toLocaleString()}đ` : 'TẠM THỜI KHÔNG THỂ MUA' }}
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.transition-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card.transition-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

/* ==================================== */
/* HIỆU ỨNG THẺ SẢN PHẨM KHÁCH VIP      */
/* ==================================== */
.card-vip {
  border: 2px solid #D4AF37 !important; /* Vàng hoàng gia */
  box-shadow: 0 0 12px rgba(212, 175, 55, 0.4) !important;
  background: linear-gradient(to bottom, #fffef7, #ffffff) !important;
}
.card-vip:hover {
  box-shadow: 0 0 25px rgba(212, 175, 55, 0.9) !important;
  border-color: #FFDF00 !important;
}
.modal-vip {
  border: 4px solid #D4AF37 !important;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.8) !important;
}

/* ==================================== */
/* HIỆU ỨNG THẺ SẢN PHẨM KHÁCH QUEN     */
/* ==================================== */
.card-quen {
  border: 2px solid #b0bec5 !important; /* Bạch kim */
  box-shadow: 0 0 12px rgba(176, 190, 197, 0.5) !important;
  background: linear-gradient(to bottom, #fdfdfd, #ffffff) !important;
}
.card-quen:hover {
  box-shadow: 0 0 25px rgba(176, 190, 197, 1) !important;
  border-color: #E5E4E2 !important;
}
.modal-quen {
  border: 4px solid #E5E4E2 !important;
  box-shadow: 0 0 40px rgba(176, 190, 197, 0.8) !important;
}

.mix-blend-multiply {
  mix-blend-mode: multiply;
}
.animate-pop {
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes popIn {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>