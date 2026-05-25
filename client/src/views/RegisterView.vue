<template>
<div class="container">

  <div class="card">

<h1>Registro</h1>

<input
  v-model="username"
  placeholder="Username"
>

<input
  v-model="email"
  placeholder="Email"
>

<input
  v-model="password"
  type="password"
  placeholder="Password"
>

<input
  v-model="password_repeat"
  type="password"
  placeholder="Repeat Password"
>

<button @click="register">
  Registrarse
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
      email:'',
      password:'',
      password_repeat:''

    }

  },

  methods:{

    async register(){

      try{

        await axios.post(
          'http://localhost:3000/api/sign-up',
          {

            username:this.username,
            email:this.email,
            password:this.password,
            password_repeat:this.password_repeat

          }
        )

        alert('Usuario creado')

        this.$router.push('/login')

      }catch(error){

        console.log(error.response.data)

        alert(
          JSON.stringify(error.response.data)
        )

      }

    }

  }

}
</script>