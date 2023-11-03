const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database_test'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

module.exports = connection;  
// const connectDb = async () => {
//     const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: '10680'
//     });
//     return connection;
//   }
  
// connectDb;
