<!-- <script setup>
import { ref, computed } from 'vue'

// --- 1. QUẢN LÝ TRẠNG THÁI MÀN HÌNH & USER ---
const currentView = ref('login')
const adminTab = ref('san-pham') // Tab mặc định cho admin
const username = ref('')
const password = ref('')

// --- 2. QUẢN LÝ GIỎ HÀNG ---
const cart = ref([])

const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }
}

const removeFromCart = (index) => {
  const item = cart.value[index]
  if (item.quantity > 1) {
    item.quantity--
  } else {
    cart.value.splice(index, 1)
  }
}

const handleCheckout = () => {
  if (cart.value.length === 0) return
  alert('Thanh toán thành công! Cảm ơn bạn đã mua hàng.')
  cart.value = []
}

const totalAmount = computed(() => {
  return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const totalItemsInCart = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0)
})

// --- LOGIC ĐĂNG NHẬP ---
const handleLogin = () => {
  if (username.value === 'admin' && password.value === '123') {
    currentView.value = 'admin'
    alert('Đăng nhập thành công quyền ADMIN!')
  } else if (username.value === 'kh123' && password.value === '123') {
    currentView.value = 'client'
    alert('Chào mừng khách hàng thân thiết!')
  } else {
    alert('Sai tên đăng nhập hoặc mật khẩu!')
  }
}

const handleLogout = () => {
  currentView.value = 'login'
  username.value = ''
  password.value = ''
  cart.value = []
}

// --- 3. DỮ LIỆU SẢN PHẨM (DÙNG CHUNG) ---
const cayTrongNha = ref([
  { id: 1, name: "Cây Kim Tiền", price: 150000, img: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/cay_kim_tien_co_doc_khong_7af7c02f67.jpg" },
  { id: 2, name: "Cây Lưỡi Hổ", price: 120000, img: "https://trongcay.vn/upload/news/2023/10/18/image-1697600685cay-luoi-ho-3.jpg" },
  { id: 3, name: "Cây Trầu Bà", price: 90000, img: "https://cdn.eva.vn/upload/3-2022/images/2022-07-15/image3-1657867498-210-width640height640.jpg" },
  { id: 4, name: "Cây Lan Ý", price: 180000, img: "https://cayxanhhuongloc.com.vn/wp-content/uploads/2018/12/cach-trong-va-y-nghia-phong-thuy-it-nguoi-biet-cua-cay-lan-y-01b3d060089e4d20839cad5049cfb384.jpg" },
])

const cayNgoaiTroi = ref([
  { id: 5, name: "Cây Hoa Giấy", price: 300000, img: "https://bizweb.dktcdn.net/100/275/164/files/hoa-giay-2.jpg?v=1700271638513" },
  { id: 6, name: "Cây Tùng Bách", price: 500000, img: "https://vingarden.vn/wp-content/uploads/2018/08/bach-tan-4.jpg" },
  { id: 7, name: "Cây Sứ Thái", price: 250000, img: "https://file.hstatic.net/1000045279/file/cay_20hoa_20su_20thai_20_5__grande.jpg" },
  { id: 8, name: "Cây Hoa Hồng", price: 150000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzmDqj6x7sWDncfbTUNzsJymBQP7u7NuE52g&s" },
])

const chauCay = ref([
  { id: 9, name: "Chậu Gốm Sứ Trắng", price: 50000, img: "https://bizweb.dktcdn.net/100/275/164/products/chau-su.jpg?v=1576396778203" },
  { id: 10, name: "Chậu Đất Nung", price: 30000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ7fSm_voBNbyVn-wZ6Y9Pss16J630hDabOg&s" },
  { id: 11, name: "Chậu Composite", price: 120000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1PNkw9iY-sWxH861hbTA1QtIQ54owFKtVxA&s" },
  { id: 12, name: "Chậu Xi Măng", price: 80000, img: "https://media.loveitopcdn.com/23464/thumb/chau-xi-mang-da-mai-tron-trung-xam.jpg" },
  { id: 13, name: "Chậu Treo Ban Công", price: 45000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimIjSYR2uBvuItskome-KhBuAZBb0db3vg&s" },
  { id: 14, name: "Chậu Gỗ Vintage", price: 95000, img: "https://ironstyle.vn/uploads/chau-go-cam-hoa-size-nho-cao-cap-gia-re-250px_1.jpg" },
  { id: 15, name: "Chậu Thủy Tinh", price: 60000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFgs9jaOteCLRl7W3Hms3fBaE4VqJQM168ZQ&s" },
  { id: 16, name: "Đôn Kê Chậu Cây", price: 200000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOBFi7hhnTqBWUVEVO1jEo59c2IVsfQ_MddQ&s" },
])

// Gộp tất cả sản phẩm để hiển thị trong bảng Admin
const tatCaSanPhams = computed(() => [...cayTrongNha.value, ...cayNgoaiTroi.value, ...chauCay.value])

// --- 4. DỮ LIỆU QUẢN LÝ (DÀNH RIÊNG ADMIN) ---
const dsNhanVien = ref([
  { name: 'Nguyễn Văn A', caLam: 'Sáng', luong: '8.000.000đ' },
  { name: 'Trần Thị B', caLam: 'Chiều', luong: '8.500.000đ' }
])

const dsKhachHang = ref([
  { name: 'Lê Văn Khách', laKhachQuen: 'Có' },
  { name: 'Phạm Thị Thu', laKhachQuen: 'Không' }
])

const dsHoaDon = ref([
  { id: 'HD001', ngay: '2026-01-20', khach: 'Lê Văn Khách', tong: '150.000đ', tra: '150.000đ' }
])

// Form bán hàng tại quầy
const billForm = ref({ customer: '', product: '', total: '', paid: '' })
const handleAdminSale = () => {
  if(!billForm.value.customer || !billForm.value.product) return alert('Vui lòng nhập đủ thông tin!')
  
  // Lưu vào danh sách hóa đơn
  dsHoaDon.value.push({
    id: 'HD' + (dsHoaDon.value.length + 1).toString().padStart(3, '0'),
    ngay: new Date().toISOString().split('T')[0],
    khach: billForm.value.customer,
    tong: billForm.value.total + 'đ',
    tra: billForm.value.paid + 'đ'
  })
  
  // Reset form
  billForm.value = { customer: '', product: '', total: '', paid: '' }
  alert('Đã thanh toán và lưu hóa đơn!')
}

</script>

<template>
  <div v-if="currentView === 'login'" class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px;">
      <h3 class="text-center mb-4 text-success fw-bold">Vườn Cây Việt Login</h3>
      <div class="alert alert-info py-2" style="font-size: 0.9rem">
        <small><b>Khách:</b> kh123 / 123</small><br>
        <small><b>Admin:</b> admin / 123</small>
      </div>
      <div class="mb-3">
        <label class="form-label">Tài khoản</label>
        <input v-model="username" type="text" class="form-control">
      </div>
      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <input v-model="password" type="password" class="form-control">
      </div>
      <button @click="handleLogin" class="btn btn-success w-100 fw-bold">Đăng nhập</button>
    </div>
  </div>

  <div v-if="currentView === 'client'">
    <div class="sticky-top bg-white shadow-sm" style="z-index: 1000;">
      <header class="py-2 border-bottom">
        <div class="container d-flex justify-content-between align-items-center">
          <h3 class="text-success fw-bold m-0 d-flex align-items-center">🌿 Vườn Cây Việt</h3>
          <div class="d-flex align-items-center gap-2">
            <div class="dropdown">
              <button class="btn btn-outline-success position-relative dropdown-toggle" type="button" data-bs-toggle="dropdown">
                🛒 Giỏ hàng <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{{ totalItemsInCart }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end p-3" style="width: 320px; max-height: 400px; overflow-y: auto;">
                <li v-if="cart.length === 0" class="text-center text-muted">Giỏ hàng trống</li>
                <li v-for="(item, index) in cart" :key="index" class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                  <div>
                    <strong>{{ item.name }} <span class="text-success">x{{ item.quantity }}</span></strong><br>
                    <small class="text-danger">{{ (item.price * item.quantity).toLocaleString() }}đ</small>
                  </div>
                  <button @click.stop="removeFromCart(index)" class="btn btn-sm btn-outline-danger rounded-circle" style="width: 25px; height: 25px; padding: 0; line-height: 23px;">&minus;</button>
                </li>
                <li v-if="cart.length > 0" class="mt-2 pt-2 border-top text-center">
                  <strong>Tổng: {{ totalAmount.toLocaleString() }}đ</strong>
                  <button @click="handleCheckout" class="btn btn-success w-100 mt-2 btn-sm">Thanh toán ngay</button>
                </li>
              </ul>
            </div>
            <button @click="handleLogout" class="btn btn-secondary btn-sm">Thoát</button>
          </div>
        </div>
      </header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-success py-1">
        <div class="container">
          <div class="collapse navbar-collapse justify-content-center">
            <ul class="navbar-nav">
              <li class="nav-item"><a class="nav-link fw-bold px-3 text-uppercase" href="#">Trang chủ</a></li>
              <li class="nav-item"><a class="nav-link fw-bold px-3 text-uppercase" href="#cay-trong-nha">Cây trong nhà</a></li>
              <li class="nav-item"><a class="nav-link fw-bold px-3 text-uppercase" href="#cay-ngoai-troi">Cây ngoài trời</a></li>
              <li class="nav-item"><a class="nav-link fw-bold px-3 text-uppercase" href="#chau-cay">Chậu & Phụ kiện</a></li>
              <li class="nav-item"><a class="nav-link fw-bold px-3 text-uppercase" href="#lien-he">Liên hệ</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <div class="position-relative text-center">
      <img src="https://i.ex-cdn.com/danviet.vn/files/content/2025/12/30/025751ngoc-bich-cay-canh-a2-0254.jpg" class="w-100" style="height: 400px; object-fit: cover; opacity: 0.9;">
      <div class="position-absolute top-50 start-50 translate-middle text-white p-4" style="background-color: rgba(0,0,0,0.6); border-radius: 10px;">
        <h1 class="display-4 fw-bold">Vườn Cây Việt</h1>
        <p class="fs-4 fst-italic mb-0">Cho trải nghiệm “không chỉ là cây cảnh”</p>
      </div>
    </div>

    <div class="container my-5">
      <section id="cay-trong-nha" class="mb-5 pt-5" style="scroll-margin-top: 150px;"> 
        <h3 class="text-success border-bottom border-success border-2 pb-2 mb-4">🌱 Cây Trong Nhà</h3>
        <div class="row g-4">
          <div class="col-6 col-md-3" v-for="cay in cayTrongNha" :key="cay.id">
            <div class="card h-100 shadow-sm product-card">
              <img :src="cay.img" class="card-img-top p-2 rounded-4" style="height: 200px; object-fit: cover;">
              <div class="card-body d-flex flex-column text-center">
                <h5 class="card-title fs-6">{{ cay.name }}</h5>
                <p class="card-text text-danger fw-bold flex-grow-1">{{ cay.price.toLocaleString() }}đ</p>
                <button @click="addToCart(cay)" class="btn btn-success w-100">+ Thêm vào giỏ</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cay-ngoai-troi" class="mb-5 pt-5" style="scroll-margin-top: 150px;">
        <h3 class="text-success border-bottom border-success border-2 pb-2 mb-4">☀️ Cây Ngoài Trời</h3>
        <div class="row g-4">
          <div class="col-6 col-md-3" v-for="cay in cayNgoaiTroi" :key="cay.id">
            <div class="card h-100 shadow-sm product-card">
              <img :src="cay.img" class="card-img-top p-2 rounded-4" style="height: 200px; object-fit: cover;">
              <div class="card-body d-flex flex-column text-center">
                <h5 class="card-title fs-6">{{ cay.name }}</h5>
                <p class="card-text text-danger fw-bold flex-grow-1">{{ cay.price.toLocaleString() }}đ</p>
                <button @click="addToCart(cay)" class="btn btn-success w-100">+ Thêm vào giỏ</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="chau-cay" class="mb-5 pt-5" style="scroll-margin-top: 150px;">
        <h3 class="text-success border-bottom border-success border-2 pb-2 mb-4">🏺 Chậu Cây & Phụ Kiện</h3>
        <div class="row g-4">
          <div class="col-6 col-md-3" v-for="chau in chauCay" :key="chau.id">
            <div class="card h-100 shadow-sm product-card">
              <img :src="chau.img" class="card-img-top p-2 rounded-4" style="height: 200px; object-fit: cover;">
              <div class="card-body d-flex flex-column text-center">
                <h5 class="card-title fs-6">{{ chau.name }}</h5>
                <p class="card-text text-danger fw-bold flex-grow-1">{{ chau.price.toLocaleString() }}đ</p>
                <button @click="addToCart(chau)" class="btn btn-success w-100">+ Thêm vào giỏ</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer id="lien-he" class="bg-dark text-white py-5">
      <div class="container text-center">
        <p class="m-0">&copy; 🏠 123 Trịnh Văn Bô, Nam Từ Liêm, Hà Nội /
          📞 0912 345 678 /
          📧 admin@vuoncayviet.com
        </p>
      </div>
    </footer>
  </div>

  <div v-if="currentView === 'admin'" class="admin-layout">
    <header class="admin-header bg-white border-bottom py-2 px-4 d-flex justify-content-between align-items-center sticky-top shadow-sm">
      <h3 class="text-success fw-bold m-0">🌿 Vườn Cây Việt - Quản Trị</h3>
      <button @click="handleLogout" class="btn btn-sm btn-outline-danger">Đăng xuất</button>
    </header>

    <div class="d-flex" style="min-height: calc(100vh - 56px);">
      <aside class="sidebar bg-dark text-white p-3 shadow" style="width: 250px;">
        <ul class="nav flex-column gap-2 mt-2">
          <li class="nav-item">
            <button @click="adminTab = 'san-pham'" :class="['btn w-100 text-start text-white', adminTab === 'san-pham' ? 'btn-success' : '']">📦 Quản lý sản phẩm</button>
          </li>
          <li class="nav-item">
            <button @click="adminTab = 'hoa-don'" :class="['btn w-100 text-start text-white', adminTab === 'hoa-don' ? 'btn-success' : '']">📑 Quản lý hoá đơn</button>
          </li>
          <li class="nav-item">
            <button @click="adminTab = 'khach-hang'" :class="['btn w-100 text-start text-white', adminTab === 'khach-hang' ? 'btn-success' : '']">👥 Quản lý khách hàng</button>
          </li>
          <li class="nav-item">
            <button @click="adminTab = 'nhan-vien'" :class="['btn w-100 text-start text-white', adminTab === 'nhan-vien' ? 'btn-success' : '']">👔 Quản lý nhân viên</button>
          </li>
          <li class="nav-item border-top pt-2">
            <button @click="adminTab = 'ban-hang'" :class="['btn w-100 text-start text-white', adminTab === 'ban-hang' ? 'btn-success' : '']">💰 Bán hàng</button>
          </li>
        </ul>
      </aside>

      <main class="flex-grow-1 p-4 bg-light overflow-auto" style="max-height: calc(100vh - 56px);">
        
        <div v-if="adminTab === 'san-pham'">
          <h4 class="mb-4">Danh sách sản phẩm đang bán</h4>
          <table class="table table-white table-hover shadow-sm rounded">
            <thead class="table-success">
              <tr><th>STT</th><th>ID</th><th>Tên sản phẩm</th><th>Hình ảnh</th></tr>
            </thead>
            <tbody>
              <tr v-for="(sp, idx) in tatCaSanPhams" :key="sp.id">
                <td>{{ idx + 1 }}</td><td>SP{{ sp.id }}</td><td>{{ sp.name }}</td>
                <td><img :src="sp.img" width="40" height="40" class="rounded"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="adminTab === 'khach-hang'">
          <h4 class="mb-4">Quản lý khách hàng</h4>
          <table class="table table-white table-hover shadow-sm">
            <thead class="table-success">
              <tr><th>STT</th><th>Tên Khách hàng</th><th>Khách quen</th></tr>
            </thead>
            <tbody>
              <tr v-for="(kh, idx) in dsKhachHang" :key="idx">
                <td>{{ idx + 1 }}</td><td>{{ kh.name }}</td><td>{{ kh.laKhachQuen }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="adminTab === 'nhan-vien'">
          <h4 class="mb-4">Quản lý nhân viên</h4>
          <table class="table table-white table-hover shadow-sm">
            <thead class="table-success">
              <tr><th>STT</th><th>Tên Nhân viên</th><th>Ca làm</th><th>Lương</th></tr>
            </thead>
            <tbody>
              <tr v-for="(nv, idx) in dsNhanVien" :key="idx">
                <td>{{ idx + 1 }}</td><td>{{ nv.name }}</td><td>{{ nv.caLam }}</td><td>{{ nv.luong }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="adminTab === 'hoa-don'">
          <h4 class="mb-4">Quản lý hóa đơn</h4>
          <table class="table table-white table-hover shadow-sm">
            <thead class="table-success">
              <tr><th>Mã HD</th><th>Ngày</th><th>Khách hàng</th><th>Tổng tiền</th><th>Số tiền khách trả</th></tr>
            </thead>
            <tbody>
              <tr v-for="hd in dsHoaDon" :key="hd.id">
                <td>{{ hd.id }}</td><td>{{ hd.ngay }}</td><td>{{ hd.khach }}</td><td>{{ hd.tong }}</td><td>{{ hd.tra }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="adminTab === 'ban-hang'">
          <h4 class="mb-4">Quầy bán hàng tại quầy</h4>
          <div class="card p-4 shadow-sm" style="max-width: 500px;">
            <div class="mb-3"><label>Tên khách hàng</label><input v-model="billForm.customer" class="form-control" placeholder="Họ tên khách..."></div>
            <div class="mb-3"><label>Sản phẩm mua</label><input v-model="billForm.product" class="form-control" placeholder="Tên cây/chậu..."></div>
            <div class="mb-2 d-flex gap-2">
              <div class="w-50"><label>Tổng tiền (đ)</label><input v-model="billForm.total" type="number" class="form-control"></div>
              <div class="w-50"><label>Khách trả (đ)</label><input v-model="billForm.paid" type="number" class="form-control"></div>
            </div>
            <button @click="handleAdminSale" class="btn btn-success w-100 mt-4 fw-bold">THANH TOÁN & XUẤT HÓA ĐƠN</button>
          </div>
        </div>

      </main>
    </div>

    <footer class="admin-footer bg-dark py-2 text-center text-white-50 small border-top">
      Hệ thống quản trị Vườn Cây Việt v1.0
    </footer>
  </div>
</template>

<style scoped>
/* CLIENT CSS (GIỮ NGUYÊN) */
.product-card {
  transition: transform 0.2s;
  border: 1px solid #e0e0e0;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
  border-color: #198754;
}

/* ADMIN CSS (MỚI) */
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.sidebar .btn:hover {
  background-color: #198754;
}
.table img {
  object-fit: cover;
  border: 1px solid #ddd;
}

/* Smooth scroll & Scrollbar */
html { scroll-behavior: smooth; }
.dropdown-menu::-webkit-scrollbar, main::-webkit-scrollbar { width: 5px; }
.dropdown-menu::-webkit-scrollbar-thumb, main::-webkit-scrollbar-thumb { background: #198754; border-radius: 5px; }
</style> -->