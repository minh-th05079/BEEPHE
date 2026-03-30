import { ref, computed } from 'vue'

// ==========================================
// THIẾT LẬP MOCKAPI
// ==========================================
const API_SANPHAM = 'https://69a1c98a2e82ee536fa237c4.mockapi.io/sanpham'
const API_USERS = 'https://69a1c98a2e82ee536fa237c4.mockapi.io/users'
const API_HOADON = 'https://6xxxxxxxxx.mockapi.io/api/v1/hoadon'

const matchId = (id1, id2) => String(id1) === String(id2)
const getNextIdHD = (list) => {
  if (list.length === 0) return 'HD001'
  const max = Math.max(...list.map((i) => parseInt(String(i.id).replace('HD', '')) || 0))
  return 'HD' + String(max + 1).padStart(3, '0')
}

// --- QUẢN LÝ TRẠNG THÁI ---
export const currentView = ref('login')
export const adminTab = ref('san-pham')
export const username = ref('') 
export const password = ref('')

// ==========================================
// 1. QUẢN LÝ DANH MỤC
// ==========================================
export const activeCategory = ref('all') 
export const dsDanhMuc = ref([
  { id: 'tra-sua', name: 'Trà Sữa' },
  { id: 'cafe', name: 'Cafe' }
])
export const showFormDM = ref(false)
export const isEditDM = ref(false)
export const formDM = ref({ id: '', name: '' })

export const huyFormDM = () => { showFormDM.value = false; isEditDM.value = false; formDM.value = { id: '', name: '' } }
export const luuDanhMuc = () => {
  if (!formDM.value.id || !formDM.value.name) return alert('Vui lòng nhập Mã và Tên danh mục!')
  if (!isEditDM.value && dsDanhMuc.value.find(d => d.id === formDM.value.id)) return alert('Mã danh mục đã tồn tại!')
  if (isEditDM.value) { const idx = dsDanhMuc.value.findIndex(d => d.id === formDM.value.id); if (idx !== -1) dsDanhMuc.value[idx] = { ...formDM.value } } 
  else { dsDanhMuc.value.push({ ...formDM.value }) }
  alert('Lưu danh mục thành công!'); huyFormDM()
}
export const xoaDanhMuc = (id) => {
  if (adminSanPhams.value.find(sp => sp.category === id)) return alert('Không thể xóa! Đang có sản phẩm thuộc danh mục này.')
  if (!confirm('Bạn chắc chắn muốn xóa danh mục này?')) return
  dsDanhMuc.value = dsDanhMuc.value.filter(d => d.id !== id)
}
export const suaDanhMuc = (dm) => { showFormDM.value = true; isEditDM.value = true; formDM.value = { ...dm } }

// ==========================================
// 2. QUẢN LÝ SẢN PHẨM & TỒN KHO
// ==========================================
export const adminSanPhams = ref([])

const defaultProducts = [
  { name: 'Trà Sữa Trân Châu', price: 35000, img: '/images/ts1.jpg', category: 'tra-sua', tonKho: 15 },
  { name: 'Trà Sữa Matcha', price: 40000, img: '/images/ts2.jpg', category: 'tra-sua', tonKho: 5 },
  { name: 'Cafe Đen Đá', price: 25000, img: '/images/cf1.jpg', category: 'cafe', tonKho: 0 },
  { name: 'Bạc Xỉu', price: 30000, img: '/images/cf2.jpg', category: 'cafe', tonKho: 20 },
]

export const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') return adminSanPhams.value
  return adminSanPhams.value.filter(sp => sp.category === activeCategory.value)
})

export const showFormSP = ref(false)
export const isEditSP = ref(false)
export const formSP = ref({ id: null, name: '', price: 0, img: '', category: '', tonKho: 0 })

export const huyFormSP = () => { showFormSP.value = false; isEditSP.value = false; formSP.value = { id: null, name: '', price: 0, img: '', category: dsDanhMuc.value[0]?.id || '', tonKho: 0 } }

export const layDuLieuSanPham = async () => { 
  try { 
    const res = await fetch(API_SANPHAM)
    if (res.ok) { 
      const data = await res.json() 
      if (data.length === 0) {
        for (const item of defaultProducts) {
          await fetch(API_SANPHAM, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
        }
        const res2 = await fetch(API_SANPHAM)
        if (res2.ok) adminSanPhams.value = await res2.json()
      } else {
        adminSanPhams.value = data 
      }
    } 
  } catch (e) { console.log("Chưa kết nối được API Sản phẩm") } 
}
layDuLieuSanPham()

export const luuSanPham = async () => {
  if (!formSP.value.name) return alert('Vui lòng nhập tên sản phẩm!')
  if (formSP.value.price <= 0) return alert('Giá bán phải lớn hơn 0!')
  if (formSP.value.tonKho < 0) return alert('Số lượng tồn kho không được âm!')
  if (!formSP.value.category) return alert('Vui lòng chọn danh mục!')

  const isEdit = isEditSP.value
  const data = {
    name: formSP.value.name,
    price: Number(formSP.value.price),
    img: formSP.value.img,
    category: formSP.value.category,
    tonKho: Number(formSP.value.tonKho)
  }

  try {
    const url = isEdit ? `${API_SANPHAM}/${formSP.value.id}` : API_SANPHAM
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    
    if (res.ok) { 
      await layDuLieuSanPham()
      alert(isEdit ? 'Cập nhật thành công!' : 'Thêm sản phẩm mới thành công!')
      huyFormSP() 
    } else { alert('Lỗi MockAPI!') }
  } catch (e) { alert('Lỗi kết nối mạng!') }
}

export const xoaSanPham = async (id) => {
  if (!confirm('Xóa món này khỏi hệ thống?')) return
  try { 
    const res = await fetch(`${API_SANPHAM}/${id}`, { method: 'DELETE' })
    if (res.ok) { await layDuLieuSanPham() } 
  } catch (e) { alert('Lỗi kết nối mạng!') }
}

export const suaSanPham = (item) => { showFormSP.value = true; isEditSP.value = true; formSP.value = { ...item } }

// ==========================================
// 3. QUẢN LÝ GIỎ HÀNG & THANH TOÁN
// ==========================================
export const cart = ref([])
export const addToCart = (product) => {
  if (product.tonKho <= 0) return alert('Sản phẩm này hiện đang hết hàng!')
  const existingItem = cart.value.find((item) => matchId(item.id, product.id))
  if (existingItem) {
    if (existingItem.quantity >= product.tonKho) return alert(`Chỉ còn ${product.tonKho} sản phẩm trong kho!`)
    existingItem.quantity++
  } else { cart.value.push({ ...product, quantity: 1 }) }
}
export const removeFromCart = (index) => {
  if (cart.value[index].quantity > 1) cart.value[index].quantity--
  else cart.value.splice(index, 1)
}
export const handleCheckout = async () => {
  if (cart.value.length === 0) return
  try {
    for (const cartItem of cart.value) {
      const spKho = adminSanPhams.value.find(sp => sp.id === cartItem.id)
      if (spKho) {
        const newTonKho = spKho.tonKho - cartItem.quantity
        await fetch(`${API_SANPHAM}/${cartItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tonKho: newTonKho })
        })
      }
    }
    await layDuLieuSanPham() 
    alert('Đặt hàng thành công! Kho trên server đã tự động trừ số lượng.')
    cart.value = []
  } catch(e) { alert('Có lỗi xảy ra khi đồng bộ kho!') }
}
export const totalAmount = computed(() => cart.value.reduce((t, i) => t + i.price * i.quantity, 0))
export const totalItemsInCart = computed(() => cart.value.reduce((t, i) => t + i.quantity, 0))

// ==========================================
// 4. LOGIC QUẢN LÝ TÀI KHOẢN (API USERS) & BLACKLIST
// ==========================================
export const regUsername = ref(''); export const regEmail = ref(''); export const regPhone = ref(''); export const regPassword = ref(''); export const regConfirmPassword = ref(''); export const registeredUsers = ref([])

export const layDuLieuUsers = async () => { try { const res = await fetch(API_USERS); if (res.ok) registeredUsers.value = await res.json() } catch (e) {} }
layDuLieuUsers() 

export const handleRegister = async () => {
  if (!regUsername.value || !regEmail.value || !regPhone.value || !regPassword.value) return alert('Vui lòng nhập đủ thông tin!')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.value)) return alert('Email không hợp lệ!')
  if (!/^0[0-9]{9}$/.test(regPhone.value)) return alert('Số điện thoại phải gồm 10 số bắt đầu bằng 0!')
  if (regPassword.value.length < 6) return alert('Mật khẩu phải từ 6 ký tự trở lên!')
  if (regPassword.value !== regConfirmPassword.value) return alert('Mật khẩu không khớp!')
  
  if (registeredUsers.value.find(u => u.user === regUsername.value || u.email === regEmail.value || u.phone === regPhone.value)) return alert('Tài khoản, Email hoặc Số điện thoại này đã được sử dụng!')

  // Khi tạo mới, mặc định isBlacklisted = false
  const newUser = { 
    user: regUsername.value, 
    pass: regPassword.value, 
    email: regEmail.value, 
    phone: regPhone.value,
    isBlacklisted: false 
  }

  try {
    const res = await fetch(API_USERS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) })
    if (res.ok) { alert('Đăng ký thành công! Mời bạn đăng nhập.'); await layDuLieuUsers(); currentView.value = 'login' } else { alert('Lỗi API MockAPI!') }
  } catch (error) { alert('Lỗi kết nối mạng!') }
}

export const handleLogin = () => {
  const isNewUser = registeredUsers.value.find(u => (u.user === username.value || u.email === username.value || u.phone === username.value) && u.pass === password.value)
  
  if (username.value === 'admin' && password.value === '123') { 
    currentView.value = 'admin' 
  } 
  else if ((username.value === 'kh123' && password.value === '123') || isNewUser) { 
    // Kiểm tra Blacklist trước khi cho vào
    if (isNewUser && isNewUser.isBlacklisted) {
      return alert('🚫 TÀI KHOẢN CỦA BẠN ĐÃ BỊ KHÓA! Vui lòng liên hệ Admin của BEEPHE để biết thêm chi tiết.')
    }
    
    if (isNewUser) currentUserProfile.value = { ...isNewUser }
    currentView.value = 'client' 
  } 
  else { alert('Sai thông tin tài khoản hoặc mật khẩu!') }
}

export const handleLogout = () => { if (confirm('Bạn có chắc chắn muốn đăng xuất?')) { currentView.value = 'login'; username.value = ''; password.value = '' } }

// ==========================================
// 5. QUẢN LÝ KHÁCH HÀNG (XEM & BLACKLIST)
// ==========================================
export const showDetailKH = ref(false)
export const selectedKH = ref({ id: null, user: '', email: '', phone: '', isBlacklisted: false })

export const dongChiTietKH = () => { 
  showDetailKH.value = false; 
  selectedKH.value = { id: null, user: '', email: '', phone: '', isBlacklisted: false } 
}

export const xemKhachHang = (item) => { 
  showDetailKH.value = true; 
  selectedKH.value = { ...item } 
}

// Hàm Khóa / Mở khóa tài khoản
export const toggleBlacklist = async (user) => {
  const newStatus = !user.isBlacklisted;
  const actionName = newStatus ? 'KHÓA' : 'MỞ KHÓA';
  
  if (!confirm(`Bạn chắc chắn muốn ${actionName} tài khoản "${user.user}"?`)) return;

  try {
    const res = await fetch(`${API_USERS}/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlacklisted: newStatus })
    })
    
    if (res.ok) {
      await layDuLieuUsers() // Cập nhật lại danh sách
      alert(`${actionName} tài khoản thành công!`)
      if (showDetailKH.value) dongChiTietKH() // Đóng form chi tiết nếu đang mở
    } else {
      alert(`Lỗi API khi ${actionName} tài khoản!`)
    }
  } catch (e) { alert('Lỗi kết nối mạng!') }
}

// Lịch sử Hóa đơn
export const dsHoaDon = ref([{ id: 'HD001', ngay: '2026-03-23', khach: 'Khách lẻ', tong: 35000, tra: 35000 }])
export const showFormHD = ref(false); export const isEditHD = ref(false); export const formHD = ref({ id: null, ngay: '', khach: '', tong: 0, tra: 0 })
export const huyFormHD = () => { showFormHD.value = false; isEditHD.value = false; formHD.value = { id: null, ngay: '', khach: '', tong: 0, tra: 0 } }
export const luuHoaDon = () => {
  if(!formHD.value.ngay || formHD.value.tong < 0) return alert('Dữ liệu không hợp lệ!')
  const isEdit = isEditHD.value; const data = isEdit ? { ...formHD.value } : { ...formHD.value, id: getNextIdHD(dsHoaDon.value) }
  if (isEdit) { const idx = dsHoaDon.value.findIndex((x) => matchId(x.id, data.id)); if (idx !== -1) dsHoaDon.value[idx] = { ...data } } else dsHoaDon.value.push(data)
  huyFormHD()
}
export const xoaHoaDon = (id) => { if (!confirm('Xóa hóa đơn?')) return; dsHoaDon.value = dsHoaDon.value.filter((x) => !matchId(x.id, id)) }
export const suaHoaDon = (item) => { showFormHD.value = true; isEditHD.value = true; formHD.value = { ...item } }

// ==========================================
// 6. PROFILE & QUÊN MẬT KHẨU
// ==========================================
export const forgotEmail = ref('')
export const handleForgotPassword = () => {
  if (!forgotEmail.value) return alert('Vui lòng nhập Email!')
  alert(`Đã gửi yêu cầu cấp lại mật khẩu vào email "${forgotEmail.value}".`); currentView.value = 'login'; forgotEmail.value = ''
}
export const currentUserProfile = ref({ user: 'Khách Hàng VIP', phone: '0987654321', email: 'khach@gmail.com' })
export const handleUpdateProfile = () => {
  if (!currentUserProfile.value.user || !currentUserProfile.value.phone) return alert('Vui lòng điền đủ thông tin!')
  alert('Cập nhật thành công!'); currentView.value = 'client' 
}
export const oldPassword = ref(''); export const newPassword = ref(''); export const confirmNewPassword = ref('')
export const handleChangePassword = () => {
  if (!oldPassword.value || newPassword.value.length < 6 || newPassword.value !== confirmNewPassword.value) return alert('Mật khẩu không hợp lệ!')
  alert('Đổi mật khẩu thành công!'); oldPassword.value = ''; newPassword.value = ''; confirmNewPassword.value = '';
}