<script setup>
import { 
  adminTab,
  dsDanhMuc, showFormDM, isEditDM, formDM, luuDanhMuc, xoaDanhMuc, suaDanhMuc, huyFormDM,
  adminSanPhams, showFormSP, isEditSP, formSP, luuSanPham, xoaSanPham, suaSanPham, huyFormSP,
  registeredUsers, showDetailKH, selectedKH, xemKhachHang, dongChiTietKH, toggleBlacklist,
  dsHoaDon, showFormHD, isEditHD, formHD, luuHoaDon, xoaHoaDon, suaHoaDon, huyFormHD
} from '../store.js'

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => { formSP.value.img = e.target.result; };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <div>
    <div v-if="adminTab === 'danh-muc'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">{{ showFormDM ? (isEditDM ? 'Sửa Danh mục' : 'Thêm Danh mục Mới') : 'Quản lý Danh mục' }}</h4>
        <button v-if="!showFormDM" @click="showFormDM = true" class="btn btn-primary fw-bold">+ Thêm Danh mục</button>
      </div>

      <div v-if="showFormDM" class="card p-4 shadow-sm bg-white border-0">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="fw-bold mb-2">Mã danh mục (vd: sinh-to)</label>
            <input v-model="formDM.id" class="form-control" :disabled="isEditDM">
          </div>
          <div class="col-md-8">
            <label class="fw-bold mb-2">Tên hiển thị (vd: 🍹 Sinh tố)</label>
            <input v-model="formDM.name" class="form-control" placeholder="Nhập tên...">
          </div>
        </div>
        <div class="mt-4">
          <button @click="luuDanhMuc" class="btn btn-primary fw-bold me-2">Lưu Danh mục</button>
          <button @click="huyFormDM" class="btn btn-secondary fw-bold">Quay lại</button>
        </div>
      </div>

      <table v-else class="table table-hover shadow-sm bg-white rounded">
        <thead class="table-primary">
          <tr><th>Mã Danh mục</th><th>Tên hiển thị</th><th class="text-center">Hành động</th></tr>
        </thead>
        <tbody>
          <tr v-for="dm in dsDanhMuc" :key="dm.id">
            <td class="fw-bold">{{ dm.id }}</td>
            <td class="text-primary fw-bold">{{ dm.name }}</td>
            <td class="text-center">
              <button @click="suaDanhMuc(dm)" class="btn btn-sm btn-warning me-2 fw-bold">Sửa</button>
              <button @click="xoaDanhMuc(dm.id)" class="btn btn-sm btn-danger fw-bold">Xóa</button>
            </td>
          </tr>
          <tr v-if="dsDanhMuc.length === 0"><td colspan="3" class="text-center text-muted py-3">Chưa có danh mục nào.</td></tr>
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
          <div class="col-md-4">
            <label class="fw-bold mb-2">Tên món</label>
            <input v-model="formSP.name" class="form-control" placeholder="Tên đồ uống...">
          </div>
          <div class="col-md-4">
            <label class="fw-bold mb-2">Danh mục</label>
            <select v-model="formSP.category" class="form-select">
              <option value="" disabled>-- Chọn danh mục --</option>
              <option v-for="dm in dsDanhMuc" :key="dm.id" :value="dm.id">{{ dm.name }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="fw-bold mb-2">Giá (VNĐ)</label>
            <input v-model="formSP.price" type="number" class="form-control" min="0">
          </div>
          <div class="col-md-2">
            <label class="fw-bold mb-2 text-danger">Kho (Số lượng)</label>
            <input v-model="formSP.tonKho" type="number" class="form-control" min="0">
          </div>
          <div class="col-md-12">
            <label class="fw-bold mb-2">Hình ảnh</label>
            <div class="d-flex gap-2">
              <input type="text" v-model="formSP.img" class="form-control" placeholder="Link ảnh (Tùy chọn)">
              <input type="file" @change="handleFileUpload" accept="image/*" class="form-control w-50">
            </div>
          </div>
        </div>
        <div class="mt-4">
          <button @click="luuSanPham" class="btn btn-primary fw-bold me-2">Lưu Sản phẩm</button>
          <button @click="huyFormSP" class="btn btn-secondary fw-bold">Quay lại</button>
        </div>
      </div>

      <table v-else class="table table-hover shadow-sm bg-white rounded">
        <thead class="table-primary">
          <tr><th>ID</th><th>Tên món</th><th>Danh mục</th><th>Ảnh</th><th>Giá</th><th>Tồn kho</th><th class="text-center">Hành động</th></tr>
        </thead>
        <tbody>
          <tr v-for="sp in adminSanPhams" :key="sp.id">
            <td>{{ sp.id }}</td>
            <td class="fw-bold">{{ sp.name }}</td>
            <td><span class="badge bg-dark text-white">{{ dsDanhMuc.find(d => d.id === sp.category)?.name || 'Khác' }}</span></td>
            <td><img :src="sp.img" width="40" height="40" class="rounded border" style="object-fit: cover;"></td>
            <td class="text-danger fw-bold">{{ Number(sp.price).toLocaleString() }}đ</td>
            <td>
              <span v-if="sp.tonKho > 0" class="badge bg-success">Còn {{ sp.tonKho }}</span>
              <span v-else class="badge bg-danger">Hết hàng</span>
            </td>
            <td class="text-center">
              <button @click="suaSanPham(sp)" class="btn btn-sm btn-warning me-2 fw-bold">Sửa</button>
              <button @click="xoaSanPham(sp.id)" class="btn btn-sm btn-danger fw-bold">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="adminTab === 'khach-hang'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">{{ showDetailKH ? 'Chi tiết Khách Hàng' : 'Danh sách Tài khoản Khách' }}</h4>
      </div>
      
      <div v-if="showDetailKH" class="card p-4 shadow-sm bg-white border-0">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="fw-bold mb-2">ID Tài khoản</label>
            <input :value="selectedKH.id" class="form-control bg-light" readonly>
          </div>
          <div class="col-md-6">
            <label class="fw-bold mb-2">Tên tài khoản / Họ tên</label>
            <input :value="selectedKH.user" class="form-control bg-light" readonly>
          </div>
          <div class="col-md-6">
            <label class="fw-bold mb-2">Email</label>
            <input :value="selectedKH.email" class="form-control bg-light" readonly>
          </div>
          <div class="col-md-6">
            <label class="fw-bold mb-2">Số điện thoại</label>
            <input :value="selectedKH.phone || 'Chưa cập nhật'" class="form-control bg-light" readonly>
          </div>
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
        <thead class="table-primary">
          <tr>
            <th>ID</th>
            <th>Tài khoản</th>
            <th>Email</th>
            <th>SĐT</th>
            <th class="text-center">Trạng thái</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="kh in registeredUsers" :key="kh.id">
            <td>{{ kh.id }}</td>
            <td class="fw-bold">{{ kh.user }}</td>
            <td>{{ kh.email }}</td>
            <td>{{ kh.phone || 'Chưa cập nhật' }}</td>
            <td class="text-center">
              <span v-if="kh.isBlacklisted" class="badge bg-danger">Đã khóa</span>
              <span v-else class="badge bg-success">Hoạt động</span>
            </td>
            <td class="text-center">
              <button @click="xemKhachHang(kh)" class="btn btn-sm btn-info text-white fw-bold me-2">Chi tiết</button>
              <button v-if="!kh.isBlacklisted" @click="toggleBlacklist(kh)" class="btn btn-sm btn-outline-danger fw-bold" title="Khóa tài khoản">Khóa</button>
              <button v-else @click="toggleBlacklist(kh)" class="btn btn-sm btn-success fw-bold" title="Mở khóa tài khoản">Mở khóa</button>
            </td>
          </tr>
          <tr v-if="registeredUsers.length === 0">
            <td colspan="6" class="text-center text-muted py-3">Chưa có người dùng nào đăng ký.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="adminTab === 'hoa-don'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">{{ showFormHD ? 'Form Hóa Đơn' : 'Lịch sử Hóa đơn' }}</h4>
        <button v-if="!showFormHD" @click="showFormHD = true" class="btn btn-primary fw-bold">+ Tạo Hóa Đơn</button>
      </div>
      <div v-if="showFormHD" class="card p-4 shadow-sm bg-white border-0">
        <div class="row g-3"><div class="col-md-3"><label class="fw-bold">Ngày tạo</label><input v-model="formHD.ngay" type="date" class="form-control"></div><div class="col-md-3"><label class="fw-bold">Khách</label><input v-model="formHD.khach" class="form-control"></div><div class="col-md-3"><label class="fw-bold">Tổng tiền</label><input v-model="formHD.tong" type="number" class="form-control"></div><div class="col-md-3"><label class="fw-bold">Khách trả</label><input v-model="formHD.tra" type="number" class="form-control"></div></div>
        <div class="mt-4"><button @click="luuHoaDon" class="btn btn-primary fw-bold me-2">Lưu lại</button><button @click="huyFormHD" class="btn btn-secondary fw-bold">Quay lại</button></div>
      </div>
      <table v-else class="table table-hover shadow-sm bg-white rounded">
        <thead class="table-primary"><tr><th>Mã HĐ</th><th>Ngày tạo</th><th>Khách hàng</th><th>Tổng cộng</th><th>Khách đưa</th><th class="text-center">Hành động</th></tr></thead>
        <tbody><tr v-for="hd in dsHoaDon" :key="hd.id"><td class="fw-bold">{{ hd.id }}</td><td>{{ hd.ngay }}</td><td>{{ hd.khach }}</td><td class="text-danger fw-bold">{{ Number(hd.tong).toLocaleString() }}đ</td><td class="text-success">{{ Number(hd.tra).toLocaleString() }}đ</td><td class="text-center"><button @click="suaHoaDon(hd)" class="btn btn-sm btn-warning me-2">Sửa</button><button @click="xoaHoaDon(hd.id)" class="btn btn-sm btn-danger">Xóa</button></td></tr></tbody>
      </table>
    </div>

  </div>
</template>