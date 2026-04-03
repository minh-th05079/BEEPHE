import { ref, computed } from 'vue'

// ==========================================
// THIẾT LẬP MOCKAPI
// ==========================================
const API_SANPHAM = 'https://69a1c98a2e82ee536fa237c4.mockapi.io/sanpham'
const API_USERS = 'https://69a1c98a2e82ee536fa237c4.mockapi.io/users'
const API_DANHMUC = 'https://698042e46570ee87d50e8e0c.mockapi.io/danhmuc'
const API_HOADON = 'https://698042e46570ee87d50e8e0c.mockapi.io/hoadon'

const matchId = (id1, id2) => String(id1) === String(id2)

export const currentView = ref('client')
export const adminTab = ref('san-pham')
export const username = ref('')
export const password = ref('')

// ==========================================
// 1. QUẢN LÝ DANH MỤC & TÌM KIẾM
// ==========================================
export const activeCategory = ref('all')
export const searchQuery = ref('')

export const dsDanhMuc = ref([])
export const showFormDM = ref(false)
export const isEditDM = ref(false)
export const formDM = ref({ id: '', name: '' })

export const huyFormDM = () => {
  showFormDM.value = false
  isEditDM.value = false
  formDM.value = { id: '', name: '' }
}

export const layDuLieuDanhMuc = async () => {
  try {
    const res = await fetch(API_DANHMUC)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) dsDanhMuc.value = data
    }
  } catch (e) {
    console.log('Lỗi tải danh mục:', e)
  }
}
layDuLieuDanhMuc()

export const luuDanhMuc = async () => {
  if (!formDM.value.name) return alert('Vui lòng nhập tên danh mục!')

  const isEdit = isEditDM.value
  const data = { name: formDM.value.name }

  if (!isEdit && formDM.value.id) data.id = formDM.value.id

  try {
    const res = await fetch(isEdit ? `${API_DANHMUC}/${formDM.value.id}` : API_DANHMUC, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      await layDuLieuDanhMuc()
      huyFormDM()
    } else {
      alert('Lỗi khi lưu danh mục trên API!')
    }
  } catch (e) {
    alert('Lỗi mạng!')
  }
}

export const xoaDanhMuc = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return
  try {
    const res = await fetch(`${API_DANHMUC}/${id}`, { method: 'DELETE' })
    if (res.ok) await layDuLieuDanhMuc()
  } catch (e) {
    alert('Lỗi khi xóa danh mục!')
  }
}

export const suaDanhMuc = (dm) => {
  showFormDM.value = true
  isEditDM.value = true
  formDM.value = { ...dm }
}

// ==========================================
// 2. QUẢN LÝ SẢN PHẨM & TỒN KHO
// ==========================================
export const adminSanPhams = ref([])

export const filteredProducts = computed(() => {
  if (!Array.isArray(adminSanPhams.value)) return []
  let result = adminSanPhams.value
  if (activeCategory.value !== 'all')
    result = result.filter((sp) => String(sp.category) === String(activeCategory.value))
  if (searchQuery.value.trim() !== '') {
    const keyword = searchQuery.value.toLowerCase().trim()
    result = result.filter((sp) => sp.name.toLowerCase().includes(keyword))
  }
  return result
})

export const showFormSP = ref(false)
export const isEditSP = ref(false)
export const formSP = ref({ id: null, name: '', price: 0, img: '', category: '', tonKho: 0 })
export const huyFormSP = () => {
  showFormSP.value = false
  isEditSP.value = false
  formSP.value = {
    id: null,
    name: '',
    price: 0,
    img: '',
    category: dsDanhMuc.value[0]?.id || 'tra-sua',
    tonKho: 0,
  }
}

export const layDuLieuSanPham = async () => {
  try {
    const res = await fetch(API_SANPHAM)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) adminSanPhams.value = data
    }
  } catch (e) {}
}
layDuLieuSanPham()

export const luuSanPham = async () => {
  if (
    !formSP.value.name ||
    formSP.value.price <= 0 ||
    formSP.value.tonKho < 0 ||
    !formSP.value.category
  )
    return alert('Dữ liệu không hợp lệ!')
  const isEdit = isEditSP.value
  const data = {
    name: formSP.value.name,
    price: Number(formSP.value.price),
    img: formSP.value.img,
    category: formSP.value.category,
    tonKho: Number(formSP.value.tonKho),
  }
  try {
    const res = await fetch(isEdit ? `${API_SANPHAM}/${formSP.value.id}` : API_SANPHAM, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      await layDuLieuSanPham()
      huyFormSP()
    } else alert('Lỗi MockAPI!')
  } catch (e) {
    alert('Lỗi mạng!')
  }
}

export const xoaSanPham = async (id) => {
  if (!confirm('Xóa?')) return
  try {
    const res = await fetch(`${API_SANPHAM}/${id}`, { method: 'DELETE' })
    if (res.ok) await layDuLieuSanPham()
  } catch (e) {}
}

export const suaSanPham = (item) => {
  showFormSP.value = true
  isEditSP.value = true
  formSP.value = { ...item }
}

// ==========================================
// 3. QUẢN LÝ GIỎ HÀNG & SINH ĐƠN HÀNG THỰC TẾ
// ==========================================
export const cart = ref([])

export const addToCart = (product, qty = 1) => {
  if (product.tonKho <= 0) return alert('Hết hàng!')
  const item = cart.value.find((i) => matchId(i.id, product.id) && i.name === product.name)
  
  const totalThisProductInCart = cart.value
    .filter((i) => matchId(i.id, product.id))
    .reduce((sum, i) => sum + i.quantity, 0)
    
  if (totalThisProductInCart + qty > product.tonKho)
    return alert(`Kho chỉ còn ${product.tonKho} sản phẩm!`)
    
  if (item) {
    item.quantity += qty
  } else {
    cart.value.push({ ...product, quantity: qty })
  }
}

export const increaseCartItem = (index) => {
  const item = cart.value[index]
  const spGoc = adminSanPhams.value.find((s) => matchId(s.id, item.id))
  const totalThisProductInCart = cart.value
    .filter((i) => matchId(i.id, item.id))
    .reduce((sum, i) => sum + i.quantity, 0)

  if (spGoc && totalThisProductInCart >= spGoc.tonKho) {
    return alert(`Kho chỉ còn ${spGoc.tonKho} sản phẩm!`)
  }
  item.quantity++
}

export const decreaseCartItem = (index) => {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity--
  } else {
    cart.value.splice(index, 1)
  }
}

export const removeCartItem = (index) => {
  cart.value.splice(index, 1)
}

export const handleCheckout = async () => {
  if (cart.value.length === 0) return
  
  if (!currentUserProfile.value.id) {
    alert('Vui lòng đăng nhập để tiến hành đặt món và theo dõi đơn hàng!')
    currentView.value = 'login'
    return
  }

  try {
    for (const item of cart.value) {
      const sp = adminSanPhams.value.find((s) => s.id === item.id)
      if (sp)
        await fetch(`${API_SANPHAM}/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tonKho: sp.tonKho - item.quantity }),
        })
    }

    const newOrder = {
      ngay: new Date().toLocaleString('vi-VN'),
      khachId: currentUserProfile.value.id || 'guest',
      khach: currentUserProfile.value.user || 'Khách vãng lai',
      sdt: currentUserProfile.value.phone || 'Không có',
      email: currentUserProfile.value.email || 'Không có',
      tong: totalAmount.value,
      trangThai: 'Chờ xác nhận',
      chiTiet: cart.value.map((i) => `${i.name} (SL: ${i.quantity})`).join(', '),
      danhSachMon: cart.value, 
    }

    await fetch(API_HOADON, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    })

    await layDuLieuSanPham()
    await layDuLieuHoaDon()
    alert('Đặt hàng thành công! Vui lòng vào Lịch sử đơn hàng để theo dõi tiến độ.')
    cart.value = []
  } catch (e) {
    alert('Lỗi xử lý đơn hàng!')
  }
}

export const totalAmount = computed(() => {
  if (!Array.isArray(cart.value)) return 0
  return cart.value.reduce((t, i) => t + i.price * i.quantity, 0)
})
export const totalItemsInCart = computed(() => {
  if (!Array.isArray(cart.value)) return 0
  return cart.value.reduce((t, i) => t + i.quantity, 0)
})

// ==========================================
// 4. LOGIC TÀI KHOẢN
// ==========================================
export const regUsername = ref('')
export const regEmail = ref('')
export const regPhone = ref('')
export const regPassword = ref('')
export const regConfirmPassword = ref('')
export const registeredUsers = ref([])
export const currentUserProfile = ref({ id: null, user: '', phone: '', email: '', pass: '' })

export const layDuLieuUsers = async () => {
  try {
    const res = await fetch(API_USERS)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) registeredUsers.value = data
    }
  } catch (e) {}
}
layDuLieuUsers()

export const handleRegister = async () => {
  if (!regUsername.value || !regEmail.value || !regPhone.value || !regPassword.value)
    return alert('Vui lòng nhập đủ thông tin!')
  if (!Array.isArray(registeredUsers.value)) return alert('Đang tải dữ liệu, vui lòng thử lại!')
  if (
    registeredUsers.value.find(
      (u) =>
        u.user === regUsername.value || u.email === regEmail.value || u.phone === regPhone.value,
    )
  )
    return alert('Thông tin đã tồn tại!')
  try {
    const res = await fetch(API_USERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: regUsername.value,
        pass: regPassword.value,
        email: regEmail.value,
        phone: regPhone.value,
        isBlacklisted: false,
      }),
    })
    if (res.ok) {
      alert('Đăng ký thành công!')
      await layDuLieuUsers()
      currentView.value = 'login'
    }
  } catch (error) {}
}

export const handleLogin = () => {
  const uName = String(username.value).trim()
  const uPass = String(password.value).trim()
  if (!Array.isArray(registeredUsers.value)) registeredUsers.value = []

  const isNewUser = registeredUsers.value.find(
    (u) =>
      (String(u.user) === uName || String(u.email) === uName || String(u.phone) === uName) &&
      String(u.pass) === uPass,
  )

  if (uName === 'admin' && uPass === '123') {
    currentView.value = 'admin'
  } else if (isNewUser) {
    if (isNewUser.isBlacklisted)
      return alert('🚫 TÀI KHOẢN CỦA BẠN ĐÃ BỊ KHÓA! Vui lòng liên hệ Admin.')
    currentUserProfile.value = { ...isNewUser }
    currentView.value = 'client'
  } else if (uName === 'kh123' && uPass === '123') {
    currentUserProfile.value = {
      id: 'test',
      user: 'Khách Test',
      phone: '0912345678',
      email: 'test@gmail.com',
      pass: '123',
    }
    currentView.value = 'client'
  } else {
    alert('Sai thông tin tài khoản hoặc mật khẩu!')
  }
}

export const handleLogout = () => {
  if (confirm('Đăng xuất?')) {
    currentView.value = 'client' 
    username.value = ''
    password.value = ''
    currentUserProfile.value = { id: null, user: '', phone: '', email: '', pass: '' }
  }
}

// ==========================================
// 5. ADMIN KHÁCH HÀNG (BLACKLIST & TÌM KIẾM)
// ==========================================
export const showDetailKH = ref(false)
export const selectedKH = ref({ id: null, user: '', email: '', phone: '', isBlacklisted: false })
export const searchKhachHang = ref('') // Biến lưu từ khóa tìm kiếm khách

export const dongChiTietKH = () => {
  showDetailKH.value = false
  selectedKH.value = { id: null, user: '', email: '', phone: '', isBlacklisted: false }
}

export const xemKhachHang = (item) => {
  showDetailKH.value = true
  selectedKH.value = { ...item }
}

export const toggleBlacklist = async (user) => {
  const newStatus = !user.isBlacklisted
  const actionName = newStatus ? 'KHÓA' : 'MỞ KHÓA'
  if (!confirm(`Xác nhận ${actionName} tài khoản "${user.user}"?`)) return
  try {
    const res = await fetch(`${API_USERS}/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlacklisted: newStatus }),
    })
    if (res.ok) {
      await layDuLieuUsers()
      alert('Thành công!')
      if (showDetailKH.value) dongChiTietKH()
    }
  } catch (e) {
    alert('Lỗi kết nối mạng!')
  }
}

// Lọc khách hàng theo từ khóa (Tìm theo Tên, Email hoặc Số điện thoại)
export const filteredKhachHang = computed(() => {
  if (!searchKhachHang.value.trim()) return registeredUsers.value;
  const keyword = searchKhachHang.value.toLowerCase().trim();
  return registeredUsers.value.filter(kh => 
    String(kh.user).toLowerCase().includes(keyword) || 
    String(kh.email).toLowerCase().includes(keyword) || 
    String(kh.phone || '').toLowerCase().includes(keyword)
  );
})

// ==========================================
// 6. QUẢN LÝ ĐƠN HÀNG
// ==========================================
export const dsHoaDon = ref([])
export const showDetailHD = ref(false)
export const selectedHD = ref(null)

export const xemHoaDon = (hd) => {
  selectedHD.value = hd
  showDetailHD.value = true
}

export const dongChiTietHD = () => {
  showDetailHD.value = false
  selectedHD.value = null
}

export const layDuLieuHoaDon = async () => {
  try {
    const res = await fetch(API_HOADON)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) dsHoaDon.value = data.reverse()
    }
  } catch (e) {}
}
layDuLieuHoaDon()

export const capNhatTrangThaiHoaDon = async (id, trangThaiMoi) => {
  if (!confirm(`Xác nhận đổi đơn hàng này sang trạng thái: "${trangThaiMoi}"?`)) return false
  try {
    const res = await fetch(`${API_HOADON}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trangThai: trangThaiMoi }),
    })
    if (res.ok) {
      await layDuLieuHoaDon()
      return true
    }
  } catch (e) {
    alert('Lỗi kết nối!')
  }
  return false
}

// ==========================================
// 7. PROFILE CÁ NHÂN & QUÊN MẬT KHẨU
// ==========================================
export const handleUpdateProfile = async () => {
  if (!currentUserProfile.value.user || !currentUserProfile.value.phone)
    return alert('Vui lòng điền đủ thông tin!')
  try {
    const res = await fetch(`${API_USERS}/${currentUserProfile.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: currentUserProfile.value.user,
        phone: currentUserProfile.value.phone,
        email: currentUserProfile.value.email,
      }),
    })
    if (res.ok) {
      alert('Cập nhật thông tin lên hệ thống thành công!')
      await layDuLieuUsers()
      currentView.value = 'client'
    }
  } catch (e) {
    alert('Lỗi kết nối MockAPI!')
  }
}

export const oldPassword = ref('')
export const newPassword = ref('')
export const confirmNewPassword = ref('')

export const handleChangePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmNewPassword.value)
    return alert('Nhập đủ thông tin!')
  if (oldPassword.value !== currentUserProfile.value.pass)
    return alert('Mật khẩu cũ không chính xác!')
  if (newPassword.value.length < 6) return alert('Mật khẩu mới phải từ 6 ký tự!')
  if (newPassword.value !== confirmNewPassword.value) return alert('Mật khẩu xác nhận không khớp!')
  try {
    const res = await fetch(`${API_USERS}/${currentUserProfile.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pass: newPassword.value }),
    })
    if (res.ok) {
      alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.')
      oldPassword.value = ''
      newPassword.value = ''
      confirmNewPassword.value = ''
      await layDuLieuUsers()
      handleLogout()
    }
  } catch (e) {
    alert('Lỗi kết nối MockAPI!')
  }
}

export const forgotEmail = ref('')
export const handleForgotPassword = () => {
  alert(`Đã gửi yêu cầu vào "${forgotEmail.value}".`)
  currentView.value = 'login'
  forgotEmail.value = ''
}