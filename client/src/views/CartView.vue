<template>
<div class="container">

  <div class="card">


<h1>Carrito</h1>


  </div>

  <div
    class="card"
    v-for="item in cart"
    :key="item.id"
  >


<h2>{{ item.nombre }}</h2>

<h3>$ {{ item.precio }}</h3>

<p>Cantidad: {{ item.cantidad }}</p>


  </div>

  <div class="card">


<h2>Total: $ {{ total }}</h2>

<button @click="checkout">
  Comprar
</button>


  </div>

</div>
</template>

<script>

import axios from 'axios'

export default{

  data(){

    return{

      cart:[]

    }

  },

  computed:{

    total(){

      return this.cart.reduce(
        (acc,item)=>
          acc + (item.precio * item.cantidad),
        0
      )

    }

  },

  methods:{

    async checkout(){

      const productos = this.cart.map(item=>({

        product_id:item.id,
        cantidad:item.cantidad

      }))

      try{

        await axios.post(
          'http://localhost:3000/api/orders',
          {
            productos
          },
          {
            headers:{
            authorization:
            'Bearer ' + localStorage.getItem('token')
            }

          }
        )

        alert('Pedido realizado')

        localStorage.removeItem('cart')

        this.cart=[]

      }catch(error){

        alert('Error realizando pedido')

      }

    }

  },

  mounted(){

    this.cart =
      JSON.parse(localStorage.getItem('cart')) || []

  }

}
</script>
