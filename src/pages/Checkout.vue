<script setup>
import { computed } from 'vue'
import { 
  cart, totalAmount, removeCartItem, handleCheckout,
  phuongThucThanhToan, maGiamGiaNhap, maGiamGiaApDung, apDungMaGiamGia, phiShip, currentView,
  currentUserProfile, tienGiamHangKhach, diaChiGiaoHang
} from '../store.js'

const tienGiamMGG = computed(() => maGiamGiaApDung.value ? maGiamGiaApDung.value.giamGia : 0)
const tongThanhToan = computed(() => {
  const tong = totalAmount.value + phiShip.value - tienGiamMGG.value - tienGiamHangKhach.value
  return tong > 0 ? tong : 0
})
</script>

<template>
  <div class="container my-5">
    <button @click="currentView = 'client'" class="btn btn-outline-secondary mb-4 fw-bold">← Tiếp tục mua hàng</button>
    
    <div class="row g-4">
      <div class="col-lg-7">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white fw-bold py-3">🛒 Chi tiết đơn hàng</div>
          <div class="card-body">
            <div v-if="cart.length === 0" class="text-center py-5 text-muted">Giỏ hàng của bạn đang trống!</div>
            
            <div v-for="(item, index) in cart" :key="index" class="d-flex align-items-center mb-3 border-bottom pb-3">
              <img :src="item.img" width="70" height="70" class="rounded border me-3" style="object-fit: cover;">
              <div class="flex-grow-1">
                <h6 class="fw-bold mb-1">{{ item.name }}</h6>
                
                <small class="text-secondary d-block mb-1 fw-semibold" v-if="item.cartOptions">
                  <span v-for="(val, key, i) in item.cartOptions" :key="key">
                    <span v-if="key === 'size'">Size {{ val }}</span>
                    <span v-else>{{ val }}</span>
                    <span v-if="i < Object.keys(item.cartOptions).length - 1"> | </span>
                  </span>
                </small>

                <span class="text-muted small">{{ Number(item.price).toLocaleString() }}đ x {{ item.quantity }}</span>
              </div>
              <div class="text-end">
                <div class="text-danger fw-bold mb-2">{{ (item.price * item.quantity).toLocaleString() }}đ</div>
                <button @click="removeCartItem(index)" class="btn btn-sm btn-outline-danger py-1 px-2">Xóa</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">

        <div class="card shadow-sm border-0 mb-4 border-info">
          <div class="card-body">
            <h5 class="fw-bold mb-3 border-bottom pb-2 text-info">📍 Thông tin Giao hàng</h5>
            
            <div class="mb-2">
              <label class="form-label small fw-bold text-dark mb-1">Địa chỉ nhận hàng <span class="text-danger">*</span></label>
              <textarea v-model="diaChiGiaoHang" class="form-control border-info" rows="2" placeholder="VD: Tòa nhà FPT, Số nhà, Đường..."></textarea>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="fw-bold mb-3 border-bottom pb-2">🎟️ Mã giảm giá</h5>
            <div class="input-group mb-2">
              <input v-model="maGiamGiaNhap" type="text" class="form-control" placeholder="Nhập mã giảm giá...">
              <button @click="apDungMaGiamGia" class="btn btn-dark fw-bold">Áp dụng</button>
            </div>
            <small v-if="maGiamGiaApDung" class="text-success fw-bold">Đã áp dụng mã: Giảm {{ maGiamGiaApDung.giamGia.toLocaleString() }}đ</small>
          </div>
        </div>

        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="fw-bold mb-3 border-bottom pb-2">💳 Phương thức thanh toán</h5>
            <div class="form-check mb-2">
              <input class="form-check-input" type="radio" v-model="phuongThucThanhToan" value="COD" id="cod">
              <label class="form-check-label fw-bold" for="cod">Thanh toán khi nhận hàng (COD)</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" v-model="phuongThucThanhToan" value="Chuyển khoản" id="bank">
              <label class="form-check-label fw-bold" for="bank">Chuyển khoản ngân hàng (QR Code)</label>
            </div>

            <div v-if="phuongThucThanhToan === 'Chuyển khoản'" class="text-center mt-3 p-3 bg-light rounded border border-primary">
              <p class="small fw-bold text-dark mb-2">Quét mã QR để thanh toán:</p>
              <img src="https://api.vietqr.io/image/970415-113366668888-0X9z74Y.jpg?amount=0&addInfo=ThanhToanBEEPHE" alt="QR Code" width="180" class="img-fluid rounded border">
              <p class="small text-danger mt-2 mb-0">Vui lòng quét mã trước khi ấn Đặt hàng.</p>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0 bg-light border border-warning border-2">
          <div class="card-body">
            <h5 class="fw-bold mb-3 text-center text-dark">TỔNG KẾT ĐƠN HÀNG</h5>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Tiền hàng:</span>
              <span class="fw-bold">{{ totalAmount.toLocaleString() }}đ</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Phí giao hàng:</span>
              <span class="fw-bold">{{ phiShip.toLocaleString() }}đ</span>
            </div>
            
            <div v-if="tienGiamHangKhach > 0" class="d-flex justify-content-between mb-2 text-warning fw-bold">
              <span>Đặc quyền khách {{ currentUserProfile.loaiKhach }} ({{ currentUserProfile.loaiKhach === 'VIP' ? '10%' : '5%' }}):</span>
              <span>-{{ tienGiamHangKhach.toLocaleString() }}đ</span>
            </div>

            <div v-if="maGiamGiaApDung" class="d-flex justify-content-between mb-2 text-success">
              <span>Giảm giá (Voucher):</span>
              <span class="fw-bold">-{{ tienGiamMGG.toLocaleString() }}đ</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold fs-5">TỔNG CỘNG:</span>
              <span class="fw-bold fs-4 text-danger">{{ tongThanhToan.toLocaleString() }}đ</span>
            </div>
            <button @click="handleCheckout" class="btn btn-primary btn-lg w-100 fw-bold shadow-sm" :disabled="cart.length === 0">
              ĐẶT HÀNG NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>