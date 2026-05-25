const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const adminMiddleware = require('../middleware/admin');

const pool = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');


// =========================
// REGISTER
// =========================

router.post('/sign-up', userMiddleware.validateRegister, (req, res) => {

  pool.query(
    'SELECT id FROM users WHERE LOWER(username)=LOWER(?)',
    [req.body.username],
    (err, result) => {

      if (result && result.length) {

        return res.status(409).send({
          message: 'This username is already in use!'
        });

      }

      bcrypt.hash(req.body.password, 10, (err, hash) => {

        if (err) {

          return res.status(500).send({
            message: err
          });

        }

        pool.query(
            `   INSERT INTO users
            (username,email,password,role_id)
            VALUES(?,?,?,?)
            `,
            [
            req.body.username,
            req.body.email,
            hash,
            2
            ],
          (err, result) => {

                if (err) {

                
                console.log(err);

                return res.status(500).send({
                message: err
                });
                

                }


            return res.status(201).send({
              message: 'Registered!'
            });

          }
        );

      });

    }
  );

});


// =========================
// LOGIN
// =========================

router.post('/login', (req, res) => {

  pool.query(
    'SELECT * FROM users WHERE username=?',
    [req.body.username],
    (err, result) => {

      if (err) {

        return res.status(400).send({
          message: err
        });

      }

      if (!result.length) {

        return res.status(400).send({
          message: 'Username or password incorrect!'
        });

      }

      bcrypt.compare(
    req.body.password,
    result[0].password,
    (bErr,bResult)=>{

        console.log('PASSWORD ENVIADO:', req.body.password);
        console.log('HASH DB:', result[0].password);
        console.log('COMPARE:', bResult);

        if(bErr || !bResult){

            return res.status(400).send({
                message:'Password incorrecto'
            });

        }

        const token = jwt.sign({

            username:result[0].username,
            userId:result[0].id,
            role_id:result[0].role_id

        },
        process.env.JWT_SECRET,
        {
            expiresIn:'7d'
        });

        return res.status(200).send({

            message:'Logged in!',
            token,

            user:{
                id:result[0].id,
                username:result[0].username,
                role_id:result[0].role_id
            }

        });

    }
        );

    }
  );

});


// =========================
// GET PRODUCTS
// =========================

router.get(
'/products',
(req,res)=>{

console.log('TOKEN:', req.headers.authorization);

pool.query(
    'SELECT * FROM products',
    (err,result)=>{

        console.log('SQL ERROR:', err);

        if(err){

            return res.status(500).send({
                error:err.message
            });

        }

        return res.status(200).send(result);

    }
);

});


// =========================
// SEARCH PRODUCTS
// =========================

router.get(
'/products/search',
userMiddleware.isLoggedIn,
(req,res)=>{

    const q = req.query.q;

    pool.query(
        'SELECT * FROM products WHERE nombre LIKE ?',
        [`%${q}%`],
        (err,result)=>{

            if(err){

                return res.status(500).send({
                    message:'Error buscando productos'
                });

            }

            return res.status(200).send(result);

        }
    );

});


// =========================
// CREATE PRODUCT
// =========================

router.post(
'/products',
userMiddleware.isLoggedIn,
adminMiddleware,
(req,res)=>{

    const {
        nombre,
        precio
    } = req.body;

    pool.query(
        'INSERT INTO products(nombre,precio) VALUES(?,?)',
        [nombre,precio],
        (err,result)=>{

            if(err){

                console.log(err);

                return res.status(500).send({
                message: err
                });

            }


            return res.status(201).send({
                message:'Producto agregado'
            });

        }
    );

});


// =========================
// UPDATE PRODUCT
// =========================

router.put(
'/products/:id',
userMiddleware.isLoggedIn,
adminMiddleware,
(req,res)=>{

    const {
        nombre,
        precio
    } = req.body;

    pool.query(
        'UPDATE products SET nombre=?, precio=? WHERE id=?',
        [
            nombre,
            precio,
            req.params.id
        ],
        (err,result)=>{

            if(err){

                console.log(err);

                return res.status(500).send({
                message: err
                });

            }

            return res.status(200).send({
                message:'Producto actualizado'
            });

        }
    );

});


// =========================
// CREATE COMPLETE ORDER
// =========================

router.post(
'/orders',
userMiddleware.isLoggedIn,
(req,res)=>{

    const productos = req.body.productos;

    if(!productos || productos.length === 0){

        return res.status(400).send({
            message:'Debe enviar productos'
        });

    }

    let total = 0;

    pool.query(
        'INSERT INTO orders(user_id,total,confirmado) VALUES(?,?,?)',
        [
            req.userData.userId,
            0,
            1
        ],
        (err,result)=>{

            if(err){

                console.log(err);

                return res.status(500).send({
                message: err
                });

            }

            const orderId = result.insertId;

            let procesados = 0;

            productos.forEach((item)=>{

                pool.query(
                    'SELECT * FROM products WHERE id=?',
                    [item.product_id],
                    (err,productResult)=>{

                        if(productResult.length === 0){

                            procesados++;

                            return;

                        }

                        const product = productResult[0];

                        const subtotal =
                            product.precio * item.cantidad;

                        total += subtotal;

                        pool.query(
                            `
                            INSERT INTO order_details
                            (order_id,product_id,cantidad,subtotal)
                            VALUES(?,?,?,?)
                            `,
                            [
                                orderId,
                                item.product_id,
                                item.cantidad,
                                subtotal
                            ],
                            ()=>{}
                        );

                        procesados++;

                        if(procesados === productos.length){

                            pool.query(
                                'UPDATE orders SET total=? WHERE id=?',
                                [total,orderId]
                            );

                            return res.status(201).send({
                                message:'Pedido creado',
                                orderId
                            });

                        }

                    }
                );

            });

        }
    );

});


// =========================
// GET ORDERS
// =========================

router.get(
'/orders',
userMiddleware.isLoggedIn,
(req,res)=>{

    pool.query(
        `
        SELECT
            orders.id,
            orders.total,
            orders.confirmado,
            products.nombre,
            order_details.cantidad,
            order_details.subtotal
        FROM orders
        INNER JOIN order_details
            ON orders.id = order_details.order_id
        INNER JOIN products
            ON products.id = order_details.product_id
        WHERE orders.user_id=?
        `,
        [req.userData.userId],
        (err,result)=>{

            if(err){

                console.log(err);

                return res.status(500).send({
                message: err
                });

            }

            return res.status(200).send(result);

        }
    );

});


// =========================
// GET USERS
// =========================

router.get(
'/users',
userMiddleware.isLoggedIn,
adminMiddleware,
(req,res)=>{

    pool.query(
        `
        SELECT
            id,
            username,
            role_id,
            registered
        FROM users
        `,
        (err,result)=>{

            if(err){

                console.log(err);

                return res.status(500).send({
                message: err
                });

            }

            return res.status(200).send(result);

        }
    );

});

module.exports = router;