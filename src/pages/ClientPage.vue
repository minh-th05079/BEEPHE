<script setup>
import { ref, computed } from 'vue'
import { 
  dsDanhMuc, filteredProducts, addToCart, activeCategory, searchQuery, currentUserProfile, adminSanPhams,
  reviewText, reviewRating, submitReview, currentView 
} from '../store.js'

const selectedProduct = ref(null)

const selectedSize = ref(null) 
const selectedQuantity = ref(1) 
const selectedDynamicOptions = ref({})
const hoverRating = ref(0)

const availableSizes = computed(() => {
  if (!selectedProduct.value) return []
  if (Array.isArray(selectedProduct.value.sizes) && selectedProduct.value.sizes.length > 0) return selectedProduct.value.sizes
  return [
     { ten: 'Size S', phuThu: 0, tonKho: selectedProduct.value.tonKhoS || 0 },
     { ten: 'Size M', phuThu: 5000, tonKho: selectedProduct.value.tonKhoM || 0 },
     { ten: 'Size L', phuThu: 10000, tonKho: selectedProduct.value.tonKhoL || 0 }
  ]
})

const currentStock = computed(() => {
  if (!selectedSize.value) return 0
  return Number(selectedSize.value.tonKho) || 0
})

const currentPrice = computed(() => {
  if (!selectedProduct.value || !selectedSize.value) return 0
  let basePrice = selectedProduct.value.price
  
  basePrice += Number(selectedSize.value.phuThu || 0)

  Object.values(selectedDynamicOptions.value).forEach(opt => {
    if (opt && opt.phuThu) basePrice += Number(opt.phuThu)
  })

  return basePrice
})

const getTongTonKho = (sp) => {
  if (Array.isArray(sp.sizes) && sp.sizes.length > 0) return sp.sizes.reduce((sum, s) => sum + Number(s.tonKho || 0), 0)
  return (Number(sp.tonKhoS || 0) + Number(sp.tonKhoM || 0) + Number(sp.tonKhoL || 0))
}

const openDetail = (item) => {
  selectedProduct.value = item
  
  let sizesToUse = item.sizes
  if (!Array.isArray(sizesToUse) || sizesToUse.length === 0) {
      sizesToUse = [
         { ten: 'Size S', phuThu: 0, tonKho: item.tonKhoS || 0 },
         { ten: 'Size M', phuThu: 5000, tonKho: item.tonKhoM || 0 },
         { ten: 'Size L', phuThu: 10000, tonKho: item.tonKhoL || 0 }
      ]
  }
  selectedSize.value = sizesToUse[0] || { ten: 'Mặc định', phuThu: 0, tonKho: 0 }

  selectedQuantity.value = 1 
  hoverRating.value = 0 
  
  selectedDynamicOptions.value = {}
}

const toggleDynamicOption = (tenNhom, lc) => {
  const currentOptions = { ...selectedDynamicOptions.value }
  
  if (currentOptions[tenNhom] && currentOptions[tenNhom].ten === lc.ten) {
    delete currentOptions[tenNhom]
  } else {
    const nextOptions = { ...currentOptions, [tenNhom]: lc }
    
    const chonNongAm = Object.values(nextOptions).some(opt => 
      opt.ten.toLowerCase().includes('nóng') || 
      opt.ten.toLowerCase().includes('ấm')
    )
    
    const chonDaLanh = Object.entries(nextOptions).some(([nhom, opt]) => 
      opt.ten.toLowerCase().includes('đá') || 
      opt.ten.toLowerCase().includes('lạnh') ||
      (nhom.toLowerCase().includes('đá') && !opt.ten.toLowerCase().includes('không đá'))
    )

    if (chonNongAm && chonDaLanh) {
      return alert('❌ Xung đột logic: Bạn không thể vừa chọn uống Nóng/Ấm lại vừa thêm tuỳ chọn Đá/Lạnh!');
    }

    currentOptions[tenNhom] = lc
  }
  
  selectedDynamicOptions.value = currentOptions
}

const decreaseQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--
  }
}

const validateQuantity = () => {
  let val = parseInt(selectedQuantity.value, 10);
  if (isNaN(val) || val < 1) {
    selectedQuantity.value = 1;
  } else if (val > currentStock.value) {
    selectedQuantity.value = currentStock.value;
    alert('Vượt quá số lượng tồn kho hiện tại!');
  } else {
    selectedQuantity.value = val;
  }
}

const confirmAddToCart = () => {
  const dynamicOptionsToSave = {}
  for (const key in selectedDynamicOptions.value) {
     dynamicOptionsToSave[key] = selectedDynamicOptions.value[key].ten
  }

  const customItem = {
    ...selectedProduct.value,
    cartOptions: { size: (selectedSize.value && selectedSize.value.ten) || '', ...dynamicOptionsToSave },
    price: currentPrice.value,
    selectedSizeName: (selectedSize.value && selectedSize.value.ten) || ''
  }
  addToCart(customItem, selectedQuantity.value)
  selectedProduct.value = null 
}

const handleSubmitReview = async () => {
  const success = await submitReview(selectedProduct.value.id);
  if (success) {
    alert('Đánh giá của bạn đã được ghi nhận!')
    const updatedProduct = adminSanPhams.value.find(s => String(s.id) === String(selectedProduct.value.id));
    if (updatedProduct) {
      selectedProduct.value.danhGia = updatedProduct.danhGia;
    }
  }
}
</script>

<template>
  <div>
    <div class="position-relative text-center mb-5">
      <img src="/images/banner.jpg" class="w-100" style="height: 380px; object-fit: cover; filter: brightness(0.85);" />
      <div class="position-absolute top-50 start-50 translate-middle p-4 shadow-lg" style="background: rgba(78, 52, 46, 0.9); border-radius: 20px; border: 3px solid #f5b041; width: 80%; max-width: 600px;">
        <h1 class="display-3 fw-bold mb-3" style="color: #f5b041; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">BEEPHE</h1>
        <p class="fs-4 text-white m-0" style="letter-spacing: 1px;">BEEPHE Đã Uống Là Phải Phê!</p>
      </div>
    </div>

    <div class="container my-5" id="menu-section">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center border-bottom border-primary border-3 pb-2 mb-4 gap-3">
        <h2 class="text-primary fw-bold text-uppercase mb-0">
          {{ activeCategory === 'all' ? 'Tất cả đồ uống' : (dsDanhMuc.find(d => String(d.id) === String(activeCategory)) || {}).name }}
        </h2>
        
        <div class="input-group shadow-sm" style="max-width: 350px;">
          <span class="input-group-text bg-white border-primary text-primary">🔍</span>
          <input v-model="searchQuery" type="text" class="form-control border-primary" placeholder="Tìm tên đồ uống...">
          <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-outline-danger border-primary border-start-0" title="Xóa tìm kiếm">✖</button>
        </div>
      </div>

      <div class="row g-4 justify-content-center">
        <div class="col-6 col-md-4 col-lg-3" v-for="item in filteredProducts" :key="item.id">
          
          <div :class="['card bg-white h-100 shadow-sm position-relative transition-hover', 
                       getTongTonKho(item) <= 0 ? 'opacity-75' : '',
                        currentUserProfile.loaiKhach === 'VIP' ? 'card-vip' : 
                        currentUserProfile.loaiKhach === 'Quen' ? 'card-quen' : 'border-0']">
            <div v-if="getTongTonKho(item) <= 0" class="position-absolute top-50 start-50 translate-middle w-100 text-center" style="z-index: 2;">
              <span class="badge bg-danger fs-5 py-2 px-3 shadow rounded-pill">ĐÃ HẾT HÀNG</span>
            </div>
            
            <div class="p-3 text-center bg-light" style="border-radius: 12px 12px 0 0; cursor: pointer;" @click="openDetail(item)">
              <img :src="item.img" class="card-img-top mix-blend-multiply" style="height: 180px; object-fit: contain;" />
            </div>
            
            <div class="card-body text-center d-flex flex-column p-4">
              <h5 class="fs-5 fw-bold mb-2 text-dark" style="cursor: pointer;" @click="openDetail(item)">{{ item.name }}</h5>
              <p class="text-primary fw-bold fs-4 mb-2">{{ item.price.toLocaleString() }}đ</p>
              
              <small class="text-muted mb-4 d-block fw-semibold" style="font-size: 0.9rem;">
                {{ getTongTonKho(item) > 0 ? `Còn lại: ${getTongTonKho(item)} sản phẩm` : 'Tạm hết hàng' }}
              </small>
              
              <div class="mt-auto d-flex gap-2">
                <button @click="openDetail(item)" class="btn btn-outline-primary fw-bold flex-grow-1 shadow-sm py-2">Chọn Mua</button>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <div v-if="filteredProducts.length === 0" class="text-center py-5 text-muted">
        <h4 class="mb-3">Không tìm thấy sản phẩm nào phù hợp.</h4>
        <button @click="searchQuery = ''; activeCategory = 'all'" class="btn btn-primary fw-bold">Xem tất cả đồ uống</button>
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
              <img :src="selectedProduct.img" class="img-fluid mix-blend-multiply transition-hover" style="max-height: 350px; object-fit: contain;" />
            </div>
            
            <div class="col-md-7 d-flex flex-column justify-content-center p-4 p-md-5 bg-white">
              
              <h2 class="fw-bold text-dark mb-1">{{ selectedProduct.name }}</h2>
              <h3 class="text-primary fw-bold mb-2">{{ Number(selectedProduct.price).toLocaleString() }} VNĐ</h3>
              
              <p v-if="selectedProduct.moTa" class="text-muted mb-4 fst-italic border-start border-3 border-primary ps-3" style="font-size: 0.95rem;">
                {{ selectedProduct.moTa }}
              </p>
               
              <div class="mb-4 bg-light p-3 rounded-3 border border-warning">
                <h6 class="fw-bold mb-3 text-dark border-bottom pb-2">⚙️ Tùy chỉnh sản phẩm:</h6>
                
                <div class="mb-3">
                  <label class="form-label text-muted small fw-bold mb-2">1. Chọn Size</label>
                  <div class="d-flex flex-wrap gap-2">
                    <button 
                      v-for="(sz, idx) in availableSizes" :key="idx"
                      @click="selectedSize = sz" 
                      :class="['btn btn-sm flex-grow-1 fw-bold', (selectedSize && selectedSize.ten) === sz.ten ? 'btn-warning text-dark border-warning' : 'btn-outline-secondary']">
                      {{ sz.ten || 'Mặc định' }} <span v-if="sz.phuThu > 0">(+{{ Number(sz.phuThu).toLocaleString() }}đ)</span>
                    </button>
                  </div>
                </div>

                <div v-for="(nhom, index) in selectedProduct.tuyChinhDong" :key="index" class="mb-3">
                  <label class="form-label text-muted small fw-bold mb-2">{{ index + 2 }}. {{ nhom.tenNhom }} <span class="fw-normal fst-italic text-secondary">(Không bắt buộc)</span></label>
                  <div class="d-flex flex-wrap gap-2">
                    <button 
                      v-for="(lc, lcIdx) in nhom.luaChon" :key="lcIdx"
                      @click="toggleDynamicOption(nhom.tenNhom, lc)"
                      :class="['btn btn-sm fw-bold flex-grow-1', (selectedDynamicOptions[nhom.tenNhom] && selectedDynamicOptions[nhom.tenNhom].ten) === lc.ten ? 'btn-info text-white border-info' : 'btn-outline-info']"
                    >
                      {{ lc.ten }} <span v-if="lc.phuThu > 0">(+{{ Number(lc.phuThu).toLocaleString() }}đ)</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="d-flex align-items-center mb-4 p-3 bg-light rounded-3 border">
                <span class="fw-bold me-3 text-dark">Trạng thái kho ({{ (selectedSize && selectedSize.ten) || 'Chưa chọn' }}):</span>
                <span v-if="currentStock > 0" class="text-success fw-bold fs-5">✔️ Còn {{ currentStock }} ly</span>
                <span v-else class="text-danger fw-bold fs-5">❌ Đã hết nguyên liệu Size này</span>
              </div>
              
              <div v-if="currentStock > 0" class="d-flex align-items-center mb-4">
                <span class="fw-bold me-3 text-dark">Số lượng:</span>
                <div class="input-group input-group-lg" style="width: 150px;">
                  <button @click="decreaseQuantity" class="btn btn-outline-secondary fw-bold">-</button>
                  <input type="number" class="form-control text-center fw-bold bg-white" 
                         v-model.number="selectedQuantity" 
                         @blur="validateQuantity" 
                         @keyup.enter="validateQuantity" 
                         min="1" />
                  <button @click="selectedQuantity < currentStock ? selectedQuantity++ : alert('Vượt quá số lượng tồn kho!')" class="btn btn-outline-secondary fw-bold">+</button>
                </div>
              </div>
              
              <button 
                @click="confirmAddToCart" 
                :class="['btn btn-lg w-100 fw-bold shadow-sm py-3', currentStock > 0 ? 'btn-primary' : 'btn-secondary']"
                :disabled="currentStock <= 0"
              >
                {{ currentStock > 0 ? `🛒 THÊM VÀO GIỎ - ${(currentPrice * selectedQuantity).toLocaleString()}đ` : 'TẠM THỜI KHÔNG THỂ MUA' }}
              </button>

              <div class="mt-5 border-top pt-4">
                <h5 class="fw-bold text-dark mb-4">💬 Đánh giá & Nhận xét</h5>
                
                <div v-if="currentUserProfile.id" class="bg-light p-3 rounded-3 mb-4 shadow-sm">
                  <label class="form-label fw-bold small text-muted">Bạn đánh giá món này thế nào?</label>
                  <div class="d-flex gap-2 mb-3 fs-3">
                    <span 
                      v-for="star in 5" :key="star"
                      @click="reviewRating = star"
                      @mouseover="hoverRating = star"
                      @mouseleave="hoverRating = 0"
                      class="cursor-pointer transition-all"
                      :style="{ color: (hoverRating || reviewRating) >= star ? '#f5b041' : '#ccc' }"
                    >★</span>
                  </div>
                  <textarea 
                    v-model="reviewText" 
                    class="form-control mb-3" 
                    rows="2" 
                    placeholder="Viết cảm nhận của bạn về hương vị, cách phục vụ..."
                  ></textarea>
                  <button @click="handleSubmitReview" class="btn btn-dark fw-bold btn-sm px-4">Gửi nhận xét</button>
                </div>
                
                <div v-else class="alert alert-warning small py-2 mb-4">
                  Vui lòng <a href="#" @click.prevent="currentView = 'login'" class="fw-bold text-dark">đăng nhập</a> để để lại đánh giá của bạn.
                </div>

                <div class="review-list">
                  <div v-if="!selectedProduct.danhGia || selectedProduct.danhGia.length === 0" class="text-center py-3 text-muted fst-italic">
                    Chưa có đánh giá nào cho sản phẩm này.
                  </div>
                  <div v-for="(rev, idx) in (selectedProduct.danhGia || []).slice().reverse()" :key="idx" class="mb-3 pb-3 border-bottom border-light">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <strong class="text-primary">{{ rev.user }}</strong>
                      <small class="text-muted">{{ rev.date }}</small>
                    </div>
                    <div class="text-warning mb-2" style="font-size: 0.8rem;">
                      <span v-for="s in 5" :key="s">
                        {{ s <= rev.rating ? '★' : '☆' }}
                      </span>
                    </div>
                    <p class="small mb-0 text-dark">{{ rev.comment }}</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.transition-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.card.transition-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
.card-vip { border: 2px solid #D4AF37 !important; box-shadow: 0 0 12px rgba(212, 175, 55, 0.4) !important; background: linear-gradient(to bottom, #fffef7, #ffffff) !important; }
.modal-vip { border: 4px solid #D4AF37 !important; box-shadow: 0 0 40px rgba(212, 175, 55, 0.8) !important; }
.card-quen { border: 2px solid #b0bec5 !important; box-shadow: 0 0 12px rgba(176, 190, 197, 0.5) !important; background: linear-gradient(to bottom, #fdfdfd, #ffffff) !important; }
.modal-quen { border: 4px solid #E5E4E2 !important; box-shadow: 0 0 40px rgba(176, 190, 197, 0.8) !important; }
.mix-blend-multiply { mix-blend-mode: multiply; }
.animate-pop { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes popIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0;
}
.cursor-pointer { cursor: pointer; }
.transition-all { transition: all 0.2s ease; }
</style>