<template>
<div class="container">

  <div class="card">


<h1>Productos</h1>

<input
  v-model="search"
  placeholder="Buscar producto"
>

<button @click="searchProducts">
  Buscar
</button>


  </div>

  <div
    class="card"
    v-for="product in products"
    :key="product.id"
  >


<h2>{{ product.nombre }}</h2>

<h3>$ {{ product.precio }}</h3>

<button @click="addToCart(product)">
  Agregar al carrito
</button>


  </div>

</div>
</template>

<script>

import axios from 'axios'

export default{

  data(){

    return{

      products:[],
      search:''

    }

  },

  methods:{

    async getProducts(){

      const response = await axios.get(
        'http://localhost:3000/api/products',
        {
          headers:{
            Authorization:
            `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      this.products = response.data

    },

    async searchProducts(){

      const response = await axios.get(
        `http://localhost:3000/api/products/search?q=${this.search}`,
        {
          headers:{
          authorization:
          'Bearer ' + localStorage.getItem('token')
          }

        }
      )

      this.products = response.data

    },

    addToCart(product){

      let cart =
        JSON.parse(localStorage.getItem('cart')) || []

      const found =
        cart.find(p=>p.id === product.id)

      if(found){

        found.cantidad++

      }else{

        cart.push({
          ...product,
          cantidad:1
        })

      }

      localStorage.setItem(
        'cart',
        JSON.stringify(cart)
      )

      alert('Producto agregado')

    }

  },

  mounted(){

    this.getProducts()

  }

}
</script>
