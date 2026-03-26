<script setup>
import { 
  adminTab,
  adminSanPhams, showFormSP, isEditSP, formSP, luuSanPham, xoaSanPham, suaSanPham, huyFormSP,
  dsKhachHang, showFormKH, isEditKH, formKH, luuKhachHang, xoaKhachHang, suaKhachHang, huyFormKH,
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
    <div v-if="adminTab === 'san-pham'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0">Danh sách Đồ uống</h4>
        <button v-if="!showFormSP" @click="showFormSP = true" class="btn btn-primary">+ Thêm Món Mới</button>
      </div>

      <div v-if="showFormSP" class="card p-3 mb-4 shadow-sm border-primary bg-white">
        <h5 class="text-primary">{{ isEditSP ? 'Sửa món' : 'Thêm món mới' }}</h5>
        <div class="row g-3">
          <div class="col-md-3">
            <label class="fw-bold">Tên món</label>
            <input v-model="formSP.name" class="form-control" placeholder="Tên đồ uống...">
          </div>
          <div class="col-md-3">
            <label class="fw-bold">Danh mục</label>
            <select v-model="formSP.category" class="form-select">
              <option value="tra-sua">Trà Sữa</option>
              <option value="cafe">Cafe</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="fw-bold">Giá (VNĐ)</label>
            <input v-model="formSP.price" type="number" class="form-control">
          </div>
          <div class="col-md-4">
            <label class="fw-bold">Hình ảnh</label>
            <input type="text" v-model="formSP.img" class="form-control mb-2" placeholder="Link ảnh (Tùy chọn)">
            <input type="file" @change="handleFileUpload" accept="image/*" class="form-control form-control-sm">
          </div>
        </div>
        <div class="mt-3">
          <button @click="luuSanPham" class="btn btn-primary me-2">Lưu lại</button>
          <button @click="huyFormSP" class="btn btn-secondary">Hủy</button>
        </div>
      </div>

      <table class="table table-hover shadow-sm bg-white">
        <thead class="table-primary">
          <tr><th>ID</th><th>Tên món</th><th>Danh mục</th><th>Ảnh</th><th>Giá</th><th class="text-center">Hành động</th></tr>
        </thead>
        <tbody>
          <tr v-for="sp in adminSanPhams" :key="sp.id">
            <td>{{ sp.id }}</td>
            <td class="fw-bold">{{ sp.name }}</td>
            <td><span class="badge bg-info text-dark">{{ sp.category === 'tra-sua' ? 'Trà Sữa' : 'Cafe' }}</span></td>
            <td><img :src="sp.img" width="40" height="40" class="rounded border" style="object-fit: cover;"></td>
            <td class="text-danger fw-bold">{{ Number(sp.price).toLocaleString() }}đ</td>
            <td class="text-center">
              <button @click="suaSanPham(sp)" class="btn btn-sm btn-warning me-2">Sửa</button>
              <button @click="xoaSanPham(sp.id)" class="btn btn-sm btn-danger">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="adminTab === 'khach-hang'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0">Quản lý Khách hàng</h4>
        <button v-if="!showFormKH" @click="showFormKH = true" class="btn btn-primary">+ Thêm Khách Hàng</button>
      </div>

      <div v-if="showFormKH" class="card p-3 mb-4 shadow-sm border-primary bg-white">
        <h5 class="text-primary">{{ isEditKH ? 'Sửa thông tin khách' : 'Thêm khách hàng' }}</h5>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="fw-bold">Tên khách hàng</label>
            <input v-model="formKH.name" class="form-control" placeholder="Nhập tên...">
          </div>
          <div class="col-md-6">
            <label class="fw-bold">Khách quen?</label>
            <select v-model="formKH.laKhachQuen" class="form-select">
              <option value="Có">Có</option>
              <option value="Không">Không</option>
            </select>
          </div>
        </div>
        <div class="mt-3">
          <button @click="luuKhachHang" class="btn btn-primary me-2">Lưu lại</button>
          <button @click="huyFormKH" class="btn btn-secondary">Hủy</button>
        </div>
      </div>

      <table class="table table-hover shadow-sm bg-white">
        <thead class="table-primary">
          <tr><th>ID</th><th>Tên Khách</th><th>Khách Quen</th><th class="text-center">Hành động</th></tr>
        </thead>
        <tbody>
          <tr v-for="kh in dsKhachHang" :key="kh.id">
            <td>{{ kh.id }}</td>
            <td class="fw-bold">{{ kh.name }}</td>
            <td><span :class="['badge', kh.laKhachQuen === 'Có' ? 'bg-success' : 'bg-secondary']">{{ kh.laKhachQuen }}</span></td>
            <td class="text-center">
              <button @click="suaKhachHang(kh)" class="btn btn-sm btn-warning me-2">Sửa</button>
              <button @click="xoaKhachHang(kh.id)" class="btn btn-sm btn-danger">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="adminTab === 'hoa-don'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0">Lịch sử Hóa đơn</h4>
        <button v-if="!showFormHD" @click="showFormHD = true" class="btn btn-primary">+ Tạo Hóa Đơn</button>
      </div>

      <div v-if="showFormHD" class="card p-3 mb-4 shadow-sm border-primary bg-white">
        <h5 class="text-primary">{{ isEditHD ? 'Sửa hóa đơn' : 'Tạo hóa đơn' }}</h5>
        <div class="row g-3">
          <div class="col-md-3">
            <label class="fw-bold">Ngày tạo</label>
            <input v-model="formHD.ngay" type="date" class="form-control">
          </div>
          <div class="col-md-3">
            <label class="fw-bold">Tên khách (hoặc 'Khách lẻ')</label>
            <input v-model="formHD.khach" class="form-control" placeholder="Tên khách...">
          </div>
          <div class="col-md-3">
            <label class="fw-bold">Tổng tiền (VNĐ)</label>
            <input v-model="formHD.tong" type="number" class="form-control">
          </div>
          <div class="col-md-3">
            <label class="fw-bold">Khách trả (VNĐ)</label>
            <input v-model="formHD.tra" type="number" class="form-control">
          </div>
        </div>
        <div class="mt-3">
          <button @click="luuHoaDon" class="btn btn-primary me-2">Lưu lại</button>
          <button @click="huyFormHD" class="btn btn-secondary">Hủy</button>
        </div>
      </div>

      <table class="table table-hover shadow-sm bg-white">
        <thead class="table-primary">
          <tr><th>Mã HĐ</th><th>Ngày tạo</th><th>Khách hàng</th><th>Tổng cộng</th><th>Khách đưa</th><th class="text-center">Hành động</th></tr>
        </thead>
        <tbody>
          <tr v-for="hd in dsHoaDon" :key="hd.id">
            <td class="fw-bold">{{ hd.id }}</td>
            <td>{{ hd.ngay }}</td>
            <td>{{ hd.khach }}</td>
            <td class="text-danger fw-bold">{{ Number(hd.tong).toLocaleString() }}đ</td>
            <td class="text-success">{{ Number(hd.tra).toLocaleString() }}đ</td>
            <td class="text-center">
              <button @click="suaHoaDon(hd)" class="btn btn-sm btn-warning me-2">Sửa</button>
              <button @click="xoaHoaDon(hd.id)" class="btn btn-sm btn-danger">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>