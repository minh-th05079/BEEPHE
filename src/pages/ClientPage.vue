<script setup>
import { dsTraSua, dsCafe, addToCart } from '../store.js'
</script>

<template>
  <div>
    <div class="position-relative text-center">
      <img src="/images/banner.jpg" class="w-100" style="height: 350px; object-fit: cover;">
      <div class="position-absolute top-50 start-50 translate-middle text-white p-4" style="background: rgba(0,0,0,0.5); border-radius: 15px;">
        <h1 class="display-4 fw-bold">BEEPHE</h1>
        <p class="fs-4">Đã uống là phải “phê”</p>
      </div>
    </div>

    <div class="container my-5">
      <section id="tra-sua" class="mb-5 pt-4">
        <h3 class="text-primary border-bottom border-primary border-3 pb-2 mb-4">🧋 Các Loại Trà Sữa</h3>
        <div class="row g-4">
          <div class="col-6 col-md-3" v-for="item in dsTraSua" :key="item.id">
            <div class="card h-100 shadow-sm border-0">
              <img :src="item.img" class="card-img-top p-2" style="height: 180px; object-fit: contain;">
              <div class="card-body text-center">
                <h5 class="fs-6">{{ item.name }}</h5>
                <p class="text-danger fw-bold">{{ item.price.toLocaleString() }}đ</p>
                <button @click="addToCart(item)" class="btn btn-primary btn-sm w-100">+ Thêm</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cafe" class="mb-5 pt-4">
        <h3 class="text-primary border-bottom border-primary border-3 pb-2 mb-4">☕ Cafe Truyền Thống</h3>
        <div class="row g-4">
          <div class="col-6 col-md-3" v-for="item in dsCafe" :key="item.id">
            <div class="card h-100 shadow-sm border-0">
              <img :src="item.img" class="card-img-top p-2" style="height: 180px; object-fit: contain;">
              <div class="card-body text-center">
                <h5 class="fs-6">{{ item.name }}</h5>
                <p class="text-danger fw-bold">{{ item.price.toLocaleString() }}đ</p>
                <button @click="addToCart(item)" class="btn btn-primary btn-sm w-100">+ Thêm</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>