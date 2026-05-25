<template>

  <div>

<nav class="nav">

  <router-link to="/login">
    Login
  </router-link>

  <router-link to="/register">
    Registro
  </router-link>

  <router-link to="/products">
    Productos
  </router-link>

  <router-link to="/cart">
    Carrito
  </router-link>

  <router-link to="/orders">
    Pedidos
  </router-link>

  <router-link
    v-if="isAdmin"
    to="/admin/products"
  >
    Admin
  </router-link>

</nav>

<router-view />

  </div>

</template>

<script>

export default {

  computed: {

    isAdmin() {

      return localStorage.getItem('role_id') == 1

    }

  }

}

</script>

<style>

body{
  font-family: Arial;
  margin:0;
  background:#f2f2f2;
}

.nav{
  background:#222;
  padding:15px;
}

.nav a{
  color:white;
  margin-right:15px;
  text-decoration:none;
}

.container{
  width:80%;
  margin:auto;
  margin-top:30px;
}

.card{
  background:white;
  padding:20px;
  margin-bottom:15px;
  border-radius:10px;
}

input{
  width:100%;
  padding:10px;
  margin-top:10px;
}

button{
  margin-top:10px;
  padding:10px 20px;
  cursor:pointer;
}

</style>
