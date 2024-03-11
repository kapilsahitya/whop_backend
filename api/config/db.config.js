require ('dotenv').config();
const mysql = require("mysql");

//For Local DB
// console.log('check',process.env.db_port);

// var connection = mysql.createConnection({
//     host: process.env.db_host,
//     port: process.env.db_port,
//     user: process.env.db_user,
//     password: process.env.db_password,
//     database: process.env.db_database,
//     multipleStatements: true,
//     // socketPath: process.env.instance_connection
// });

var pool = mysql.createPool({
  connectionLimit : 1000,
  connectTimeout  : 60 * 60 * 1000,
  acquireTimeout  : 60 * 60 * 1000,
  timeout         : 60 * 60 * 1000,
  host: process.env.db_host,
  port: process.env.db_port,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database,
  // multipleStatements: true,
  // socketPath: process.env.instance_connection
});



// connection.connect(function (err) {
//     if (err) {
//       console.log(err);
//       console.log(`Error occured while connecting to helpApp`);
//     } else {
//       console.log(`Successfully connected to DB`);
//     }
//   });





module.exports = pool;
