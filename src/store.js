import { ref, computed } from 'vue'

// ==========================================
// THIẾT LẬP MOCKAPI
// ==========================================
const API_SANPHAM = 'https://6xxxxxxxxx.mockapi.io/api/v1/sanpham'
const API_KHACHHANG = 'https://6xxxxxxxxx.mockapi.io/api/v1/khachhang'
const API_HOADON = 'https://6xxxxxxxxx.mockapi.io/api/v1/hoadon'

// LINK MOCKAPI MỚI CỦA BẠN ĐÃ ĐƯỢC CẬP NHẬT TẠI ĐÂY 👇:
const API_USERS = 'https://69a1c98a2e82ee536fa237c4.mockapi.io/users'

// --- CÁC HÀM HỖ TRỢ DÙNG CHUNG ---
const checkApi = (url) => !url.includes('xxxxxxxxx')
const matchId = (id1, id2) => String(id1) === String(id2)
const getNextId = (list) => list.length === 0 ? 1 : Math.max(...list.map((i) => Number(i.id) || 0)) + 1
const getNextIdHD = (list) => {
  if (list.length === 0) return 'HD001'
  const max = Math.max(...list.map((i) => parseInt(String(i.id).replace('HD', '')) || 0))
  return 'HD' + String(max + 1).padStart(3, '0')
}

// --- 1. QUẢN LÝ TRẠNG THÁI MÀN HÌNH & USER ---
export const currentView = ref('login')
export const adminTab = ref('san-pham')
export const username = ref('')
export const password = ref('')
export const activeCategory = ref('all') 

// --- 2. QUẢN LÝ GIỎ HÀNG ---
export const cart = ref([])
export const addToCart = (product) => {
  const existingItem = cart.value.find((item) => matchId(item.id, product.id))
  if (existingItem) existingItem.quantity++
  else cart.value.push({ ...product, quantity: 1 })
}
export const removeFromCart = (index) => {
  if (cart.value[index].quantity > 1) cart.value[index].quantity--
  else cart.value.splice(index, 1)
}
export const handleCheckout = () => {
  if (cart.value.length === 0) return
  alert('Đặt hàng thành công! Đồ uống của bạn đang được pha chế.')
  cart.value = []
}
export const totalAmount = computed(() => cart.value.reduce((t, i) => t + i.price * i.quantity, 0))
export const totalItemsInCart = computed(() => cart.value.reduce((t, i) => t + i.quantity, 0))

// ==========================================
// LOGIC QUẢN LÝ TÀI KHOẢN (ĐĂNG KÝ & ĐĂNG NHẬP API)
// ==========================================
export const regUsername = ref('')
export const regEmail = ref('')
export const regPassword = ref('')
export const regConfirmPassword = ref('')
export const registeredUsers = ref([])

// Lấy dữ liệu user
export const layDuLieuUsers = async () => {
  try {
    const res = await fetch(API_USERS)
    if (res.ok) {
      registeredUsers.value = await res.json()
    }
  } catch (e) {
    console.log('Chưa kết nối được API Users')
  }
}
layDuLieuUsers() 

// Đăng ký và ném lên API
export const handleRegister = async () => {
  if (!regUsername.value || !regEmail.value || !regPassword.value) {
    return alert('Vui lòng nhập đủ thông tin!')
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(regEmail.value)) return alert('Email không hợp lệ!')
  if (regPassword.value.length < 6) return alert('Mật khẩu phải từ 6 ký tự trở lên!')
  if (regPassword.value !== regConfirmPassword.value) return alert('Mật khẩu không khớp!')
  
  const isExist = registeredUsers.value.find(u => u.user === regUsername.value)
  if (isExist) return alert('Tên tài khoản này đã được sử dụng!')

  const newUser = { 
    user: regUsername.value, 
    pass: regPassword.value, 
    email: regEmail.value 
  }

  try {
    const res = await fetch(API_USERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })

    if (res.ok) {
      alert('Đăng ký thành công! Mời bạn đăng nhập.')
      await layDuLieuUsers() 
      
      regUsername.value = ''; regEmail.value = ''; regPassword.value = ''; regConfirmPassword.value = '';
      currentView.value = 'login'
    } else {
      alert(`Lỗi server MockAPI: ${res.status} ${res.statusText}. Bạn kiểm tra lại bảng trên web nhé!`)
    }
  } catch (error) {
    alert('Lỗi kết nối mạng, vui lòng thử lại!')
  }
}

// --- LOGIC ĐĂNG NHẬP ---
export const handleLogin = () => {
  const isNewUser = registeredUsers.value.find(
    u => u.user === username.value && u.pass === password.value
  )

  if (username.value === 'admin' && password.value === '123') {
    currentView.value = 'admin'
    if (checkApi(API_SANPHAM)) layDuLieuSanPham()
    if (checkApi(API_KHACHHANG)) layDuLieuKhachHang()
    if (checkApi(API_HOADON)) layDuLieuHoaDon()
  } else if ((username.value === 'kh123' && password.value === '123') || isNewUser) {
    currentView.value = 'client'
  } else {
    alert('Sai thông tin tài khoản hoặc mật khẩu!')
  }
}

export const handleLogout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    currentView.value = 'login'; username.value = ''; password.value = ''
  }
}

// ==========================================
// 3. QUẢN LÝ SẢN PHẨM 
// ==========================================
export const adminSanPhams = ref([
  { id: 1, name: 'Trà Sữa Trân Châu', price: 35000, img: '/images/ts1.jpg', category: 'tra-sua' },
  { id: 2, name: 'Trà Sữa Matcha', price: 40000, img: '/images/ts2.jpg', category: 'tra-sua' },
  { id: 3, name: 'Cafe Đen Đá', price: 25000, img: '/images/cf1.jpg', category: 'cafe' },
  { id: 4, name: 'Bạc Xỉu', price: 30000, img: '/images/cf2.jpg', category: 'cafe' },
])

export const dsTraSua = computed(() => adminSanPhams.value.filter((sp) => sp.category === 'tra-sua'))
export const dsCafe = computed(() => adminSanPhams.value.filter((sp) => sp.category === 'cafe'))

export const showFormSP = ref(false)
export const isEditSP = ref(false)
export const formSP = ref({ id: null, name: '', price: 0, img: '', category: 'tra-sua' })
export const huyFormSP = () => { showFormSP.value = false; isEditSP.value = false; formSP.value = { id: null, name: '', price: 0, img: '', category: 'tra-sua' } }
export const layDuLieuSanPham = async () => { try { const res = await fetch(API_SANPHAM); if (res.ok) adminSanPhams.value = await res.json() } catch (e) {} }
export const luuSanPham = async () => {
  if (!formSP.value.name || !formSP.value.price) return alert('Vui lòng nhập tên và giá!')
  const isEdit = isEditSP.value
  const data = isEdit ? { ...formSP.value } : { ...formSP.value, id: getNextId(adminSanPhams.value) }
  if (checkApi(API_SANPHAM)) {
    try {
      const res = await fetch(isEdit ? `${API_SANPHAM}/${data.id}` : API_SANPHAM, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) { layDuLieuSanPham(); huyFormSP(); return }
    } catch (e) {}
  }
  if (isEdit) { const idx = adminSanPhams.value.findIndex((x) => matchId(x.id, data.id)); if (idx !== -1) adminSanPhams.value[idx] = { ...data } } 
  else adminSanPhams.value.push(data)
  huyFormSP()
}
export const xoaSanPham = async (id) => {
  if (!confirm('Xóa món này?')) return
  if (checkApi(API_SANPHAM)) { try { const res = await fetch(`${API_SANPHAM}/${id}`, { method: 'DELETE' }); if (res.ok) { layDuLieuSanPham(); return } } catch (e) {} }
  adminSanPhams.value = adminSanPhams.value.filter((x) => !matchId(x.id, id))
}
export const suaSanPham = (item) => { showFormSP.value = true; isEditSP.value = true; formSP.value = { ...item } }

// ==========================================
// 4. QUẢN LÝ KHÁCH HÀNG & HÓA ĐƠN
// ==========================================
export const dsKhachHang = ref([{ id: 1, name: 'Nguyễn Văn A', laKhachQuen: 'Có' }])
export const showFormKH = ref(false); export const isEditKH = ref(false); export const formKH = ref({ id: null, name: '', laKhachQuen: 'Không' })
export const huyFormKH = () => { showFormKH.value = false; isEditKH.value = false; formKH.value = { id: null, name: '', laKhachQuen: 'Không' } }
export const layDuLieuKhachHang = async () => { try { const res = await fetch(API_KHACHHANG); if (res.ok) dsKhachHang.value = await res.json() } catch (e) {} }
export const luuKhachHang = async () => {
  const isEdit = isEditKH.value; const data = isEdit ? { ...formKH.value } : { ...formKH.value, id: getNextId(dsKhachHang.value) }
  if (checkApi(API_KHACHHANG)) { try { const res = await fetch(isEdit ? `${API_KHACHHANG}/${data.id}` : API_KHACHHANG, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { layDuLieuKhachHang(); huyFormKH(); return } } catch (e) {} }
  if (isEdit) { const idx = dsKhachHang.value.findIndex((x) => matchId(x.id, data.id)); if (idx !== -1) dsKhachHang.value[idx] = { ...data } } else dsKhachHang.value.push(data)
  huyFormKH()
}
export const xoaKhachHang = async (id) => {
  if (!confirm('Xóa khách hàng?')) return
  if (checkApi(API_KHACHHANG)) { try { const res = await fetch(`${API_KHACHHANG}/${id}`, { method: 'DELETE' }); if (res.ok) { layDuLieuKhachHang(); return } } catch (e) {} }
  dsKhachHang.value = dsKhachHang.value.filter((x) => !matchId(x.id, id))
}
export const suaKhachHang = (item) => { showFormKH.value = true; isEditKH.value = true; formKH.value = { ...item } }

export const dsHoaDon = ref([{ id: 'HD001', ngay: '2026-03-23', khach: 'Khách lẻ', tong: 35000, tra: 35000 }])
export const showFormHD = ref(false); export const isEditHD = ref(false); export const formHD = ref({ id: null, ngay: '', khach: '', tong: 0, tra: 0 })
export const huyFormHD = () => { showFormHD.value = false; isEditHD.value = false; formHD.value = { id: null, ngay: '', khach: '', tong: 0, tra: 0 } }
export const layDuLieuHoaDon = async () => { try { const res = await fetch(API_HOADON); if (res.ok) dsHoaDon.value = await res.json() } catch (e) {} }
export const luuHoaDon = async () => {
  const isEdit = isEditHD.value; const data = isEdit ? { ...formHD.value } : { ...formHD.value, id: getNextIdHD(dsHoaDon.value) }
  if (checkApi(API_HOADON)) { try { const res = await fetch(isEdit ? `${API_HOADON}/${data.id}` : API_HOADON, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { layDuLieuHoaDon(); huyFormHD(); return } } catch (e) {} }
  if (isEdit) { const idx = dsHoaDon.value.findIndex((x) => matchId(x.id, data.id)); if (idx !== -1) dsHoaDon.value[idx] = { ...data } } else dsHoaDon.value.push(data)
  huyFormHD()
}
export const xoaHoaDon = async (id) => {
  if (!confirm('Xóa hóa đơn?')) return
  if (checkApi(API_HOADON)) { try { const res = await fetch(`${API_HOADON}/${id}`, { method: 'DELETE' }); if (res.ok) { layDuLieuHoaDon(); return } } catch (e) {} }
  dsHoaDon.value = dsHoaDon.value.filter((x) => !matchId(x.id, id))
}
export const suaHoaDon = (item) => { showFormHD.value = true; isEditHD.value = true; formHD.value = { ...item } }

// ==========================================
// 5. QUẢN LÝ TÀI KHOẢN (QUÊN MẬT KHẨU & PROFILE)
// ==========================================

export const forgotEmail = ref('')
export const handleForgotPassword = () => {
  if (!forgotEmail.value) return alert('Vui lòng nhập Email!')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(forgotEmail.value)) return alert('Email không hợp lệ!')
  alert(`Đã gửi yêu cầu cấp lại mật khẩu vào email "${forgotEmail.value}". Vui lòng kiểm tra hộp thư.`)
  currentView.value = 'login'
  forgotEmail.value = ''
}

export const currentUserProfile = ref({ fullname: 'Khách Hàng VIP', phone: '0987654321', address: 'Hà Nội' })
export const handleUpdateProfile = () => {
  if (!currentUserProfile.value.fullname || !currentUserProfile.value.phone) return alert('Vui lòng điền đủ họ tên và số điện thoại!')
  alert('Cập nhật thông tin tài khoản thành công!')
  currentView.value = 'client' 
}

export const oldPassword = ref('')
export const newPassword = ref('')
export const confirmNewPassword = ref('')
export const handleChangePassword = () => {
  if (!oldPassword.value || !newPassword.value || !confirmNewPassword.value) return alert('Vui lòng nhập đủ thông tin!')
  if (newPassword.value.length < 6) return alert('Mật khẩu mới phải từ 6 ký tự trở lên!')
  if (newPassword.value !== confirmNewPassword.value) return alert('Mật khẩu mới không khớp!')
  alert('Đổi mật khẩu thành công!')
  oldPassword.value = ''; newPassword.value = ''; confirmNewPassword.value = '';
}