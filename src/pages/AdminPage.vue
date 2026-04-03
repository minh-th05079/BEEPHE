<script setup>
import { computed } from 'vue'
import { 
  adminTab,
  dsDanhMuc, showFormDM, isEditDM, formDM, luuDanhMuc, xoaDanhMuc, suaDanhMuc, huyFormDM,
  adminSanPhams, showFormSP, isEditSP, formSP, luuSanPham, xoaSanPham, suaSanPham, huyFormSP,
  registeredUsers, showDetailKH, selectedKH, xemKhachHang, dongChiTietKH, toggleBlacklist,
  searchKhachHang, filteredKhachHang, // <-- Thêm biến lọc khách hàng vào đây
  dsHoaDon, layDuLieuHoaDon, showDetailHD, selectedHD, xemHoaDon, dongChiTietHD,
  capNhatTrangThaiHoaDon
} from '../store.js'

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => { formSP.value.img = e.target.result; };
    reader.readAsDataURL(file);
  }
};

const handleStatusChange = async (hd, event) => {
  const trangThaiMoi = event.target.value;
  const originalValue = hd.trangThai;
  
  event.target.value = originalValue;
  
  const success = await capNhatTrangThaiHoaDon(hd.id, trangThaiMoi);
  
  if (success && showDetailHD.value && selectedHD.value && selectedHD.value.id === hd.id) {
    selectedHD.value.trangThai = trangThaiMoi;
  }
}

const handleCancelOrder = async (hd) => {
  const success = await capNhatTrangThaiHoaDon(hd.id, 'Đã hủy');
  if (success && showDetailHD.value && selectedHD.value && selectedHD.value.id === hd.id) {
    selectedHD.value.trangThai = 'Đã hủy';
  }
}

// ==========================================
// THUẬT TOÁN TÍNH TOÁN THỐNG KÊ DOANH THU 
// ==========================================
const currDate = new Date();
const cDay = currDate.getDate();
const cMonth = currDate.getMonth() + 1;
const cYear = currDate.getFullYear();

const checkDate = (dateStr, type) => {
  const match = String(dateStr).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return false;
  
  const d = parseInt(match[1]);
  const m = parseInt(match[2]);
  const y = parseInt(match[3]);
  
  if (type === 'day') return d === cDay && m === cMonth && y === cYear;
  if (type === 'month') return m === cMonth && y === cYear;
  if (type === 'year') return y === cYear;
  return false;
}

const doanhThuHomNay = computed(() => {
  return dsHoaDon.value
    .filter(hd => hd.trangThai === 'Hoàn thành' && checkDate(hd.ngay, 'day'))
    .reduce((sum, hd) => sum + Number(hd.tong), 0);
});

const doanhThuThangNay = computed(() => {
  return dsHoaDon.value
    .filter(hd => hd.trangThai === 'Hoàn thành' && checkDate(hd.ngay, 'month'))
    .reduce((sum, hd) => sum + Number(hd.tong), 0);
});

const doanhThuNamNay = computed(() => {
  return dsHoaDon.value
    .filter(hd => hd.trangThai === 'Hoàn thành' && checkDate(hd.ngay, 'year'))
    .reduce((sum, hd) => sum + Number(hd.tong), 0);
});

const tongDoanhThu = computed(() => {
  return dsHoaDon.value
    .filter(hd => hd.trangThai === 'Hoàn thành')
    .reduce((sum, hd) => sum + Number(hd.tong), 0);
});

// ==========================================
// THUẬT TOÁN THỐNG KÊ SẢN PHẨM BÁN CHẠY
// ==========================================
const thongKeSanPham = computed(() => {
  const thongKe = {};
  
  dsHoaDon.value.forEach(hd => {
    if (hd.trangThai === 'Hoàn thành' && Array.isArray(hd.danhSachMon)) {
      hd.danhSachMon.forEach(mon => {
        if (!thongKe[mon.id]) {
          const spGoc = adminSanPhams.value.find(s => String(s.id) === String(mon.id));
          const tenGoc = spGoc ? spGoc.name : mon.name.split(' (')[0];
          
          thongKe[mon.id] = {
            id: mon.id,
            name: tenGoc,
            img: mon.img,
            daBan: 0,
            doanhThu: 0
          };
        }
        
        thongKe[mon.id].daBan += mon.quantity;
        thongKe[mon.id].doanhThu += (mon.price * mon.quantity);
      });
    }
  });
  
  return Object.values(thongKe).sort((a, b) => b.daBan - a.daBan);
});
</script>

<template>
  <div>
    
    <div v-if="adminTab === 'thong-ke'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">📊 Thống kê & Báo cáo</h4>
        <button @click="layDuLieuHoaDon" class="btn btn-outline-primary fw-bold">🔄 Làm mới dữ liệu</button>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white border-0 shadow-sm h-100 p-4">
            <h6 class="fw-bold mb-3 text-warning">Doanh thu Hôm nay</h6>
            <h3 class="fw-bold m-0">{{ doanhThuHomNay.toLocaleString() }}đ</h3>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white border-0 shadow-sm h-100 p-4">
            <h6 class="fw-bold mb-3 text-dark">Doanh thu Tháng này</h6>
            <h3 class="fw-bold m-0">{{ doanhThuThangNay.toLocaleString() }}đ</h3>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white border-0 shadow-sm h-100 p-4">
            <h6 class="fw-bold mb-3 text-warning">Doanh thu Năm nay</h6>
            <h3 class="fw-bold m-0">{{ doanhThuNamNay.toLocaleString() }}đ</h3>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-dark text-white border-0 shadow-sm h-100 p-4">
            <h6 class="fw-bold mb-3 text-warning">Tổng Doanh thu Tất cả</h6>
            <h3 class="fw-bold m-0">{{ tongDoanhThu.toLocaleString() }}đ</h3>
          </div>
        </div>
      </div>
      
      <div class="row mb-4">
        <div class="col-12">
          <h5 class="fw-bold text-primary mb-3">🏆 Bảng Xếp Hạng Sản Phẩm Bán Chạy</h5>
          <div class="card shadow-sm border-0 bg-white">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="text-center ps-3" style="width: 5%">#</th>
                  <th style="width: 10%">Ảnh</th>
                  <th style="width: 35%">Tên sản phẩm</th>
                  <th class="text-center" style="width: 20%">Đã bán (Ly)</th>
                  <th class="text-end pe-4" style="width: 30%">Doanh thu mang lại</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sp, index) in thongKeSanPham" :key="sp.id">
                  <td class="text-center fw-bold ps-3">{{ index + 1 }}</td>
                  <td><img :src="sp.img" width="40" height="40" class="rounded border" style="object-fit: cover;"></td>
                  <td class="fw-bold text-dark">{{ sp.name }}</td>
                  <td class="text-center">
                    <span :class="['badge fs-6', index === 0 ? 'bg-danger' : index === 1 ? 'bg-warning text-dark' : index === 2 ? 'bg-info' : 'bg-success']">
                      {{ sp.daBan }}
                    </span>
                  </td>
                  <td class="text-end pe-4 text-primary fw-bold">{{ sp.doanhThu.toLocaleString() }}đ</td>
                </tr>
                <tr v-if="thongKeSanPham.length === 0">
                  <td colspan="5" class="text-center py-5 text-muted">
                    Chưa có sản phẩm nào được bán thành công.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card shadow-sm bg-white border-0 p-4 border-start border-4 border-warning">
        <h5 class="fw-bold text-dark mb-2">💡 Lưu ý hệ thống</h5>
        <p class="text-muted m-0">
          - Doanh thu và bảng xếp hạng sản phẩm chỉ được tính từ các đơn hàng có trạng thái là <b>"Hoàn thành"</b>.<br>
          - Các đơn hàng "Chờ xác nhận", "Đang làm", "Đang giao" hoặc "Đã hủy" <b>không</b> được cộng vào hệ thống thống kê.
        </p>
      </div>
    </div>

    <div v-if="adminTab === 'danh-muc'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">{{ showFormDM ? (isEditDM ? 'Sửa Danh mục' : 'Thêm Danh mục Mới') : 'Quản lý Danh mục' }}</h4>
        <button v-if="!showFormDM" @click="showFormDM = true" class="btn btn-primary fw-bold">+ Thêm Danh mục</button>
      </div>
      <div v-if="showFormDM" class="card p-4 shadow-sm bg-white border-0">
        <div class="row g-3">
          <div class="col-md-4"><label class="fw-bold mb-2">Mã danh mục</label><input v-model="formDM.id" class="form-control" :disabled="isEditDM"></div>
          <div class="col-md-8"><label class="fw-bold mb-2">Tên hiển thị</label><input v-model="formDM.name" class="form-control" placeholder="Nhập tên..."></div>
        </div>
        <div class="mt-4"><button @click="luuDanhMuc" class="btn btn-primary fw-bold me-2">Lưu Danh mục</button><button @click="huyFormDM" class="btn btn-secondary fw-bold">Quay lại</button></div>
      </div>
      <table v-else class="table table-hover shadow-sm bg-white rounded">
        <thead class="table-primary"><tr><th>Mã Danh mục</th><th>Tên hiển thị</th><th class="text-center">Hành động</th></tr></thead>
        <tbody>
          <tr v-for="dm in dsDanhMuc" :key="dm.id">
            <td class="fw-bold">{{ dm.id }}</td><td class="text-primary fw-bold">{{ dm.name }}</td>
            <td class="text-center"><button @click="suaDanhMuc(dm)" class="btn btn-sm btn-warning me-2 fw-bold">Sửa</button><button @click="xoaDanhMuc(dm.id)" class="btn btn-sm btn-danger fw-bold">Xóa</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="adminTab === 'san-pham'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">{{ showFormSP ? (isEditSP ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới') : 'Quản lý Sản phẩm' }}</h4>
        <button v-if="!showFormSP" @click="showFormSP = true" class="btn btn-primary fw-bold">+ Thêm Sản phẩm</button>
      </div>
      <div v-if="showFormSP" class="card p-4 shadow-sm bg-white border-0">
        <div class="row g-3">
          <div class="col-md-4"><label class="fw-bold mb-2">Tên món</label><input v-model="formSP.name" class="form-control" placeholder="Tên đồ uống..."></div>
          <div class="col-md-4">
            <label class="fw-bold mb-2">Danh mục</label>
            <select v-model="formSP.category" class="form-select">
              <option value="" disabled>-- Chọn danh mục --</option>
              <option v-for="dm in dsDanhMuc" :key="dm.id" :value="dm.id">{{ dm.name }}</option>
            </select>
          </div>
          <div class="col-md-2"><label class="fw-bold mb-2">Giá (VNĐ)</label><input v-model="formSP.price" type="number" class="form-control" min="0"></div>
          <div class="col-md-2"><label class="fw-bold mb-2 text-danger">Kho (SL)</label><input v-model="formSP.tonKho" type="number" class="form-control" min="0"></div>
          <div class="col-md-12">
            <label class="fw-bold mb-2">Hình ảnh</label>
            <div class="d-flex gap-2">
              <input type="text" v-model="formSP.img" class="form-control" placeholder="Link ảnh">
              <input type="file" @change="handleFileUpload" accept="image/*" class="form-control w-50">
            </div>
          </div>
        </div>
        <div class="mt-4"><button @click="luuSanPham" class="btn btn-primary fw-bold me-2">Lưu Sản phẩm</button><button @click="huyFormSP" class="btn btn-secondary fw-bold">Quay lại</button></div>
      </div>
      <table v-else class="table table-hover shadow-sm bg-white rounded">
        <thead class="table-primary"><tr><th>ID</th><th>Tên món</th><th>Danh mục</th><th>Ảnh</th><th>Giá</th><th>Tồn kho</th><th class="text-center">Hành động</th></tr></thead>
        <tbody>
          <tr v-for="sp in adminSanPhams" :key="sp.id">
            <td>{{ sp.id }}</td><td class="fw-bold">{{ sp.name }}</td>
            <td><span class="badge bg-dark text-white">{{ dsDanhMuc.find(d => String(d.id) === String(sp.category))?.name || 'Khác' }}</span></td>
            <td><img :src="sp.img" width="40" height="40" class="rounded border" style="object-fit: cover;"></td>
            <td class="text-danger fw-bold">{{ Number(sp.price).toLocaleString() }}đ</td>
            <td><span v-if="sp.tonKho > 0" class="badge bg-success">Còn {{ sp.tonKho }}</span><span v-else class="badge bg-danger">Hết hàng</span></td>
            <td class="text-center"><button @click="suaSanPham(sp)" class="btn btn-sm btn-warning me-2 fw-bold">Sửa</button><button @click="xoaSanPham(sp.id)" class="btn btn-sm btn-danger fw-bold">Xóa</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="adminTab === 'khach-hang'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">{{ showDetailKH ? 'Chi tiết Khách Hàng' : 'Danh sách Tài khoản' }}</h4>
        
        <div v-if="!showDetailKH" class="input-group shadow-sm" style="max-width: 300px;">
          <span class="input-group-text bg-white border-primary text-primary">🔍</span>
          <input 
            v-model="searchKhachHang" 
            type="text" 
            class="form-control border-primary" 
            placeholder="Tìm theo Tên, SĐT, Email..."
          >
          <button 
            v-if="searchKhachHang" 
            @click="searchKhachHang = ''" 
            class="btn btn-outline-danger border-primary border-start-0"
            title="Xóa tìm kiếm"
          >
            ✖
          </button>
        </div>
      </div>
      
      <div v-if="showDetailKH" class="card p-4 shadow-sm bg-white border-0">
        <div class="row g-3">
          <div class="col-md-6"><label class="fw-bold mb-2">ID Tài khoản</label><input :value="selectedKH.id" class="form-control bg-light" readonly></div>
          <div class="col-md-6"><label class="fw-bold mb-2">Tên tài khoản</label><input :value="selectedKH.user" class="form-control bg-light" readonly></div>
          <div class="col-md-6"><label class="fw-bold mb-2">Email</label><input :value="selectedKH.email" class="form-control bg-light" readonly></div>
          <div class="col-md-6"><label class="fw-bold mb-2">Số điện thoại</label><input :value="selectedKH.phone || 'Chưa cập nhật'" class="form-control bg-light" readonly></div>
          <div class="col-md-12">
            <label class="fw-bold mb-2">Trạng thái hiện tại</label>
            <div>
              <span v-if="selectedKH.isBlacklisted" class="badge bg-danger fs-6 p-2">Tài khoản đang bị khóa</span>
              <span v-else class="badge bg-success fs-6 p-2">Đang hoạt động bình thường</span>
            </div>
          </div>
        </div>
        <div class="mt-4 border-top pt-3">
          <button @click="dongChiTietKH" class="btn btn-secondary fw-bold me-2">Quay lại</button>
          <button v-if="!selectedKH.isBlacklisted" @click="toggleBlacklist(selectedKH)" class="btn btn-danger fw-bold">Khóa tài khoản này</button>
          <button v-else @click="toggleBlacklist(selectedKH)" class="btn btn-success fw-bold">Mở khóa tài khoản</button>
        </div>
      </div>
      
      <table v-else class="table table-hover shadow-sm align-middle bg-white rounded">
        <thead class="table-primary"><tr><th>ID</th><th>Tài khoản</th><th>Email</th><th>SĐT</th><th class="text-center">Trạng thái</th><th class="text-center">Hành động</th></tr></thead>
        <tbody>
          <tr v-for="kh in filteredKhachHang" :key="kh.id">
            <td>{{ kh.id }}</td><td class="fw-bold">{{ kh.user }}</td><td>{{ kh.email }}</td><td>{{ kh.phone || 'Chưa cập nhật' }}</td>
            <td class="text-center"><span v-if="kh.isBlacklisted" class="badge bg-danger">Đã khóa</span><span v-else class="badge bg-success">Hoạt động</span></td>
            <td class="text-center">
              <button @click="xemKhachHang(kh)" class="btn btn-sm btn-info text-white fw-bold me-2">Chi tiết</button>
              <button v-if="!kh.isBlacklisted" @click="toggleBlacklist(kh)" class="btn btn-sm btn-outline-danger fw-bold" title="Khóa tài khoản">Khóa</button>
              <button v-else @click="toggleBlacklist(kh)" class="btn btn-sm btn-success fw-bold" title="Mở khóa tài khoản">Mở khóa</button>
            </td>
          </tr>
          <tr v-if="filteredKhachHang.length === 0">
            <td colspan="6" class="text-center text-muted py-5">
              <div class="fs-1 mb-2">🔎</div>
              <h5 v-if="searchKhachHang">Không tìm thấy tài khoản nào khớp với "{{ searchKhachHang }}"</h5>
              <h5 v-else>Chưa có tài khoản nào trên hệ thống.</h5>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="adminTab === 'hoa-don'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">{{ showDetailHD ? 'Chi tiết Đơn Hàng' : 'Theo dõi Đơn Hàng' }}</h4>
        <button v-if="!showDetailHD" @click="layDuLieuHoaDon" class="btn btn-outline-primary fw-bold">🔄 Làm mới danh sách</button>
      </div>

      <div v-if="showDetailHD" class="card p-4 shadow-sm bg-white border-0">
        <div class="row g-3">
          <div class="col-md-4"><label class="fw-bold mb-2">Mã đơn hàng</label><input :value="'#' + selectedHD.id" class="form-control bg-light text-primary fw-bold" readonly></div>
          <div class="col-md-4"><label class="fw-bold mb-2">Ngày đặt</label><input :value="selectedHD.ngay" class="form-control bg-light" readonly></div>
          
          <div class="col-md-4">
            <label class="fw-bold mb-2">Trạng thái</label>
            <select :value="selectedHD.trangThai" @change="handleStatusChange(selectedHD, $event)" 
              class="form-select fw-bold bg-light border-primary text-primary"
              :disabled="selectedHD.trangThai === 'Hoàn thành' || selectedHD.trangThai === 'Đã hủy'"
            >
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đang làm">Đang làm</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
          
          <h5 class="mt-4 border-bottom pb-2 fw-bold text-primary">Thông tin Khách hàng</h5>
          <div class="col-md-4"><label class="fw-bold mb-2">Tên khách</label><input :value="selectedHD.khach" class="form-control bg-light" readonly></div>
          <div class="col-md-4"><label class="fw-bold mb-2">Số điện thoại</label><input :value="selectedHD.sdt || 'Không có'" class="form-control bg-light" readonly></div>
          <div class="col-md-4"><label class="fw-bold mb-2">Email</label><input :value="selectedHD.email || 'Không có'" class="form-control bg-light" readonly></div>

          <h5 class="mt-4 border-bottom pb-2 fw-bold text-primary">Chi tiết Sản phẩm</h5>
          <div class="col-12">
            <ul class="list-group">
              <li v-for="(mon, index) in selectedHD.danhSachMon" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                  <img :src="mon.img" width="50" height="50" class="rounded border" style="object-fit: cover;">
                  <div>
                    <strong class="d-block">{{ mon.name }}</strong>
                    <small class="text-muted">{{ Number(mon.price).toLocaleString() }}đ x {{ mon.quantity }}</small>
                  </div>
                </div>
                <span class="text-danger fw-bold">{{ (mon.price * mon.quantity).toLocaleString() }}đ</span>
              </li>
            </ul>
          </div>
          <div class="col-12 text-end mt-3">
            <h4 class="fw-bold">Tổng tiền: <span class="text-danger">{{ Number(selectedHD.tong).toLocaleString() }} VNĐ</span></h4>
          </div>
        </div>

        <div class="mt-4 border-top pt-3 d-flex gap-2">
          <button @click="dongChiTietHD" class="btn btn-secondary fw-bold">← Quay lại danh sách</button>
          <button v-if="selectedHD.trangThai !== 'Đã hủy' && selectedHD.trangThai !== 'Hoàn thành'" @click="handleCancelOrder(selectedHD)" class="btn btn-danger fw-bold ms-auto">❌ Hủy đơn hàng này</button>
        </div>
      </div>
      
      <table v-else class="table table-hover shadow-sm bg-white rounded align-middle">
        <thead class="table-primary">
          <tr>
            <th>Mã ĐH</th>
            <th>Ngày đặt</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th style="width: 15%">Trạng thái</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hd in dsHoaDon" :key="hd.id">
            <td class="fw-bold">#{{ hd.id }}</td>
            <td class="text-muted small">{{ hd.ngay }}</td>
            <td class="fw-bold text-primary">{{ hd.khach }}</td>
            <td class="text-danger fw-bold">{{ Number(hd.tong).toLocaleString() }}đ</td>
            
            <td>
              <select :value="hd.trangThai" @change="handleStatusChange(hd, $event)" 
                :class="['form-select form-select-sm fw-bold', {
                  'text-warning bg-light border-warning': hd.trangThai === 'Chờ xác nhận',
                  'text-info bg-light border-info': hd.trangThai === 'Đang làm',
                  'text-primary bg-light border-primary': hd.trangThai === 'Đang giao',
                  'text-success bg-light border-success': hd.trangThai === 'Hoàn thành',
                  'text-danger bg-light border-danger': hd.trangThai === 'Đã hủy'
                }]"
                :disabled="hd.trangThai === 'Hoàn thành' || hd.trangThai === 'Đã hủy'"
              >
                <option value="Chờ xác nhận" class="text-dark">Chờ xác nhận</option>
                <option value="Đang làm" class="text-dark">Đang làm</option>
                <option value="Đang giao" class="text-dark">Đang giao</option>
                <option value="Hoàn thành" class="text-dark">Hoàn thành</option>
                <option value="Đã hủy" class="text-dark">Đã hủy</option>
              </select>
            </td>

            <td class="text-center">
              <div class="d-flex gap-2 justify-content-center">
                <button @click="xemHoaDon(hd)" class="btn btn-sm btn-info text-white fw-bold px-3">Chi tiết</button>
                <button v-if="hd.trangThai !== 'Đã hủy' && hd.trangThai !== 'Hoàn thành'" @click="handleCancelOrder(hd)" class="btn btn-sm btn-outline-danger px-3">Hủy đơn</button>
              </div>
            </td>
          </tr>
          <tr v-if="dsHoaDon.length === 0"><td colspan="6" class="text-center py-4 text-muted">Chưa có đơn hàng nào trên hệ thống.</td></tr>
        </tbody>
      </table>
    </div>

  </div>
</template>