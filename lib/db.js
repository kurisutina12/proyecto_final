const mysql = require('mysql2');

const connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'pokemon12',
    database: 'tienda'
});

connection.connect((error)=>{

    if(error){
        console.log(error);
    }else{
        console.log('MySQL conectado');
    }
});

module.exports = connection;