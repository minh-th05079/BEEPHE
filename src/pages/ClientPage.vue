<script setup>
import { dsTraSua, dsCafe, addToCart, activeCategory } from '../store.js'
</script>

<template>
  <div>
    <div class="position-relative text-center">
      <img src="/images/banner.jpg" class="w-100" style="height: 350px; object-fit: cover;">
      <div class="position-absolute top-50 start-50 translate-middle p-4" style="background: rgba(78, 52, 46, 0.85); border-radius: 15px; border: 2px solid #f5b041;">
        <h1 class="display-4 fw-bold" style="color: #f5b041;">BEEPHE</h1>
        <p class="fs-4 text-white">Đã uống là phải “phê”</p>
      </div>
    </div>

    <div class="container my-4 text-center">
      <div class="btn-group shadow-sm">
        <button @click="activeCategory = 'all'" :class="['btn fw-bold', activeCategory === 'all' ? 'btn-primary' : 'btn-light']">Tất cả</button>
        <button @click="activeCategory = 'tra-sua'" :class="['btn fw-bold', activeCategory === 'tra-sua' ? 'btn-primary' : 'btn-light']">🧋 Trà Sữa</button>
        <button @click="activeCategory = 'cafe'" :class="['btn fw-bold', activeCategory === 'cafe' ? 'btn-primary' : 'btn-light']">☕ Cafe</button>
      </div>
    </div>

    <div class="container my-5">
      <section v-if="activeCategory === 'all' || activeCategory === 'tra-sua'" id="tra-sua" class="mb-5 pt-2">
        <h3 class="text-primary border-bottom border-primary border-3 pb-2 mb-4">🧋 Các Loại Trà Sữa</h3>
        <div class="row g-4">
          <div class="col-6 col-md-3" v-for="item in dsTraSua" :key="item.id">
            <div class="card bg-white h-100 shadow-sm">
              <img :src="item.img" class="card-img-top p-2" style="height: 180px; object-fit: contain;">
              <div class="card-body text-center">
                <h5 class="fs-6 fw-bold">{{ item.name }}</h5>
                <p class="text-primary fw-bold">{{ item.price.toLocaleString() }}đ</p>
                <button @click="addToCart(item)" class="btn btn-primary btn-sm w-100">+ Thêm</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="activeCategory === 'all' || activeCategory === 'cafe'" id="cafe" class="mb-5 pt-2">
        <h3 class="text-primary border-bottom border-primary border-3 pb-2 mb-4">☕ Cafe Truyền Thống</h3>
        <div class="row g-4">
          <div class="col-6 col-md-3" v-for="item in dsCafe" :key="item.id">
            <div class="card bg-white h-100 shadow-sm">
              <img :src="item.img" class="card-img-top p-2" style="height: 180px; object-fit: contain;">
              <div class="card-body text-center">
                <h5 class="fs-6 fw-bold">{{ item.name }}</h5>
                <p class="text-primary fw-bold">{{ item.price.toLocaleString() }}đ</p>
                <button @click="addToCart(item)" class="btn btn-primary btn-sm w-100">+ Thêm</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>