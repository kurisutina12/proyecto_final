// src/views/Home.vue

<template>
<div>

    <h1>Productos</h1>

    <div
    v-for="product in products"
    :key="product.id"
    >

        <h3>{{product.nombre}}</h3>

        <p>${{product.precio}}</p>

    </div>

</div>
</template>

<script>

import AuthService from '@/services/AuthService';

export default {

    data(){
        return{
            products:[]
        }
    },

    mounted(){
        this.getProducts();
    },

    methods:{

        async getProducts(){

            this.products =
            await AuthService.getProducts();
        }
    }
}
</script>