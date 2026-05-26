<template>
<div class="container">

  <div class="card">

<h1>Login</h1>

<input
  v-model="username"
  placeholder="Username"
>

<input
  v-model="password"
  type="password"
  placeholder="Password"
>

<button @click="login">
  Ingresar
</button>


  </div>

</div>
</template>

<script>

import axios from 'axios'

export default{

  data(){

    return{

      username:'',
      password:''

    }

  },

  methods:{

    async login(){

      try{

        const response = await axios.post(
          'http://localhost:3000/api/login',
          {

            username:this.username,
            password:this.password

          }
        )

        localStorage.setItem(
          'token',
          response.data.token
        )

        localStorage.setItem(
          'role_id',
          response.data.user.role_id
        )

        console.log(
          response.data.user.role_id
        )

      }catch(error){

        alert('Error login')

      }

    }

  }

}
</script>
