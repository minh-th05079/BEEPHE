import { ref, computed } from 'vue'

const API_SANPHAM = 'https://69a1c98a2e82ee536fa237c4.mockapi.io/sanpham'
const API_USERS = 'https://69a1c98a2e82ee536fa237c4.mockapi.io/users'
const API_DANHMUC = 'https://698042e46570ee87d50e8e0c.mockapi.io/danhmuc'
const API_HOADON = 'https://698042e46570ee87d50e8e0c.mockapi.io/hoadon'
const API_MAGIAMGIA = 'https://69d34ed0336103955f8ec9e6.mockapi.io/magiamgia'

const matchId = (id1, id2) => String(id1) === String(id2)

const beepheChannel = new BroadcastChannel('beephe_sync_channel')
beepheChannel.onmessage = (event) => {
  if (event.data === 'UPDATE_SANPHAM') layDuLieuSanPham()
  if (event.data === 'UPDATE_HOADON') layDuLieuHoaDon()
  if (event.data === 'UPDATE_DANHMUC') layDuLieuDanhMuc()
  if (event.data === 'UPDATE_USERS') layDuLieuUsers() 
  if (event.data === 'UPDATE_MAGIAMGIA') layDuLieuMaGiamGia() 
}

setInterval(() => {
  layDuLieuSanPham()
  layDuLieuHoaDon()
  layDuLieuUsers() 
  layDuLieuMaGiamGia() 
}, 15000)

export const currentView = ref('client')
export const adminTab = ref('san-pham')
export const username = ref('')
export const password = ref('')

export const activeCategory = ref('all')
export const searchQuery = ref('')

export const adminDanhMuc = ref([])
export const dsDanhMuc = computed(() => adminDanhMuc.value.filter(dm => !dm.ngungPhucVu)) 

export const searchDanhMuc = ref('') 
export const showFormDM = ref(false)
export const isEditDM = ref(false)
export const formDM = ref({ name: '' }) 

export const filteredDanhMuc = computed(() => {
  if (!searchDanhMuc.value.trim()) return adminDanhMuc.value
  const keyword = searchDanhMuc.value.toLowerCase().trim()
  return adminDanhMuc.value.filter(dm => dm.name.toLowerCase().includes(keyword))
})

export const huyFormDM = () => {
  showFormDM.value = false
  isEditDM.value = false
  formDM.value = { name: '' }
}

export const layDuLieuDanhMuc = async () => {
  try {
    const res = await fetch(API_DANHMUC)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) adminDanhMuc.value = data
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

  try {
    const url = isEdit ? `${API_DANHMUC}/${formDM.value.id}` : API_DANHMUC
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      await layDuLieuDanhMuc()
      beepheChannel.postMessage('UPDATE_DANHMUC') 
      huyFormDM()
    } else {
      alert('Lỗi khi lưu danh mục trên API!')
    }
  } catch (e) {
    alert('Lỗi mạng!')
  }
}

export const xoaDanhMuc = async (id) => {
  const dm = adminDanhMuc.value.find(d => String(d.id) === String(id))
  if (!dm) return
  if (!confirm('Xác nhận NGỪNG PHỤC VỤ danh mục này? (Sẽ bị ẩn khỏi menu của khách)')) return
  const dataUpdate = { ...dm, ngungPhucVu: true }
  try {
    const res = await fetch(`${API_DANHMUC}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate)
    })
    if (res.ok) {
      await layDuLieuDanhMuc()
      beepheChannel.postMessage('UPDATE_DANHMUC') 
    }
  } catch (e) {
    alert('Lỗi kết nối!')
  }
}

export const phucHoiDanhMuc = async (id) => {
  const dm = adminDanhMuc.value.find(d => String(d.id) === String(id))
  if (!dm) return
  if (!confirm('Xác nhận MỞ LẠI danh mục này?')) return
  const dataUpdate = { ...dm, ngungPhucVu: false }
  try {
    const res = await fetch(`${API_DANHMUC}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate)
    })
    if (res.ok) {
      await layDuLieuDanhMuc()
      beepheChannel.postMessage('UPDATE_DANHMUC') 
    }
  } catch (e) {
    alert('Lỗi kết nối!')
  }
}

export const suaDanhMuc = (dm) => {
  showFormDM.value = true
  isEditDM.value = true
  formDM.value = { ...dm }
}

export const adminSanPhams = ref([])

export const filteredProducts = computed(() => {
  if (!Array.isArray(adminSanPhams.value)) return []
  let result = adminSanPhams.value.filter(sp => !sp.ngungBan) 

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
export const formSP = ref({ 
  id: null, name: '', price: 0, img: '', category: '', moTa: '', 
  sizes: [ { ten: 'Mặc định', phuThu: 0, tonKho: 10 } ], 
  danhGia: [], tuyChinhDong: [], ngungBan: false 
})

export const huyFormSP = () => {
  showFormSP.value = false
  isEditSP.value = false
  formSP.value = {
    id: null, name: '', price: 0, img: '', category: dsDanhMuc.value[0]?.id || 'tra-sua', 
    moTa: '', sizes: [ { ten: 'Mặc định', phuThu: 0, tonKho: 10 } ], 
    danhGia: [], tuyChinhDong: [], ngungBan: false
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
  if (!formSP.value.name || formSP.value.price <= 0 || !formSP.value.category) 
    return alert('Dữ liệu không hợp lệ!')
  const isEdit = isEditSP.value
  const data = {
    name: formSP.value.name, price: Number(formSP.value.price), img: formSP.value.img, category: formSP.value.category,
    moTa: formSP.value.moTa,
    sizes: Array.isArray(formSP.value.sizes) && formSP.value.sizes.length > 0 ?
      formSP.value.sizes : [{ ten: 'Mặc định', phuThu: 0, tonKho: 0 }],
    danhGia: formSP.value.danhGia || [],
    tuyChinhDong: formSP.value.tuyChinhDong || [],
    ngungBan: formSP.value.ngungBan || false
  }
  try {
    const res = await fetch(isEdit ? `${API_SANPHAM}/${formSP.value.id}` : API_SANPHAM, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      await layDuLieuSanPham()
      beepheChannel.postMessage('UPDATE_SANPHAM') 
      huyFormSP()
    } else alert('Lỗi MockAPI!')
  } catch (e) {
    alert('Lỗi mạng!')
  }
}

export const xoaSanPham = async (id) => {
  const sp = adminSanPhams.value.find(s => String(s.id) === String(id))
  if (!sp) return
  if (!confirm('Xác nhận NGỪNG BÁN sản phẩm này? (Sẽ ẩn khỏi trang khách)')) return
  
  const dataUpdate = { ...sp, ngungBan: true }
  try {
    const res = await fetch(`${API_SANPHAM}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate)
    })
    if (res.ok) {
      await layDuLieuSanPham()
      beepheChannel.postMessage('UPDATE_SANPHAM') 
      alert('Đã chuyển sản phẩm sang trạng thái Ngừng bán!')
    }
  } catch (e) { alert('Lỗi mạng!') }
}

export const toggleTrangThaiSanPham = async (id) => {
  const sp = adminSanPhams.value.find(s => String(s.id) === String(id))
  if (!sp) return
  const dataUpdate = { ...sp, ngungBan: false } 
  try {
    const res = await fetch(`${API_SANPHAM}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate)
    })
    if (res.ok) {
      await layDuLieuSanPham()
      beepheChannel.postMessage('UPDATE_SANPHAM') 
      alert('Đã mở bán lại sản phẩm thành công!')
    }
  } catch (e) {}
}

export const suaSanPham = (item) => {
  showFormSP.value = true
  isEditSP.value = true
  const deepCopiedItem = JSON.parse(JSON.stringify(item))
  
  if (!Array.isArray(deepCopiedItem.sizes) || deepCopiedItem.sizes.length === 0) {
      deepCopiedItem.sizes = [
         { ten: 'Size S', phuThu: 0, tonKho: deepCopiedItem.tonKhoS || 0 },
         { ten: 'Size M', phuThu: 5000, tonKho: deepCopiedItem.tonKhoM || 0 },
         { ten: 'Size L', phuThu: 10000, tonKho: deepCopiedItem.tonKhoL || 0 }
      ]
  }
  formSP.value = { ...deepCopiedItem }
  if (!formSP.value.tuyChinhDong) formSP.value.tuyChinhDong = []
}

export const reviewText = ref('')
export const reviewRating = ref(5)

export const submitReview = async (productId) => {
  if (!currentUserProfile.value.id) {
    alert('Vui lòng đăng nhập để đánh giá!')
    return false
  }
  
  const checkBan = registeredUsers.value.find(u => String(u.id) === String(currentUserProfile.value.id))
  if (checkBan && checkBan.isBlacklisted) {
    alert('Tài khoản của bạn đã bị khóa, không thể gửi đánh giá!')
    handleLogout(true) 
    return false
  }

  if (!reviewText.value.trim()) {
    alert('Vui lòng nhập nội dung đánh giá!')
    return false
  }

  const spGoc = adminSanPhams.value.find(s => String(s.id) === String(productId))
  if (!spGoc) return false

  const newReview = {
    user: currentUserProfile.value.user,
    rating: reviewRating.value,
    comment: reviewText.value.trim(),
    date: new Date().toLocaleDateString('vi-VN')
  }

  const updatedDanhGia = [...(spGoc.danhGia || []), newReview]
  const dataUpdate = { ...spGoc, danhGia: updatedDanhGia }

  try {
    const res = await fetch(`${API_SANPHAM}/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate)
    })

    if (res.ok) {
      await layDuLieuSanPham()
      beepheChannel.postMessage('UPDATE_SANPHAM') 
      reviewText.value = ''
      reviewRating.value = 5
      return true
    } else {
      alert('Lỗi cập nhật trên hệ thống!')
      return false
    }
  } catch (e) {
    alert('Lỗi kết nối mạng!')
    return false
  }
}

export const dsMaGiamGia = ref([])
export const showFormMGG = ref(false)
export const isEditMGG = ref(false)
export const formMGG = ref({ id: '', code: '', giamGia: 0, isActive: true })

export const layDuLieuMaGiamGia = async () => {
  try {
    const res = await fetch(API_MAGIAMGIA)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) dsMaGiamGia.value = data
    }
  } catch (e) {}
}
layDuLieuMaGiamGia()

export const luuMaGiamGia = async () => {
  if (!formMGG.value.code || formMGG.value.giamGia <= 0) return alert('Dữ liệu không hợp lệ!')
  const isEdit = isEditMGG.value
  const data = { ...formMGG.value, giamGia: Number(formMGG.value.giamGia) }
  try {
    const res = await fetch(isEdit ? `${API_MAGIAMGIA}/${formMGG.value.id}` : API_MAGIAMGIA, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      await layDuLieuMaGiamGia()
      beepheChannel.postMessage('UPDATE_MAGIAMGIA') 
      showFormMGG.value = false
    }
  } catch (e) {}
}

export const toggleTrangThaiMaGiamGia = async (id) => {
  const mgg = dsMaGiamGia.value.find(m => String(m.id) === String(id))
  if (!mgg) return
  const actionName = mgg.isActive ? 'VÔ HIỆU HÓA' : 'KÍCH HOẠT'
  if (!confirm(`Xác nhận ${actionName} mã này?`)) return
  const dataUpdate = { ...mgg, isActive: !mgg.isActive }
  try {
    const res = await fetch(`${API_MAGIAMGIA}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate)
    })
    if (res.ok) {
      await layDuLieuMaGiamGia()
      beepheChannel.postMessage('UPDATE_MAGIAMGIA') 
    }
  } catch (e) {}
}

export const suaMaGiamGia = (item) => {
  showFormMGG.value = true
  isEditMGG.value = true
  formMGG.value = { ...item }
}

export const huyFormMGG = () => {
  showFormMGG.value = false
  isEditMGG.value = false
  formMGG.value = { id: '', code: '', giamGia: 0, isActive: true }
}

export const cart = ref([])
export const phuongThucThanhToan = ref('COD')
export const maGiamGiaNhap = ref('')
export const maGiamGiaApDung = ref(null)
export const phiShip = ref(30000)
export const diaChiGiaoHang = ref('')

export const apDungMaGiamGia = async () => {
  await layDuLieuMaGiamGia()

  const mgg = dsMaGiamGia.value.find(
    (m) => m.code.toUpperCase() === maGiamGiaNhap.value.toUpperCase() && m.isActive,
  )
  if (mgg) {
    maGiamGiaApDung.value = mgg
    alert('Áp dụng mã giảm giá thành công!')
  } else {
    maGiamGiaApDung.value = null
    alert('Mã giảm giá không hợp lệ hoặc đã bị vô hiệu hóa!')
  }
}

const getStockSafe = (product, sizeName) => {
  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    const sizeObj = product.sizes.find(s => s.ten === sizeName)
    if (sizeObj) return Number(sizeObj.tonKho || 0)
  }
  if (sizeName === 'Size S') return Number(product.tonKhoS || 0)
  if (sizeName === 'Size M') return Number(product.tonKhoM || 0)
  if (sizeName === 'Size L') return Number(product.tonKhoL || 0)
  return 0
}

export const addToCart = (product, qty = 1) => {
  const currentStock = getStockSafe(product, product.selectedSizeName)
  if (currentStock <= 0) return alert('Hết hàng Size này!')
  const item = cart.value.find((i) => matchId(i.id, product.id) && i.name === product.name && JSON.stringify(i.cartOptions) === JSON.stringify(product.cartOptions))
  const totalThisProductInCart = cart.value
    .filter((i) => matchId(i.id, product.id) && i.name === product.name && JSON.stringify(i.cartOptions) === JSON.stringify(product.cartOptions))
    .reduce((sum, i) => sum + i.quantity, 0)

  if (totalThisProductInCart + qty > currentStock)
    return alert(`Kho Size này chỉ còn ${currentStock} sản phẩm!`)

  if (item) {
    item.quantity += qty
  } else {
    cart.value.push({ ...product, quantity: qty })
  }
}

export const increaseCartItem = (index) => {
  const item = cart.value[index]
  const spGoc = adminSanPhams.value.find((s) => matchId(s.id, item.id))
  const currentStock = spGoc ? getStockSafe(spGoc, item.selectedSizeName) : 0
  const totalThisProductInCart = cart.value
    .filter((i) => matchId(i.id, item.id) && i.name === item.name && JSON.stringify(i.cartOptions) === JSON.stringify(item.cartOptions))
    .reduce((sum, i) => sum + i.quantity, 0)

  if (spGoc && totalThisProductInCart >= currentStock) {
    return alert(`Kho Size này chỉ còn ${currentStock} sản phẩm!`)
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

export const updateCartItemQuantity = (index, newQuantity) => {
  let qty = parseInt(newQuantity, 10)
  const item = cart.value[index]
  if (!item) return
  if (isNaN(qty) || qty < 1) {
    item.quantity = 1
    return
  }
  const spGoc = adminSanPhams.value.find((s) => matchId(s.id, item.id))
  const currentStock = spGoc ? getStockSafe(spGoc, item.selectedSizeName) : 0
  if (spGoc && qty > currentStock) {
    alert(`Kho Size này chỉ còn ${currentStock} sản phẩm!`)
    item.quantity = currentStock
  } else {
    item.quantity = qty
  }
}

export const removeCartItem = (index) => {
  cart.value.splice(index, 1)
}

export const tienGiamHangKhach = computed(() => {
  if (!currentUserProfile.value || !currentUserProfile.value.loaiKhach) return 0
  const tongTienHang = totalAmount.value
  if (currentUserProfile.value.loaiKhach === 'VIP') return tongTienHang * 0.1 
  if (currentUserProfile.value.loaiKhach === 'Quen') return tongTienHang * 0.05 
  return 0 
})

export const handleCheckout = async () => {
  if (cart.value.length === 0) return
  if (!currentUserProfile.value.id) {
    alert('Vui lòng đăng nhập để tiến hành đặt món và theo dõi đơn hàng!')
    currentView.value = 'login'
    return
  }

  const checkBan = registeredUsers.value.find(u => String(u.id) === String(currentUserProfile.value.id))
  if (checkBan && checkBan.isBlacklisted) {
    alert('Tài khoản của bạn đã bị khóa, không thể tiến hành đặt hàng!')
    handleLogout(true)
    return
  }

  const sdtChot = currentUserProfile.value.phone || 'Chưa cập nhật' 
  const diaChiChot = diaChiGiaoHang.value
  
  if (!diaChiChot) {
    alert('Vui lòng nhập Địa chỉ giao hàng!');
    return;
  }

  if (maGiamGiaApDung.value) {
    await layDuLieuMaGiamGia();
    const checkLạiMGG = dsMaGiamGia.value.find(m => String(m.id) === String(maGiamGiaApDung.value.id));
    if (!checkLạiMGG || !checkLạiMGG.isActive) {
      alert('Rất tiếc! Mã giảm giá bạn áp dụng vừa bị hệ thống vô hiệu hóa. Vui lòng thanh toán lại với giá mới.');
      maGiamGiaApDung.value = null;
      return;
    }
  }

  try {
    for (const item of cart.value) {
      const sp = adminSanPhams.value.find((s) => String(s.id) === String(item.id))
      if (sp && item.selectedSizeName) {
        if (Array.isArray(sp.sizes) && sp.sizes.length > 0) {
            const sizeIndex = sp.sizes.findIndex(sz => sz.ten === item.selectedSizeName)
            if (sizeIndex !== -1) {
              sp.sizes[sizeIndex].tonKho = Number(sp.sizes[sizeIndex].tonKho) - item.quantity
              await fetch(`${API_SANPHAM}/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sp),
              })
            }
        }
      }
    }
    const tienGiamMGG = maGiamGiaApDung.value ? maGiamGiaApDung.value.giamGia : 0
    const tongTienGiam = tienGiamMGG + tienGiamHangKhach.value
    const tongThanhToan = totalAmount.value + phiShip.value - tongTienGiam
    const d = new Date()
    const strNgay = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    
    const newOrder = {
      ngay: strNgay,
      khachId: currentUserProfile.value.id || 'guest',
      khach: currentUserProfile.value.user || 'Khách vãng lai',
      sdt: sdtChot,            
      diaChi: diaChiChot,      
      email: currentUserProfile.value.email || 'Không có',
      tong: tongThanhToan > 0 ? tongThanhToan : 0,
      trangThai: 'Chờ xác nhận',
      chiTiet: cart.value.map((i) => {
        const opts = i.cartOptions ? Object.entries(i.cartOptions).map(([k,v]) => `${k==='size'?'Size':''}${v}`).join(', ') : '';
        return `${i.name} [${opts}] (SL: ${i.quantity})`
      }).join('; '),
      danhSachMon: cart.value,
      phuongThucThanhToan: phuongThucThanhToan.value,
      maGiamGia: maGiamGiaApDung.value ? maGiamGiaApDung.value.code : 'Không có',
      tienGiam: tongTienGiam,
      tienShip: phiShip.value,
      lyDoHuy: '' 
    }
    await fetch(API_HOADON, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    })
    await layDuLieuSanPham()
    await layDuLieuHoaDon()
    beepheChannel.postMessage('UPDATE_SANPHAM') 
    beepheChannel.postMessage('UPDATE_HOADON')  
    alert('Đặt hàng thành công! Đơn hàng đang chờ xác nhận.')
    
    cart.value = []
    maGiamGiaNhap.value = ''
    maGiamGiaApDung.value = null
    phuongThucThanhToan.value = 'COD'
    diaChiGiaoHang.value = ''
    currentView.value = 'client'
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

export const regUsername = ref('')
export const regEmail = ref('')
export const regPhone = ref('')
export const regPassword = ref('')
export const regConfirmPassword = ref('')
export const registeredUsers = ref([])

export const currentUserProfile = ref({
  id: null, user: '', phone: '', email: '', pass: '', loaiKhach: 'Thường', tongChiTieu: 0, thongBao: []
})

export const layDuLieuUsers = async () => {
  try {
    const res = await fetch(API_USERS)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        registeredUsers.value = data
        
        if (currentUserProfile.value.id && currentUserProfile.value.id !== 'guest' && currentUserProfile.value.id !== 'test') {
          const checkBan = data.find(u => String(u.id) === String(currentUserProfile.value.id))
          if (checkBan && checkBan.isBlacklisted) {
            alert('Phiên đăng nhập hết hạn do tài khoản của bạn đã bị Quản trị viên khóa!')
            handleLogout(true) 
          } else if (checkBan) {
            // Cập nhật dữ liệu mới nhất (thông báo, hạng, chi tiêu) vào phiên đăng nhập
            currentUserProfile.value.thongBao = checkBan.thongBao || []
            currentUserProfile.value.loaiKhach = checkBan.loaiKhach || 'Thường'
            currentUserProfile.value.tongChiTieu = checkBan.tongChiTieu || 0
          }
        }
      }
    }
  } catch (e) {}
}
layDuLieuUsers()

export const tinhLaiTongChiTieu = async (khachId) => {
  if (!khachId || khachId === 'guest' || khachId === 'test') return
  const userIndex = registeredUsers.value.findIndex((u) => String(u.id) === String(khachId))
  if (userIndex === -1) return
  const userGoc = registeredUsers.value[userIndex]
  const tongTienDuyet = dsHoaDon.value
    .filter((hd) => String(hd.khachId) === String(khachId) && hd.trangThai === 'Hoàn thành')
    .reduce((sum, hd) => sum + Number(hd.tong), 0)

  let loaiMoiThucTe = 'Thường'
  if (tongTienDuyet >= 1000000) loaiMoiThucTe = 'VIP'
  else if (tongTienDuyet >= 500000) loaiMoiThucTe = 'Quen'

  const capBac = { Thường: 1, Quen: 2, VIP: 3 }
  let loaiChot = userGoc.loaiKhach || 'Thường'

  if (capBac[loaiMoiThucTe] > capBac[loaiChot]) {
    loaiChot = loaiMoiThucTe
  }

  if (userGoc.tongChiTieu !== tongTienDuyet || userGoc.loaiKhach !== loaiChot) {
    const dataUpdate = { ...userGoc, tongChiTieu: tongTienDuyet, loaiKhach: loaiChot }
    try {
      const res = await fetch(`${API_USERS}/${khachId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataUpdate),
      })
      if (res.ok) {
        registeredUsers.value[userIndex].tongChiTieu = tongTienDuyet
        registeredUsers.value[userIndex].loaiKhach = loaiChot
        if (currentUserProfile.value.id && String(currentUserProfile.value.id) === String(khachId)) {
          currentUserProfile.value.tongChiTieu = tongTienDuyet
          currentUserProfile.value.loaiKhach = loaiChot
        }
        beepheChannel.postMessage('UPDATE_USERS')
      }
    } catch (e) {
      console.log('Lỗi cập nhật hạng:', e)
    }
  }
}

export const handleRegister = async () => {
  if (!regUsername.value || !regEmail.value || !regPhone.value || !regPassword.value)
    return alert('Vui lòng nhập đủ thông tin!')
  if (!Array.isArray(registeredUsers.value)) return alert('Đang tải dữ liệu, vui lòng thử lại!')
  if (
    registeredUsers.value.find(
      (u) => u.user === regUsername.value || u.email === regEmail.value || u.phone === regPhone.value,
    )
  )
    return alert('Thông tin đã tồn tại!')
  try {
    const res = await fetch(API_USERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: regUsername.value, pass: regPassword.value, email: regEmail.value, phone: regPhone.value,
        isBlacklisted: false, loaiKhach: 'Thường', tongChiTieu: 0, thongBao: []
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
    (u) => (String(u.user) === uName || String(u.email) === uName || String(u.phone) === uName) && String(u.pass) === uPass,
  )
  if (uName === 'admin' && uPass === '123') {
    currentView.value = 'admin'
  } else if (isNewUser) {
    if (isNewUser.isBlacklisted)
      return alert('🚫 TÀI KHOẢN CỦA BẠN ĐÃ BỊ KHÓA! Vui lòng liên hệ Admin.')
    currentUserProfile.value = { ...isNewUser, thongBao: isNewUser.thongBao || [] }
    currentView.value = 'client'
  } else if (uName === 'kh123' && uPass === '123') {
    currentUserProfile.value = {
      id: 'test', user: 'Khách Test', phone: '0912345678', email: 'test@gmail.com', pass: '123', loaiKhach: 'Thường', tongChiTieu: 0, thongBao: []
    }
    currentView.value = 'client'
  } else {
    alert('Sai thông tin tài khoản hoặc mật khẩu!')
  }
}

export const handleLogout = (force = false) => {
  if (force || confirm('Đăng xuất?')) {
    currentView.value = 'client'
    username.value = ''
    password.value = ''
    currentUserProfile.value = {
      id: null, user: '', phone: '', email: '', pass: '', loaiKhach: 'Thường', tongChiTieu: 0, thongBao: []
    }
  }
}

export const xoaThongBao = async (index) => {
  if (!currentUserProfile.value.id || !currentUserProfile.value.thongBao) return
  currentUserProfile.value.thongBao.splice(index, 1)
  const userGoc = registeredUsers.value.find((u) => String(u.id) === String(currentUserProfile.value.id))
  if (!userGoc) return
  const userUpdate = { ...userGoc, thongBao: currentUserProfile.value.thongBao }
  try {
    await fetch(`${API_USERS}/${currentUserProfile.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userUpdate),
    })
    await layDuLieuUsers()
  } catch (e) {
    console.log(e)
  }
}

export const capNhatLoaiKhach = async (userId, loaiMoi) => {
  const userGoc = registeredUsers.value.find((u) => String(u.id) === String(userId))
  if (!userGoc) return
  const dataUpdate = { ...userGoc, loaiKhach: loaiMoi }
  try {
    const res = await fetch(`${API_USERS}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate),
    })
    if (res.ok) {
      await layDuLieuUsers()
      alert('Đã cập nhật loại khách hàng thành công!')
    }
  } catch (e) {
    alert('Lỗi cập nhật loại khách!')
  }
}

export const showDetailKH = ref(false)
export const selectedKH = ref({ id: null, user: '', email: '', phone: '', isBlacklisted: false })
export const searchKhachHang = ref('')

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
  const dataUpdate = { ...user, isBlacklisted: newStatus }
  try {
    const res = await fetch(`${API_USERS}/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate),
    })
    if (res.ok) {
      await layDuLieuUsers()
      beepheChannel.postMessage('UPDATE_USERS') 
      alert('Thành công!')
      if (showDetailKH.value) dongChiTietKH()
    }
  } catch (e) {
    alert('Lỗi kết nối mạng!')
  }
}

export const filteredKhachHang = computed(() => {
  if (!searchKhachHang.value.trim()) return registeredUsers.value
  const keyword = searchKhachHang.value.toLowerCase().trim()
  return registeredUsers.value.filter(
    (kh) => String(kh.user).toLowerCase().includes(keyword) || String(kh.email).toLowerCase().includes(keyword) || String(kh.phone || '').toLowerCase().includes(keyword),
  )
})

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

export const capNhatTrangThaiHoaDon = async (id, trangThaiMoi, customReason = '') => {
  const hdGoc = dsHoaDon.value.find((h) => String(h.id) === String(id))
  if (!hdGoc) return false
  const currentStatus = hdGoc.trangThai
  if (currentStatus === 'Hoàn thành' || currentStatus === 'Đã hủy') {
    alert('Đơn hàng này đã kết thúc, không thể cập nhật trạng thái nữa!')
    return false
  }
  const order = ['Chờ xác nhận', 'Đang làm', 'Đang giao', 'Hoàn thành']
  const currentIndex = order.indexOf(currentStatus)
  const newIndex = order.indexOf(trangThaiMoi)
  if (trangThaiMoi !== 'Đã hủy' && newIndex <= currentIndex) {
    alert('Không thể lùi trạng thái đơn hàng về trước đó!')
    return false
  }
  
  let lyDoHuy = ''
  if (trangThaiMoi === 'Đã hủy') {
    if (customReason) {
      lyDoHuy = customReason
    } else {
       const inputReason = prompt('Vui lòng nhập lý do hủy đơn:', 'Tôi muốn thay đổi đơn hàng')
       if (inputReason === null) return false
       lyDoHuy = inputReason || 'Khách hàng tự hủy'
    }
  } else {
    if (!confirm(`Xác nhận đổi đơn hàng này sang trạng thái: "${trangThaiMoi}"?`)) return false
  }
  
  const dataUpdate = { ...hdGoc, trangThai: trangThaiMoi, lyDoHuy: lyDoHuy }
  try {
    const res = await fetch(`${API_HOADON}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate),
    })
    
    if (res.ok) {
      const hdIndex = dsHoaDon.value.findIndex((h) => String(h.id) === String(id))
      if (hdIndex !== -1) {
        dsHoaDon.value[hdIndex].trangThai = trangThaiMoi
        dsHoaDon.value[hdIndex].lyDoHuy = lyDoHuy
      }
      await layDuLieuHoaDon()
      beepheChannel.postMessage('UPDATE_HOADON')
      
      // Tạo thông báo mới
      if (hdGoc.khachId && hdGoc.khachId !== 'guest' && hdGoc.khachId !== 'test') {
        const userGoc = registeredUsers.value.find(u => String(u.id) === String(hdGoc.khachId))
        if (userGoc) {
          const d = new Date()
          const strNgay = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
          
          let noiDungTB = `Đơn hàng #${id} của bạn đã được cập nhật trạng thái thành: ${trangThaiMoi}`
          if (trangThaiMoi === 'Đã hủy') {
              noiDungTB += `. Lý do: ${lyDoHuy}`
          }

          const newThongBao = {
            id: Date.now(),
            thoiGian: strNgay,
            noiDung: noiDungTB
          }
          const userUpdate = { ...userGoc, thongBao: [...(userGoc.thongBao || []), newThongBao] }
          
          // Cập nhật local array ngay lập tức để tránh lỗi bất đồng bộ của MockAPI đè mất thông báo
          const uIdx = registeredUsers.value.findIndex(u => String(u.id) === String(userGoc.id))
          if (uIdx !== -1) registeredUsers.value[uIdx].thongBao = userUpdate.thongBao

          await fetch(`${API_USERS}/${userGoc.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userUpdate),
          })
          
          await layDuLieuUsers()
          beepheChannel.postMessage('UPDATE_USERS') // Báo cho tab Khách hàng tải lại thông báo!

          if (String(currentUserProfile.value.id) === String(userGoc.id)) {
             currentUserProfile.value.thongBao = userUpdate.thongBao
          }
        }
      }
      
      const hdUpdated = dsHoaDon.value.find((h) => String(h.id) === String(id))
      if (hdUpdated && hdUpdated.khachId) {
        await tinhLaiTongChiTieu(hdUpdated.khachId)
      }
      return true
    }
  } catch (e) {
    alert('Lỗi kết nối!')
  }
  return false
}

export const handleUpdateProfile = async () => {
  if (!currentUserProfile.value.user || !currentUserProfile.value.phone)
    return alert('Vui lòng điền đủ thông tin!')
  const userGoc = currentUserProfile.value
  const dataUpdate = { ...userGoc, user: userGoc.user, phone: userGoc.phone, email: userGoc.email }
  try {
    const res = await fetch(`${API_USERS}/${currentUserProfile.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate),
    })
    if (res.ok) {
      alert('Cập nhật thông tin lên hệ thống thành công!')
      await layDuLieuUsers()
      beepheChannel.postMessage('UPDATE_USERS')
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
  if (!oldPassword.value || !newPassword.value || !confirmNewPassword.value) return alert('Nhập đủ thông tin!')
  if (oldPassword.value !== currentUserProfile.value.pass) return alert('Mật khẩu cũ không chính xác!')
  if (newPassword.value.length < 6) return alert('Mật khẩu mới phải từ 6 ký tự!')
  if (newPassword.value !== confirmNewPassword.value) return alert('Mật khẩu xác nhận không khớp!')
  const userGoc = currentUserProfile.value
  const dataUpdate = { ...userGoc, pass: newPassword.value }
  try {
    const res = await fetch(`${API_USERS}/${currentUserProfile.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate),
    })
    if (res.ok) {
      alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.')
      oldPassword.value = ''
      newPassword.value = ''
      confirmNewPassword.value = ''
      await layDuLieuUsers()
      beepheChannel.postMessage('UPDATE_USERS')
      handleLogout(true)
    }
  } catch (e) {
    alert('Lỗi kết nối MockAPI!')
  }
}

export const forgotStep = ref(1)
export const forgotUsername = ref('')
export const forgotContact = ref('')
export const forgotOtpInput = ref('')
export const generatedOtp = ref('')
export const userToReset = ref(null)
export const forgotNewPass = ref('')
export const forgotConfirmPass = ref('')

export const checkForgotUsername = () => {
  if (!forgotUsername.value) return alert('Vui lòng nhập tên tài khoản!')
  const user = registeredUsers.value.find((u) => u.user === forgotUsername.value.trim())
  if (user) {
    userToReset.value = user
    forgotStep.value = 2 
  } else {
    alert('Không tìm thấy tài khoản này trong hệ thống!')
  }
}

export const checkForgotContact = () => {
  const contact = forgotContact.value.trim()
  if (!contact) return alert('Vui lòng nhập Email hoặc Số điện thoại!')
  if (contact === userToReset.value.email || contact === userToReset.value.phone) {
    generatedOtp.value = Math.floor(100000 + Math.random() * 900000).toString()
    alert(`[THÔNG BÁO MÔ PHỎNG] Mã OTP của bạn là: ${generatedOtp.value}`)
    forgotStep.value = 3 
  } else {
    alert('Thông tin liên hệ không khớp với tài khoản này!')
  }
}

export const verifyForgotOtp = () => {
  if (forgotOtpInput.value === generatedOtp.value) {
    forgotStep.value = 4 
  } else {
    alert('Mã OTP không chính xác!')
  }
}

export const resetPasswordSubmit = async () => {
  if (forgotNewPass.value.length < 6) return alert('Mật khẩu mới phải từ 6 ký tự!')
  if (forgotNewPass.value !== forgotConfirmPass.value) return alert('Mật khẩu xác nhận không khớp!')
  const dataUpdate = { ...userToReset.value, pass: forgotNewPass.value }
  try {
    const res = await fetch(`${API_USERS}/${userToReset.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUpdate),
    })
    if (res.ok) {
      alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.')
      await layDuLieuUsers()
      beepheChannel.postMessage('UPDATE_USERS')
      huyForgotPassword() 
    } else {
      alert('Lỗi cập nhật trên MockAPI!')
    }
  } catch (e) {
    alert('Lỗi mạng!')
  }
}

export const huyForgotPassword = () => {
  forgotStep.value = 1
  forgotUsername.value = ''
  forgotContact.value = ''
  forgotOtpInput.value = ''
  generatedOtp.value = ''
  userToReset.value = null
  forgotNewPass.value = ''
  forgotConfirmPass.value = ''
  currentView.value = 'login'
}