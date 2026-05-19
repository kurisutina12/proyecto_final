const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const adminMiddleware = require('../middleware/admin');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

// http://localhost:3000/sign-up
router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    'SELECT id FROM users WHERE LOWER(username) = LOWER(?)',
    [req.body.username],
    (err, result) => {
      if (result && result.length) {
        // error
        return res.status(409).send({
          message: 'This username is already in use!',
        });
      } else {
        // username not in use
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              message: err,
            });
          } else {
            db.query(
              'INSERT INTO users (id, username, password, registered) VALUES (?, ?, ?, now());',
              [uuid.v4(), req.body.username, hash],
              (err, result) => {
                if (err) {
                  return res.status(400).send({
                    message: err,
                  });
                }
                return res.status(201).send({
                  message: 'Registered!',
                });
              }
            );
          }
        });
      }
    }
  );
});

// http://localhost:3000/api/login
router.post('/login', (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE username = ?;`,
    [req.body.username],
    (err, result) => {
      if (err) {
        return res.status(400).send({
          message: err,
        });
      }
      if (!result.length) {
        return res.status(400).send({
          message: 'Username or password incorrect!',
        });
      }

      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          if (bErr) {
            return res.status(400).send({
              message: 'Username or password incorrect!',
            });
          }
          if (bResult) {
            // password match
            const token = jwt.sign(
            {
              username: result[0].username,
              userId: result[0].id,
              role: result[0].role_id === 1 ? 'ADMIN' : 'CLIENT'
            },
            'SECRETKEY',
            { expiresIn: '7d' }
            );
            db.query(`UPDATE users SET last_login = now() WHERE id = ?;`, [
              result[0].id,
            ]);
            return res.status(200).send({
              message: 'Logged in!',
              token,
              user: result[0],
            });
          }
          return res.status(400).send({
            message: 'Username or password incorrect!',
          });
        }
      );
    }
  );
});

// http://localhost:3000/api/secret-route
router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is secret content!');
});

router.get(
'/products',
userMiddleware.isLoggedIn,
(req,res)=>{
      console.log('ENTRO A PRODUCTS');

    db.query(
        'SELECT * FROM products',
        (err,result)=>{

            if(err){
                return res.status(400).send(err);
            }

            return res.status(200).send(result);
        }
    );
});

router.get(
'/products/search',
userMiddleware.isLoggedIn,
(req,res)=>{

    const q = req.query.q;

    db.query(
        'SELECT * FROM products WHERE nombre LIKE ?',
        [`%${q}%`],
        (err,result)=>{

            if(err){
                return res.status(400).send(err);
            }

            return res.status(200).send(result);
        }
    );
});

router.post(
'/products',
userMiddleware.isLoggedIn,
adminMiddleware,
(req,res)=>{

    const {
        nombre,
        precio
    } = req.body;

    db.query(
        'INSERT INTO products(nombre,precio) VALUES(?,?)',
        [nombre,precio],
        (err,result)=>{

            if(err){
                return res.status(400).send(err);
            }

            return res.status(201).send({
                message:'Producto agregado'
            });
        }
    );
});

router.put(
'/products/:id',
userMiddleware.isLoggedIn,
adminMiddleware,
(req,res)=>{

    const {
        nombre,
        precio
    } = req.body;

    db.query(
        'UPDATE products SET nombre=?, precio=? WHERE id=?',
        [
            nombre,
            precio,
            req.params.id
        ],
        (err,result)=>{

            if(err){
                return res.status(400).send(err);
            }

            return res.status(200).send({
                message:'Producto actualizado'
            });
        }
    );
});

router.post(
'/orders',
userMiddleware.isLoggedIn,
(req,res)=>{

    const {
        total,
        confirmado
    } = req.body;

    db.query(
        'INSERT INTO orders(user_id,total,confirmado) VALUES(?,?,?)',
        [
            req.userData.userId,
            total,
            confirmado
        ],
        (err,result)=>{

            if(err){
                return res.status(400).send(err);
            }

            return res.status(201).send({
                message:'Pedido creado',
                orderId: result.insertId
            });
        }
    );
});

router.post(
'/order-details',
userMiddleware.isLoggedIn,
(req,res)=>{

    const {
        order_id,
        product_id,
        cantidad,
        subtotal
    } = req.body;

    db.query(
        `INSERT INTO order_details
        (order_id,product_id,cantidad,subtotal)
        VALUES(?,?,?,?)`,
        [
            order_id,
            product_id,
            cantidad,
            subtotal
        ],
        (err,result)=>{

            if(err){
                return res.status(400).send(err);
            }

            return res.status(201).send({
                message:'Detalle agregado'
            });
        }
    );
});

router.get(
'/orders',
userMiddleware.isLoggedIn,
(req,res)=>{

    db.query(
        'SELECT * FROM orders WHERE user_id=?',
        [req.userData.userId],
        (err,result)=>{

            if(err){
                return res.status(400).send(err);
            }

            return res.status(200).send(result);
        }
    );
});

router.get(
'/users',
userMiddleware.isLoggedIn,
adminMiddleware,
(req,res)=>{

    db.query(
        'SELECT * FROM users',
        (err,result)=>{

            if(err){
                return res.status(400).send(err);
            }

            return res.status(200).send(result);
        }
    );
});
module.exports = router;