<template>
<div class="container">

  <div class="card">

<h1>Agregar producto</h1>

<input
  v-model="nombre"
  placeholder="Nombre"
>

<input
  v-model="precio"
  placeholder="Precio"
  type="number"
>

<button @click="createProduct">
  Guardar
</button>

  </div>

</div>
</template>

<script>

import axios from 'axios'

export default{

  data(){

    return{

      nombre:'',
      precio:''

    }

  },

  methods:{

    async createProduct(){
    console.log(
      localStorage.getItem('role_id')
    )

    console.log(
      localStorage.getItem('token')
    )

      try{

        await axios.post(
          'http://localhost:3000/api/products',
          {
            nombre:this.nombre,
            precio:this.precio
          },
          {
            headers:{
            authorization:
            'Bearer ' + localStorage.getItem('token')
            }

          }
        )

        alert('Producto agregado')

        this.nombre=''
        this.precio=''

      }catch(error){

        console.log(error.response.data)

        alert('Error')

      }

    }

  }

}
</script>
