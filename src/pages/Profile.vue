<script setup>
import { computed, onMounted } from 'vue'
import { 
  currentUserProfile, handleUpdateProfile,
  oldPassword, newPassword, confirmNewPassword, handleChangePassword,
  dsHoaDon, layDuLieuHoaDon, capNhatTrangThaiHoaDon,
  handleLogout
} from '../store.js'

onMounted(() => {
  layDuLieuHoaDon()
})

const myOrders = computed(() => {
  return dsHoaDon.value.filter(hd => String(hd.khachId) === String(currentUserProfile.value.id))
})
</script>

<template>
  <div class="container my-5">
    <div class="row g-4">
      
      <div class="col-lg-4">
        <div class="card shadow-sm border-0 mb-4 bg-white">
          <div class="card-header bg-primary text-white fw-bold py-3">👤 Thông tin cá nhân</div>
          <div class="card-body p-4">
            <div class="mb-3"><label class="form-label fw-bold">Tên hiển thị</label><input v-model="currentUserProfile.user" type="text" class="form-control"></div>
            <div class="mb-3"><label class="form-label fw-bold">Số điện thoại</label><input v-model="currentUserProfile.phone" type="text" class="form-control"></div>
            <div class="mb-4"><label class="form-label fw-bold">Địa chỉ Email</label><input v-model="currentUserProfile.email" type="email" class="form-control"></div>
            <button @click="handleUpdateProfile" class="btn btn-primary w-100 fw-bold">Lưu thay đổi</button>
          </div>
        </div>

        <div class="card shadow-sm border-0 bg-white">
          <div class="card-header bg-dark text-white fw-bold py-3">🔒 Đổi mật khẩu</div>
          <div class="card-body p-4">
            <div class="mb-3"><label class="form-label fw-bold">Mật khẩu cũ</label><input v-model="oldPassword" type="password" class="form-control"></div>
            <div class="mb-3"><label class="form-label fw-bold">Mật khẩu mới</label><input v-model="newPassword" type="password" class="form-control" placeholder="Tối thiểu 6 ký tự"></div>
            <div class="mb-4"><label class="form-label fw-bold">Xác nhận mật khẩu mới</label><input v-model="confirmNewPassword" type="password" class="form-control"></div>
            <button @click="handleChangePassword" class="btn btn-warning text-dark w-100 fw-bold">Cập nhật mật khẩu</button>
          </div>
        </div>

        <button @click="handleLogout" class="btn btn-danger w-100 fw-bold py-2 mt-4 shadow-sm">
          🚪 Đăng xuất khỏi tài khoản
        </button>
      </div>

      <div class="col-lg-8">
        <div class="card shadow-sm border-0 bg-white h-100">
          <div class="card-header bg-success text-white fw-bold py-3 d-flex justify-content-between align-items-center">
            <span>📦 Lịch sử Đơn hàng của tôi</span>
            <button @click="layDuLieuHoaDon" class="btn btn-sm btn-light text-success fw-bold">Làm mới</button>
          </div>
          
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle m-0">
                <thead class="table-light">
                  <tr>
                    <th class="ps-4">Mã ĐH</th>
                    <th>Ngày đặt</th>
                    <th style="width: 30%">Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th class="text-center pe-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hd in myOrders" :key="hd.id">
                    <td class="ps-4 fw-bold text-primary">#{{ hd.id }}</td>
                    <td class="text-muted small">{{ hd.ngay }}</td>
                    <td><small>{{ hd.chiTiet }}</small></td>
                    <td class="text-danger fw-bold">{{ Number(hd.tong).toLocaleString() }}đ</td>
                    
                    <td>
                      <span v-if="hd.trangThai === 'Chờ xác nhận'" class="badge bg-warning text-dark">Chờ xác nhận</span>
                      <span v-else-if="hd.trangThai === 'Đang làm'" class="badge bg-info">Đang pha chế</span>
                      <span v-else-if="hd.trangThai === 'Đang giao'" class="badge bg-primary">Đang giao hàng</span>
                      <span v-else-if="hd.trangThai === 'Hoàn thành'" class="badge bg-success">Hoàn thành</span>
                      <span v-else-if="hd.trangThai === 'Đã hủy'" class="badge bg-danger">Đã hủy</span>
                    </td>
                    
                    <td class="text-center pe-4">
                      <button 
                        v-if="hd.trangThai === 'Chờ xác nhận'" 
                        @click="capNhatTrangThaiHoaDon(hd.id, 'Đã hủy')" 
                        class="btn btn-sm btn-outline-danger fw-bold"
                      >
                        Hủy đơn
                      </button>
                      
                      <span v-else-if="hd.trangThai === 'Đã hủy' && hd.lyDoHuy" class="text-danger small fw-bold" :title="hd.lyDoHuy">
                        Lý do: {{ hd.lyDoHuy }}
                      </span>
                      
                      <span v-else class="text-muted small">-</span>
                    </td>
                  </tr>
                  
                  <tr v-if="myOrders.length === 0">
                    <td colspan="6" class="text-center py-5 text-muted">
                      Bạn chưa có đơn hàng nào. Hãy ra Menu đặt thử một ly nước nhé!
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>