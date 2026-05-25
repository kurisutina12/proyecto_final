<template>

  <div class="container">

<div class="card">

  <h1>Mis pedidos</h1>

</div>

<div
  class="card"
  v-for="order in orders"
  :key="order.id"
>

  <h2>Pedido #{{ order.id }}</h2>

  <p>
    Producto:
    {{ order.nombre }}
  </p>

  <p>
    Cantidad:
    {{ order.cantidad }}
  </p>

  <p>
    Subtotal:
    $ {{ order.subtotal }}
  </p>

  <h3>
    Total pedido:
    $ {{ order.total }}
  </h3>

</div>

  </div>

</template>

<script>

import axios from 'axios'

export default {

  data(){

    return{

      orders:[]

    }

  },

  methods:{

    async getOrders(){

      try{

        const response = await axios.get(

          'http://localhost:3000/api/orders',

          {

            headers:{

              authorization:
              'Bearer ' +
              localStorage.getItem('token')

            }

          }

        )

        this.orders = response.data

      }catch(error){

        console.log(error)

      }

    }

  },

  mounted(){

    this.getOrders()

  }

}

</script>

<style scoped>

.container{

  width:80%;
  margin:auto;
  margin-top:30px;

}

.card{

  background:white;
  padding:20px;
  margin-bottom:20px;
  border-radius:10px;
  box-shadow:0 0 10px rgba(0,0,0,0.1);

}

h1{

  margin:0;

}

</style>