import { ref, computed } from 'vue'

// ==========================================
// THIẾT LẬP MOCKAPI (Thay link của bạn vào đây nếu có)
// ==========================================
const API_SANPHAM = 'https://6xxxxxxxxx.mockapi.io/api/v1/sanpham'
const API_KHACHHANG = 'https://6xxxxxxxxx.mockapi.io/api/v1/khachhang'
const API_HOADON = 'https://6xxxxxxxxx.mockapi.io/api/v1/hoadon'

// --- CÁC HÀM HỖ TRỢ DÙNG CHUNG ---
const checkApi = (url) => !url.includes('xxxxxxxxx')
const matchId = (id1, id2) => String(id1) === String(id2)
const getNextId = (list) =>
  list.length === 0 ? 1 : Math.max(...list.map((i) => Number(i.id) || 0)) + 1
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

// --- LOGIC ĐĂNG KÝ ---
export const handleRegister = () => {
  if (!regUsername.value || !regPassword.value) {
    return alert('Vui lòng nhập đủ thông tin!')
  }
  if (regPassword.value !== regConfirmPassword.value) {
    return alert('Mật khẩu không khớp!')
  }
  
  // Lưu user mới vào mảng
  registeredUsers.value.push({ 
    user: regUsername.value, 
    pass: regPassword.value 
  })
  
  alert('Đăng ký thành công! Mời bạn đăng nhập.')
  
  // Xóa form và chuyển về trang Login
  regUsername.value = ''
  regPassword.value = ''
  regConfirmPassword.value = ''
  currentView.value = 'login'
}

// --- LOGIC ĐĂNG NHẬP (Sửa lại một chút) ---
export const handleLogin = () => {
  // Kiểm tra xem có phải là tài khoản vừa đăng ký không
  const isNewUser = registeredUsers.value.find(
    u => u.user === username.value && u.pass === password.value
  )

  if (username.value === 'admin' && password.value === '123') {
    currentView.value = 'admin'
    if (checkApi(API_SANPHAM)) layDuLieuSanPham()
    if (checkApi(API_KHACHHANG)) layDuLieuKhachHang()
    if (checkApi(API_HOADON)) layDuLieuHoaDon()
    alert('Đăng nhập quyền ADMIN!')
  } else if ((username.value === 'kh123' && password.value === '123') || isNewUser) {
    currentView.value = 'client'
    alert('Chào mừng bạn đến với Tiệm Nước!')
  } else alert('Sai thông tin!')
}

// --- LOGIC ĐĂNG XUẤT ---
export const handleLogout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    currentView.value = 'login'
    username.value = ''
    password.value = ''
  }
}

// --- Biến cho form Đăng ký ---
export const regUsername = ref('')
export const regPassword = ref('')
export const regConfirmPassword = ref('')
export const registeredUsers = ref([]) // Mảng lưu tạm user vừa đăng ký

// ==========================================
// 3. QUẢN LÝ SẢN PHẨM (TRÀ SỮA & CAFE)
// ==========================================
export const adminSanPhams = ref([
  {
    id: 1,
    name: 'Trà Sữa Trân Châu',
    price: 35000,
    img: '/images/ts1.jpg',
    category: 'tra-sua',
  },
  {
    id: 2,
    name: 'Trà Sữa Matcha',
    price: 40000,
    img: '/images/ts2.jpg',
    category: 'tra-sua',
  },
  {
    id: 3,
    name: 'Cafe Đen Đá',
    price: 25000,
    img: '/images/cf1.jpg',
    category: 'cafe',
  },
  {
    id: 4,
    name: 'Bạc Xỉu',
    price: 30000,
    img: '/images/cf2.jpg',
    category: 'cafe',
  },
])

export const dsTraSua = computed(() =>
  adminSanPhams.value.filter((sp) => sp.category === 'tra-sua'),
)
export const dsCafe = computed(() => adminSanPhams.value.filter((sp) => sp.category === 'cafe'))

export const showFormSP = ref(false)
export const isEditSP = ref(false)
export const formSP = ref({ id: null, name: '', price: 0, img: '', category: 'tra-sua' })
export const huyFormSP = () => {
  showFormSP.value = false
  isEditSP.value = false
  formSP.value = { id: null, name: '', price: 0, img: '', category: 'tra-sua' }
}

export const layDuLieuSanPham = async () => {
  try {
    const res = await fetch(API_SANPHAM)
    if (res.ok) adminSanPhams.value = await res.json()
  } catch (e) {}
}

export const luuSanPham = async () => {
  if (!formSP.value.name || !formSP.value.price) return alert('Vui lòng nhập tên và giá!')
  const isEdit = isEditSP.value
  const data = isEdit
    ? { ...formSP.value }
    : { ...formSP.value, id: getNextId(adminSanPhams.value) }

  if (checkApi(API_SANPHAM)) {
    try {
      const res = await fetch(isEdit ? `${API_SANPHAM}/${data.id}` : API_SANPHAM, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        layDuLieuSanPham()
        huyFormSP()
        return
      }
    } catch (e) {}
  }
  if (isEdit) {
    const idx = adminSanPhams.value.findIndex((x) => matchId(x.id, data.id))
    if (idx !== -1) adminSanPhams.value[idx] = { ...data }
  } else adminSanPhams.value.push(data)
  huyFormSP()
  alert('Lưu món thành công!')
}

export const xoaSanPham = async (id) => {
  if (!confirm('Xóa món này?')) return
  if (checkApi(API_SANPHAM)) {
    try {
      const res = await fetch(`${API_SANPHAM}/${id}`, { method: 'DELETE' })
      if (res.ok) {
        layDuLieuSanPham()
        return
      }
    } catch (e) {}
  }
  adminSanPhams.value = adminSanPhams.value.filter((x) => !matchId(x.id, id))
}

export const suaSanPham = (item) => {
  showFormSP.value = true
  isEditSP.value = true
  formSP.value = { ...item }
}

// ==========================================
// 4. QUẢN LÝ KHÁCH HÀNG & HÓA ĐƠN (Giữ nguyên logic)
// ==========================================
export const dsKhachHang = ref([{ id: 1, name: 'Nguyễn Văn A', laKhachQuen: 'Có' }])
export const showFormKH = ref(false)
export const isEditKH = ref(false)
export const formKH = ref({ id: null, name: '', laKhachQuen: 'Không' })
export const huyFormKH = () => {
  showFormKH.value = false
  isEditKH.value = false
  formKH.value = { id: null, name: '', laKhachQuen: 'Không' }
}

export const layDuLieuKhachHang = async () => {
  try {
    const res = await fetch(API_KHACHHANG)
    if (res.ok) dsKhachHang.value = await res.json()
  } catch (e) {}
}
export const luuKhachHang = async () => {
  const isEdit = isEditKH.value
  const data = isEdit ? { ...formKH.value } : { ...formKH.value, id: getNextId(dsKhachHang.value) }
  if (checkApi(API_KHACHHANG)) {
    try {
      const res = await fetch(isEdit ? `${API_KHACHHANG}/${data.id}` : API_KHACHHANG, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        layDuLieuKhachHang()
        huyFormKH()
        return
      }
    } catch (e) {}
  }
  if (isEdit) {
    const idx = dsKhachHang.value.findIndex((x) => matchId(x.id, data.id))
    if (idx !== -1) dsKhachHang.value[idx] = { ...data }
  } else dsKhachHang.value.push(data)
  huyFormKH()
}
export const xoaKhachHang = async (id) => {
  if (!confirm('Xóa khách hàng?')) return
  if (checkApi(API_KHACHHANG)) {
    try {
      const res = await fetch(`${API_KHACHHANG}/${id}`, { method: 'DELETE' })
      if (res.ok) {
        layDuLieuKhachHang()
        return
      }
    } catch (e) {}
  }
  dsKhachHang.value = dsKhachHang.value.filter((x) => !matchId(x.id, id))
}
export const suaKhachHang = (item) => {
  showFormKH.value = true
  isEditKH.value = true
  formKH.value = { ...item }
}

export const dsHoaDon = ref([
  { id: 'HD001', ngay: '2026-03-23', khach: 'Khách lẻ', tong: 35000, tra: 35000 },
])
export const showFormHD = ref(false)
export const isEditHD = ref(false)
export const formHD = ref({ id: null, ngay: '', khach: '', tong: 0, tra: 0 })
export const huyFormHD = () => {
  showFormHD.value = false
  isEditHD.value = false
  formHD.value = { id: null, ngay: '', khach: '', tong: 0, tra: 0 }
}

export const layDuLieuHoaDon = async () => {
  try {
    const res = await fetch(API_HOADON)
    if (res.ok) dsHoaDon.value = await res.json()
  } catch (e) {}
}
export const luuHoaDon = async () => {
  const isEdit = isEditHD.value
  const data = isEdit ? { ...formHD.value } : { ...formHD.value, id: getNextIdHD(dsHoaDon.value) }
  if (checkApi(API_HOADON)) {
    try {
      const res = await fetch(isEdit ? `${API_HOADON}/${data.id}` : API_HOADON, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        layDuLieuHoaDon()
        huyFormHD()
        return
      }
    } catch (e) {}
  }
  if (isEdit) {
    const idx = dsHoaDon.value.findIndex((x) => matchId(x.id, data.id))
    if (idx !== -1) dsHoaDon.value[idx] = { ...data }
  } else dsHoaDon.value.push(data)
  huyFormHD()
}
export const xoaHoaDon = async (id) => {
  if (!confirm('Xóa hóa đơn?')) return
  if (checkApi(API_HOADON)) {
    try {
      const res = await fetch(`${API_HOADON}/${id}`, { method: 'DELETE' })
      if (res.ok) {
        layDuLieuHoaDon()
        return
      }
    } catch (e) {}
  }
  dsHoaDon.value = dsHoaDon.value.filter((x) => !matchId(x.id, id))
}
export const suaHoaDon = (item) => {
  showFormHD.value = true
  isEditHD.value = true
  formHD.value = { ...item }
}

// ==========================================
// 5. QUẢN LÝ TÀI KHOẢN (QUÊN MẬT KHẨU & PROFILE)
// ==========================================

// --- Quên mật khẩu ---
export const forgotUsername = ref('')
export const handleForgotPassword = () => {
  if (!forgotUsername.value) {
    return alert('Vui lòng nhập tên tài khoản!')
  }
  // Giả lập chức năng reset mật khẩu
  alert(`Đã gửi yêu cầu cấp lại mật khẩu cho tài khoản "${forgotUsername.value}". Mật khẩu mặc định tạm thời là: 123`)
  currentView.value = 'login'
  forgotUsername.value = ''
}

// --- Thông tin cá nhân (Profile) ---
export const currentUserProfile = ref({
  fullname: 'Khách Hàng VIP',
  phone: '0987654321',
  address: 'Hà Nội'
})

export const handleUpdateProfile = () => {
  if (!currentUserProfile.value.fullname || !currentUserProfile.value.phone) {
    return alert('Vui lòng điền đủ họ tên và số điện thoại!')
  }
  alert('Cập nhật thông tin tài khoản thành công!')
  currentView.value = 'client' // Cập nhật xong thì quay về trang chủ
}