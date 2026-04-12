<script setup>
import { computed, ref } from 'vue'
import { 
  adminTab, dsDanhMuc, showFormDM, isEditDM, formDM, luuDanhMuc, xoaDanhMuc, suaDanhMuc, huyFormDM,
  adminSanPhams, showFormSP, isEditSP, formSP, luuSanPham, xoaSanPham, suaSanPham, huyFormSP,
  registeredUsers, showDetailKH, selectedKH, xemKhachHang, dongChiTietKH, toggleBlacklist, searchKhachHang, filteredKhachHang, capNhatLoaiKhach,
  dsHoaDon, layDuLieuHoaDon, showDetailHD, selectedHD, xemHoaDon, dongChiTietHD, capNhatTrangThaiHoaDon,
  dsMaGiamGia, showFormMGG, isEditMGG, formMGG, luuMaGiamGia, xoaMaGiamGia, suaMaGiamGia, huyFormMGG
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

// --- HÀM MỚI THÊM: CHẶN LÙI TRẠNG THÁI TRÊN GIAO DIỆN ---
const isStatusDisabled = (currentStatus, targetStatus) => {
  if (currentStatus === 'Hoàn thành' || currentStatus === 'Đã hủy') return true;
  if (currentStatus === targetStatus) return false;
  if (targetStatus === 'Đã hủy') return false;

  const order = ['Chờ xác nhận', 'Đang làm', 'Đang giao', 'Hoàn thành'];
  const currentIndex = order.indexOf(currentStatus);
  const targetIndex = order.indexOf(targetStatus);

  return targetIndex <= currentIndex;
};

// ==========================================
// THỐNG KÊ (Biểu đồ, Lọc Ngày/Tháng/Năm, Lọc Đồ Uống)
// ==========================================
const loaiThoiGian = ref('all') // 'all', 'ngay', 'thang', 'nam'
const thongKeDate = ref('')
const thongKeMonth = ref('')
const thongKeYear = ref(new Date().getFullYear())
const thongKeDrink = ref('')
const hienThiBieuDo = ref(false)

const chartIndex = ref(0)
const listCharts = [
  { id: 'sp', name: 'Biểu đồ Top Sản Phẩm Bán Chạy' },
  { id: 'dm', name: 'Biểu đồ Danh Mục Bán Chạy' }
]

// Hàm tách chuỗi "DD/MM/YYYY HH:mm" thành các con số Toán học
const parseDateFromMock = (dateStr) => {
  if (!dateStr) return { d: 0, m: 0, y: 0 };
  const parts = dateStr.split(' ');
  const datePart = parts[0];
  if (!datePart) return { d: 0, m: 0, y: 0 };
  const [d, m, y] = datePart.split('/');
  return { d: Number(d), m: Number(m), y: Number(y) };
}

// Lọc Đơn Hàng Hoàn Thành chuẩn xác 100% bằng số liệu
const donHangHoanThanhFilterDate = computed(() => {
  let list = dsHoaDon.value.filter(hd => hd.trangThai === 'Hoàn thành')

  if (loaiThoiGian.value === 'ngay' && thongKeDate.value) {
    const [selY, selM, selD] = thongKeDate.value.split('-')
    list = list.filter(hd => {
      const { d, m, y } = parseDateFromMock(hd.ngay)
      return d === Number(selD) && m === Number(selM) && y === Number(selY)
    })
  }
  else if (loaiThoiGian.value === 'thang' && thongKeMonth.value) {
    const [selY, selM] = thongKeMonth.value.split('-')
    list = list.filter(hd => {
      const { m, y } = parseDateFromMock(hd.ngay)
      return m === Number(selM) && y === Number(selY)
    })
  }
  else if (loaiThoiGian.value === 'nam' && thongKeYear.value) {
    list = list.filter(hd => {
      const { y } = parseDateFromMock(hd.ngay)
      return y === Number(thongKeYear.value)
    })
  }

  return list
})

// Tính Doanh Thu
const doanhThuTongTien = computed(() => {
  if (thongKeDrink.value) {
    return donHangHoanThanhFilterDate.value.reduce((sum, hd) => {
      let tienMon = 0
      if (hd.danhSachMon) {
        hd.danhSachMon.forEach(mon => {
          if (String(mon.id) === String(thongKeDrink.value)) tienMon += (mon.price * mon.quantity)
        })
      }
      return sum + tienMon
    }, 0)
  }
  return donHangHoanThanhFilterDate.value.reduce((sum, hd) => sum + Number(hd.tong), 0)
})

// Lịch sử Đồ uống
const dsGiaoDichDoUong = computed(() => {
  if (!thongKeDrink.value) return []
  const result = []
  donHangHoanThanhFilterDate.value.forEach(hd => {
    if (hd.danhSachMon) {
      const monFound = hd.danhSachMon.find(m => String(m.id) === String(thongKeDrink.value))
      if (monFound) {
        result.push({
          hdId: hd.id,
          ngay: hd.ngay,
          khach: hd.khach,
          quantity: monFound.quantity,
          total: monFound.price * monFound.quantity
        })
      }
    }
  })
  return result
})

// Thống kê Sản Phẩm
const thongKeSanPham = computed(() => {
  const thongKe = {}
  donHangHoanThanhFilterDate.value.forEach(hd => {
    if (hd.danhSachMon) {
      hd.danhSachMon.forEach(mon => {
        if (!thongKe[mon.id]) {
          const spGoc = adminSanPhams.value.find(s => String(s.id) === String(mon.id))
          thongKe[mon.id] = { id: mon.id, name: spGoc ? spGoc.name : mon.name.split(' (')[0], img: mon.img, daBan: 0, doanhThu: 0 }
        }
        thongKe[mon.id].daBan += mon.quantity
        thongKe[mon.id].doanhThu += (mon.price * mon.quantity)
      })
    }
  })
  return Object.values(thongKe).sort((a, b) => b.daBan - a.daBan)
})

// Thống kê Danh mục
const thongKeDanhMuc = computed(() => {
  const thongKe = {}
  donHangHoanThanhFilterDate.value.forEach(hd => {
    if (hd.danhSachMon) {
      hd.danhSachMon.forEach(mon => {
        const spGoc = adminSanPhams.value.find(s => String(s.id) === String(mon.id))
        const catId = spGoc ? spGoc.category : 'Khác'
        if (!thongKe[catId]) {
          const dmObj = dsDanhMuc.value.find(d => String(d.id) === String(catId))
          thongKe[catId] = { name: dmObj ? dmObj.name : 'Khác', daBan: 0 }
        }
        thongKe[catId].daBan += mon.quantity
      })
    }
  })
  return Object.values(thongKe).sort((a, b) => b.daBan - a.daBan)
})

// LOGIC VẼ LƯỚI CHO BIỂU ĐỒ (Cách nhau 5 ly)
const getChartMax = (maxValue) => {
  if (!maxValue || maxValue < 5) return 5;
  return Math.ceil(maxValue / 5) * 5;
}
const getGridSteps = (maxValue) => {
  const max = getChartMax(maxValue);
  const steps = []
  for (let i = 5; i <= max; i += 5) {
    steps.push(i)
  }
  return steps
}

const nextChart = () => { chartIndex.value = (chartIndex.value + 1) % listCharts.length }
const prevChart = () => { chartIndex.value = (chartIndex.value - 1 + listCharts.length) % listCharts.length }
const goFirstChart = () => { chartIndex.value = 0 }
const goLastChart = () => { chartIndex.value = listCharts.length - 1 }

// --- KHÁCH HÀNG ---
const khachHangFilter = ref('all')
const sortTopChiTieu = ref(false)
const danhSachKhachHangHienThi = computed(() => {
  let list = filteredKhachHang.value
  if (khachHangFilter.value === 'VIP') list = list.filter(kh => kh.loaiKhach === 'VIP')
  if (khachHangFilter.value === 'Quen') list = list.filter(kh => kh.loaiKhach === 'Quen')
  if (sortTopChiTieu.value) list = [...list].sort((a, b) => (b.tongChiTieu || 0) - (a.tongChiTieu || 0))
  return list
})
</script>

<template>
  <div>
    <div v-if="adminTab === 'thong-ke'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">📊 Thống kê & Báo cáo</h4>
        <button @click="hienThiBieuDo = !hienThiBieuDo" :class="['btn fw-bold px-4 shadow-sm', hienThiBieuDo ? 'btn-secondary' : 'btn-primary']">
          {{ hienThiBieuDo ? '📄 Quay lại Bảng' : '📈 Xem Biểu Đồ' }}
        </button>
      </div>

      <div class="row mb-4 bg-white p-3 shadow-sm rounded border border-info mx-1">
        <div class="col-md-7">
          <label class="fw-bold text-info mb-2">Tra cứu Doanh thu theo:</label>
          <div class="d-flex gap-2">
            <select v-model="loaiThoiGian" class="form-select border-info fw-bold text-info shadow-sm" style="width: 190px;">
              <option value="all">Tất cả thời gian</option>
              <option value="ngay">Chỉ chọn Ngày</option>
              <option value="thang">Chỉ chọn Tháng/Năm</option>
              <option value="nam">Chỉ chọn Năm</option>
            </select>
            <input v-if="loaiThoiGian === 'ngay'" type="date" v-model="thongKeDate" class="form-control border-info shadow-sm">
            <input v-if="loaiThoiGian === 'thang'" type="month" v-model="thongKeMonth" class="form-control border-info shadow-sm">
            <select v-if="loaiThoiGian === 'nam'" v-model="thongKeYear" class="form-select border-info shadow-sm">
              <option v-for="y in [2024, 2025, 2026, 2027, 2028]" :key="y" :value="y">Năm {{ y }}</option>
            </select>
          </div>
        </div>
        <div class="col-md-5 border-start">
          <label class="fw-bold text-warning mb-2">Tra cứu Lịch sử Đồ Uống:</label>
          <select v-model="thongKeDrink" class="form-select border-warning shadow-sm">
            <option value="">-- Tất cả đồ uống --</option>
            <option v-for="sp in adminSanPhams" :key="sp.id" :value="sp.id">{{ sp.name }}</option>
          </select>
        </div>
      </div>

      <div class="alert alert-success fw-bold text-center fs-5 shadow-sm border-2">
        <span v-if="thongKeDrink">Tổng doanh thu của Đồ uống đã chọn:</span>
        <span v-else-if="loaiThoiGian === 'ngay' && thongKeDate">Doanh thu chốt ngày {{ thongKeDate }}:</span>
        <span v-else-if="loaiThoiGian === 'thang' && thongKeMonth">Doanh thu chốt tháng {{ thongKeMonth }}:</span>
        <span v-else-if="loaiThoiGian === 'nam' && thongKeYear">Doanh thu chốt cả năm {{ thongKeYear }}:</span>
        <span v-else>Tổng doanh thu Hoàn thành của Toàn hệ thống:</span>
        <br>
        <span class="text-danger fs-1">{{ doanhThuTongTien.toLocaleString() }} VNĐ</span>
      </div>

      <div v-if="hienThiBieuDo" class="card shadow-sm border-0 bg-white p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <h5 class="fw-bold text-primary m-0">📉 {{ listCharts[chartIndex].name }}</h5>
          <select v-model="chartIndex" class="form-select form-select-sm fw-bold border-primary text-primary" style="width: 250px;">
            <option v-for="(chart, index) in listCharts" :key="index" :value="index">{{ chart.name }}</option>
          </select>
        </div>

        <div v-if="chartIndex === 0" class="chart-container custom-scrollbar pb-2" style="overflow-x: auto; padding-left: 45px; padding-right: 20px;">
          <div class="d-flex align-items-end justify-content-start position-relative" style="height: 300px; min-width: max-content; gap: 30px; padding-top: 20px; border-bottom: 2px solid #6c757d; border-left: 2px solid #6c757d;">
            
            <div v-for="step in getGridSteps(thongKeSanPham[0]?.daBan || 0)" :key="step" 
                 class="position-absolute w-100" 
                 :style="{ bottom: (step / getChartMax(thongKeSanPham[0]?.daBan || 0) * 230) + 'px', left: 0, borderTop: '1px dashed #adb5bd', zIndex: 0 }">
               <span class="position-absolute text-muted small fw-bold" style="left: -38px; top: -10px;">{{ step }} ly</span>
            </div>

            <div v-for="sp in thongKeSanPham.slice(0, 15)" :key="sp.id" class="d-flex flex-column align-items-center" style="width: 80px; z-index: 1; margin-left: 10px;">
              <span class="small fw-bold text-danger mb-1 bg-white px-2 rounded shadow-sm">{{ sp.daBan }}</span>
              <div class="bg-warning w-100 rounded-top shadow-sm transition-bar" 
                   :style="{ height: (sp.daBan / getChartMax(thongKeSanPham[0]?.daBan || 0) * 230) + 'px' }"
                   :title="'Doanh thu: ' + sp.doanhThu.toLocaleString() + 'đ'"></div>
              <span class="small text-truncate w-100 text-center mt-2 fw-bold" :title="sp.name">{{ sp.name }}</span>
            </div>
            
            <div v-if="thongKeSanPham.length === 0" class="w-100 text-center text-muted position-absolute" style="bottom: 10px;">Không có dữ liệu trong thời gian này.</div>
          </div>
        </div>

        <div v-if="chartIndex === 1" class="chart-container custom-scrollbar pb-2" style="overflow-x: auto; padding-left: 45px; padding-right: 20px;">
          <div class="d-flex align-items-end justify-content-start position-relative" style="height: 300px; min-width: max-content; gap: 40px; padding-top: 20px; border-bottom: 2px solid #6c757d; border-left: 2px solid #6c757d;">
            
            <div v-for="step in getGridSteps(thongKeDanhMuc[0]?.daBan || 0)" :key="step" 
                 class="position-absolute w-100" 
                 :style="{ bottom: (step / getChartMax(thongKeDanhMuc[0]?.daBan || 0) * 230) + 'px', left: 0, borderTop: '1px dashed #adb5bd', zIndex: 0 }">
               <span class="position-absolute text-muted small fw-bold" style="left: -38px; top: -10px;">{{ step }} ly</span>
            </div>

            <div v-for="dm in thongKeDanhMuc" :key="dm.name" class="d-flex flex-column align-items-center" style="width: 120px; z-index: 1; margin-left: 20px;">
              <span class="small fw-bold text-primary mb-1 bg-white px-2 rounded shadow-sm">{{ dm.daBan }}</span>
              <div class="bg-info w-100 rounded-top shadow-sm transition-bar" 
                   :style="{ height: (dm.daBan / getChartMax(thongKeDanhMuc[0]?.daBan || 0) * 230) + 'px' }"></div>
              <span class="small w-100 text-center mt-2 fw-bold text-wrap">{{ dm.name }}</span>
            </div>

            <div v-if="thongKeDanhMuc.length === 0" class="w-100 text-center text-muted position-absolute" style="bottom: 10px;">Không có dữ liệu trong thời gian này.</div>
          </div>
        </div>

        <div class="d-flex justify-content-center mt-5 gap-2">
          <button @click="goFirstChart" class="btn btn-sm btn-outline-dark fw-bold">|◄ Đầu</button>
          <button @click="prevChart" class="btn btn-sm btn-outline-dark fw-bold">◄ Trước</button>
          <button @click="nextChart" class="btn btn-sm btn-outline-dark fw-bold">Tiếp ►</button>
          <button @click="goLastChart" class="btn btn-sm btn-outline-dark fw-bold">Cuối ►|</button>
        </div>
      </div>

      <div v-if="!hienThiBieuDo" class="card shadow-sm border-0 bg-white">
        
        <table v-if="!thongKeDrink" class="table table-hover align-middle mb-0">
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
              <td class="text-center"><span class="badge bg-success fs-6">{{ sp.daBan }}</span></td>
              <td class="text-end pe-4 text-primary fw-bold">{{ sp.doanhThu.toLocaleString() }}đ</td>
            </tr>
            <tr v-if="thongKeSanPham.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">Không có sản phẩm nào được bán trong khoảng thời gian này.</td>
            </tr>
          </tbody>
        </table>

        <div v-else>
          <h5 class="fw-bold text-warning p-3 m-0 border-bottom">📝 Lịch sử Giao dịch chi tiết của Đồ uống</h5>
          <table class="table table-hover align-middle mb-0 text-center">
            <thead class="table-warning text-dark">
               <tr>
                <th>Mã Đơn Hàng</th>
                <th>Thời gian bán</th>
                <th>Khách Hàng</th>
                <th>Số lượng mua</th>
                <th>Tổng tiền trả</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="gd in dsGiaoDichDoUong" :key="gd.hdId">
                <td class="fw-bold text-primary">#{{ gd.hdId }}</td>
                <td class="text-muted">{{ gd.ngay }}</td>
                <td class="fw-bold">{{ gd.khach }}</td>
                <td><span class="badge bg-dark fs-6">{{ gd.quantity }}</span></td>
                <td class="text-danger fw-bold">{{ gd.total.toLocaleString() }}đ</td>
              </tr>
              <tr v-if="dsGiaoDichDoUong.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">Chưa có ai mua đồ uống này (trong thời gian đã chọn).</td>
              </tr>
            </tbody>
          </table>
        </div>
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
        <h4 class="m-0 text-primary fw-bold">{{ showDetailKH ? 'Chi tiết Khách Hàng' : 'Danh sách Khách Hàng' }}</h4>
        <div v-if="!showDetailKH" class="d-flex gap-2 align-items-center">
          <button @click="khachHangFilter = 'all'; sortTopChiTieu = false" :class="['btn btn-sm fw-bold', khachHangFilter === 'all' && !sortTopChiTieu ? 'btn-dark' : 'btn-outline-dark']">Tất cả</button>
          <button @click="khachHangFilter = 'VIP'; sortTopChiTieu = false" class="btn btn-sm btn-outline-warning fw-bold text-dark" style="background: gold;">Chỉ VIP</button>
          <button @click="khachHangFilter = 'Quen'; sortTopChiTieu = false" class="btn btn-sm btn-secondary fw-bold text-white">Chỉ Khách Quen</button>
          <button @click="sortTopChiTieu = true" :class="['btn btn-sm fw-bold text-white', sortTopChiTieu ? 'btn-danger' : 'btn-outline-danger text-danger']">🏆 Top Chi Tiêu</button>
          
          <div class="input-group shadow-sm ms-3" style="max-width: 250px;">
            <span class="input-group-text bg-white border-primary text-primary">🔍</span>
            <input v-model="searchKhachHang" type="text" class="form-control border-primary" placeholder="Tìm theo Tên, SĐT...">
            <button v-if="searchKhachHang" @click="searchKhachHang = ''" class="btn btn-outline-danger border-primary border-start-0" title="Xóa tìm kiếm">✖</button>
          </div>
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

      <table v-else class="table shadow-sm align-middle bg-white text-center custom-admin-table" style="border-collapse: separate; border-spacing: 0 10px;">
        <thead class="table-primary">
          <tr>
            <th>Tài khoản</th>
            <th>SĐT</th>
            <th>Loại Khách</th>
            <th>Tổng Chi Tiêu</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="kh in danhSachKhachHangHienThi" :key="kh.id" 
              :class="{
                'row-vip': kh.loaiKhach === 'VIP', 
                'row-quen': kh.loaiKhach === 'Quen', 
                'row-thuong': kh.loaiKhach === 'Thường' || !kh.loaiKhach
              }">
            <td class="fw-bold text-start ps-3">{{ kh.user }}</td>
            <td>{{ kh.phone || 'Chưa cập nhật' }}</td>
            <td>
              <select :value="kh.loaiKhach || 'Thường'" @change="capNhatLoaiKhach(kh.id, $event.target.value)" 
                :class="['form-select form-select-sm fw-bold text-center border-0 shadow-sm', 
                  kh.loaiKhach === 'VIP' ? 'bg-warning text-dark' : 
                  kh.loaiKhach === 'Quen' ? 'bg-secondary text-white' : 'bg-light']"
                style="width: 130px; margin: 0 auto;"
              >
                <option value="Thường">Thường</option>
                <option value="Quen">Khách Quen</option>
                <option value="VIP">Khách VIP</option>
              </select>
            </td>
            <td class="text-danger fw-bold">{{ (kh.tongChiTieu || 0).toLocaleString() }}đ</td>
            <td><span v-if="kh.isBlacklisted" class="badge bg-danger">Đã khóa</span><span v-else class="badge bg-success">Hoạt động</span></td>
            <td>
              <button @click="xemKhachHang(kh)" class="btn btn-sm btn-info text-white fw-bold me-2">Chi tiết</button>
              <button @click="toggleBlacklist(kh)" :class="['btn btn-sm fw-bold', kh.isBlacklisted ? 'btn-success' : 'btn-outline-danger']">
                {{ kh.isBlacklisted ? 'Mở Khóa' : 'Khóa' }}
              </button>
            </td>
          </tr>
          <tr v-if="danhSachKhachHangHienThi.length === 0">
            <td colspan="6" class="text-center py-5 text-muted">Không có tài khoản nào khớp với bộ lọc.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="adminTab === 'ma-giam-gia'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">{{ showFormMGG ? (isEditMGG ? 'Sửa Mã' : 'Thêm Mã Mới') : 'Quản lý Mã Giảm Giá' }}</h4>
        <button v-if="!showFormMGG" @click="showFormMGG = true" class="btn btn-primary fw-bold">+ Tạo Mã Giảm Giá</button>
      </div>
      <div v-if="showFormMGG" class="card p-4 shadow-sm bg-white border-0">
        <div class="row g-3">
          <div class="col-md-4"><label class="fw-bold mb-2">Mã Code (Tên mã)</label><input v-model="formMGG.code" class="form-control text-uppercase" placeholder="Ví dụ: FREESHIP"></div>
          <div class="col-md-4"><label class="fw-bold mb-2">Số tiền giảm (VNĐ)</label><input v-model="formMGG.giamGia" type="number" class="form-control" min="0"></div>
          <div class="col-md-4">
            <label class="fw-bold mb-2">Trạng thái</label>
            <select v-model="formMGG.isActive" class="form-select">
              <option :value="true">Đang kích hoạt</option>
              <option :value="false">Vô hiệu hóa</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button @click="luuMaGiamGia" class="btn btn-primary fw-bold me-2">Lưu Mã</button>
          <button @click="huyFormMGG" class="btn btn-secondary fw-bold">Quay lại</button>
        </div>
      </div>
      <table v-else class="table table-hover shadow-sm bg-white rounded text-center align-middle">
        <thead class="table-primary"><tr><th>ID</th><th>Mã Code</th><th>Số tiền giảm</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
        <tbody>
          <tr v-for="m in dsMaGiamGia" :key="m.id">
            <td>{{ m.id }}</td>
            <td class="fw-bold text-danger">{{ m.code }}</td>
            <td class="fw-bold">{{ Number(m.giamGia).toLocaleString() }}đ</td>
            <td><span :class="m.isActive ? 'badge bg-success' : 'badge bg-secondary'">{{ m.isActive ? 'Kích hoạt' : 'Đã tắt' }}</span></td>
            <td>
              <button @click="suaMaGiamGia(m)" class="btn btn-sm btn-warning me-2 fw-bold">Sửa</button>
              <button @click="xoaMaGiamGia(m.id)" class="btn btn-sm btn-danger fw-bold">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="adminTab === 'hoa-don'">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="m-0 text-primary fw-bold">{{ showDetailHD ? 'Chi tiết Đơn Hàng' : 'Theo dõi Đơn Hàng' }}</h4>
        <div>
          <button v-if="!showDetailHD" @click="layDuLieuHoaDon" class="btn btn-outline-primary fw-bold">🔄 Làm mới</button>
        </div>
      </div>

      <div v-if="showDetailHD" class="card p-4 shadow-sm bg-white border-0">
        <div class="row g-3">
          <div class="col-md-4"><label class="fw-bold mb-2">Mã đơn hàng</label><input :value="'#' + selectedHD.id" class="form-control bg-light text-primary fw-bold" readonly></div>
          <div class="col-md-4"><label class="fw-bold mb-2">Thời gian mua</label><input :value="selectedHD.ngay" class="form-control bg-light" readonly></div>
          <div class="col-md-4">
            <label class="fw-bold mb-2">Trạng thái</label>
            <select :value="selectedHD.trangThai" @change="handleStatusChange(selectedHD, $event)" 
              class="form-select fw-bold bg-light border-primary text-primary"
              :disabled="selectedHD.trangThai === 'Hoàn thành' || selectedHD.trangThai === 'Đã hủy'"
            >
              <option value="Chờ xác nhận" :disabled="isStatusDisabled(selectedHD.trangThai, 'Chờ xác nhận')">Chờ xác nhận</option>
              <option value="Đang làm" :disabled="isStatusDisabled(selectedHD.trangThai, 'Đang làm')">Đang làm</option>
              <option value="Đang giao" :disabled="isStatusDisabled(selectedHD.trangThai, 'Đang giao')">Đang giao</option>
              <option value="Hoàn thành" :disabled="isStatusDisabled(selectedHD.trangThai, 'Hoàn thành')">Hoàn thành</option>
              <option value="Đã hủy" :disabled="isStatusDisabled(selectedHD.trangThai, 'Đã hủy')">Đã hủy</option>
            </select>
          </div>
          
          <h5 class="mt-4 border-bottom pb-2 fw-bold text-primary">Thông tin Khách hàng & Thanh toán</h5>
          <div class="col-md-3"><label class="fw-bold mb-2">Tên khách</label><input :value="selectedHD.khach" class="form-control bg-light" readonly></div>
          <div class="col-md-3"><label class="fw-bold mb-2">Số điện thoại</label><input :value="selectedHD.sdt || 'Không có'" class="form-control bg-light" readonly></div>
          <div class="col-md-3"><label class="fw-bold mb-2">Hình thức TT</label><input :value="selectedHD.phuongThucThanhToan || 'COD'" class="form-control bg-light fw-bold text-success" readonly></div>
          <div class="col-md-3"><label class="fw-bold mb-2">Mã Giảm Giá</label><input :value="selectedHD.maGiamGia || 'Không có'" class="form-control bg-light" readonly></div>

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
          <div class="col-12 text-end mt-3 border-top pt-3">
            <p class="mb-1">Tiền Ship: +{{ selectedHD.tienShip ? Number(selectedHD.tienShip).toLocaleString() : '30,000' }}đ</p>
            <p class="mb-1 text-success">Giảm giá: -{{ selectedHD.tienGiam ? Number(selectedHD.tienGiam).toLocaleString() : '0' }}đ</p>
            <h4 class="fw-bold mt-2">Tổng thanh toán: <span class="text-danger">{{ Number(selectedHD.tong).toLocaleString() }} VNĐ</span></h4>
          </div>
        </div>

        <div class="mt-4 border-top pt-3 d-flex gap-2">
          <button @click="dongChiTietHD" class="btn btn-secondary fw-bold">← Quay lại danh sách</button>
          <button v-if="selectedHD.trangThai !== 'Đã hủy' && selectedHD.trangThai !== 'Hoàn thành'" @click="handleCancelOrder(selectedHD)" class="btn btn-danger fw-bold ms-auto">❌ Hủy đơn hàng này</button>
        </div>
      </div>
      
      <table v-else class="table table-hover shadow-sm bg-white rounded align-middle text-center">
        <thead class="table-primary">
          <tr>
            <th>Mã ĐH</th>
            <th>Thời gian mua</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th style="width: 15%">Trạng thái</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hd in dsHoaDon" :key="hd.id">
            <td class="fw-bold">#{{ hd.id }}</td>
            <td class="small text-muted">{{ hd.ngay }}</td>
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
                <option value="Chờ xác nhận" class="text-dark" :disabled="isStatusDisabled(hd.trangThai, 'Chờ xác nhận')">Chờ xác nhận</option>
                <option value="Đang làm" class="text-dark" :disabled="isStatusDisabled(hd.trangThai, 'Đang làm')">Đang làm</option>
                <option value="Đang giao" class="text-dark" :disabled="isStatusDisabled(hd.trangThai, 'Đang giao')">Đang giao</option>
                <option value="Hoàn thành" class="text-dark" :disabled="isStatusDisabled(hd.trangThai, 'Hoàn thành')">Hoàn thành</option>
                <option value="Đã hủy" class="text-dark" :disabled="isStatusDisabled(hd.trangThai, 'Đã hủy')">Đã hủy</option>
              </select>
            </td>

            <td class="text-center">
              <div class="d-flex gap-2 justify-content-center">
                <button @click="xemHoaDon(hd)" class="btn btn-sm btn-info text-white fw-bold px-3">Chi tiết</button>
              </div>
            </td>
          </tr>
          <tr v-if="dsHoaDon.length === 0"><td colspan="6" class="text-center py-4 text-muted">Chưa có đơn hàng nào trên hệ thống.</td></tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.transition-bar { transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.custom-scrollbar::-webkit-scrollbar { height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d68910; border-radius: 4px; }

.custom-admin-table td { padding: 15px 10px; border: none; vertical-align: middle; }
.row-vip {
  outline: 3px solid #FFD700;
  background-color: #fffae6 !important;
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);
  border-radius: 8px;
}
.row-quen {
  outline: 3px solid #b0bec5 !important;
  background-color: #f8f9fa !important;
  box-shadow: 0 4px 10px rgba(176, 190, 197, 0.4);
  border-radius: 8px;
}
.row-thuong {
  border: 1px solid #e9ecef;
}
</style>