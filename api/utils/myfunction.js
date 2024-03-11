var CryptoJS = require("crypto-js");
const ENC_KEY = process.env.ENC_KEY;
// const db = require("../config/db.config");
const pool = require("../config/db.config");
const enc = require("../utils/myencrypt");

module.exports = {


  ////////////////////////*****************CRUD CODE----------------------



  getdata: function (params) {
    return new Promise(function (resolve, reject) {

      if (!params.tableName || !params.columns) {
        var res = { status: 0, message: "Missing required fields in the params" };
        resolve(res);
      }
      const tableName = params.tableName;
      const columns = params.columns;
      let whereClause = ' 1 ';
      let limitClause = '  LIMIT 100';
      let resultx;

      if (params.where && params.where != "") {
        whereClause = params.where.join(' AND ');
      }

      if (params.limit && params.limit > 0) {
        limitClause = '  LIMIT ' + params.limit;
      }



      let joinClause = '';
      if (params.join) {
        joinClause = params.join.join(' ');
      }

      let subqry = '';
      if (params.subqry) {
        subqry = params.subqry;
      }


      const qry = `SELECT ${columns} 
                            ${subqry}  
                          FROM ${tableName} 
                          ${joinClause} 
                          WHERE ${whereClause} 
                          ${limitClause}`;
      // console.log('------'); 
      // console.log(qry); 
      // console.log('--++--'); 

      pool.getConnection(function (err, connection) {
        if (err) {
          // connection.release();
          throw err;
        }
        connection.query(qry, function (err, result) {
          // connection.release();
          if (err) {
            var res = { status: 0, message: "error occured", error: err };
            resolve(res);
          } else {
            if (params.is_single && params.is_single == 1) {
              resultx = result[0];
            } else {
              resultx = result;
            }
            var res = {
              status: 1,
              message: "Data fetched successfully",
              data: enc.encrypt_obj(resultx),
              datax: resultx,
              //qry: qry,
            };
            resolve(res);
          }
        });
        connection.on('error', function (err) {
          throw err;
          return;
        });
      });
      // db.query(qry, (err, result) => {
      //     // console.log('------'); 
      //     // console.log(result); 
      //     // console.log('--++--'); 
      //       if (err) {
      //         var res={ status: 0, message: "error occured", error: err };
      //          resolve(res);
      //       } else {
      //         if (params.is_single && params.is_single==1) {
      //           resultx = result[0];
      //         }else{
      //           resultx = result;
      //         }
      //         var res={
      //               status: 1,
      //               message: "Data fetched successfully",
      //               data: enc.encrypt_obj(resultx),
      //               datax: resultx,
      //               //qry: qry,
      //           };
      //           resolve(res);
      //       }
      //   })
    })
  },


  adddata: function (params) {
    return new Promise(function (resolve, reject) {
      if (!params.tableName || !params.input_columns) {
        var res = { status: 0, message: "Missing required fields in the params" };
        resolve(res);
      }
      const tableName = params.tableName;
      const data = params.input_data;
      pool.getConnection(function (err, connection) {
        if (err) {
          connection.release();
          throw err;
        }
        connection.query(`INSERT INTO   ${tableName}  SET ?`, data, (err, result) => {
          if (err) {
            var res = { status: 0, message: "error occured", error: err };
            resolve(res);
          } else {
            var res = {
              status: 1,
              message: "Data inserted successfully.",
              lastInsertId: result.insertId
            };
            resolve(res);
          }
        })
        connection.on('error', function (err) {
          throw err;
          return;
        });
      });
      // db.query(`INSERT INTO   ${tableName}  SET ?`, data, (err, result) => {
      //   if (err) {
      //     var res = { status: 0, message: "error occured", error: err };
      //     resolve(res);
      //   } else {
      //     var res = {
      //       status: 1,
      //       message: "Data inserted successfully.",
      //       lastInsertId: result.insertId
      //     };
      //     resolve(res);
      //   }
      // })
    })
  },


  deldata: function (params) {
    return new Promise(function (resolve, reject) {
      if (!params.tableName || !params.del_id) {
        var res = { status: 0, message: "Missing required fields in the params" };
        resolve(res);
      }
      const tableName = params.tableName;
      const del_id = params.del_id;
      pool.getConnection(function (err, connection) {
        if (err) {
          connection.release();
          throw err;
        }
        connection.query(`DELETE FROM   ${tableName} WHERE id = ?`, del_id, (err, result) => {
            if (err) {
              var res = { status: 0, message: "error occured", error: err };
              resolve(res);
            } else {
              var res = {
                status: 1,
                message: "Data deleted successfully.",
              };
              resolve(res);
            }
          })
        connection.on('error', function (err) {
          throw err;
          return;
        });
      });
      // db.query(`DELETE FROM   ${tableName} WHERE id = ?`, del_id, (err, result) => {
      //   if (err) {
      //     var res = { status: 0, message: "error occured", error: err };
      //     resolve(res);
      //   } else {
      //     var res = {
      //       status: 1,
      //       message: "Data deleted successfully.",
      //     };
      //     resolve(res);
      //   }
      // })
    })
  },








  ////////////////////////*****************CRUX CODE----------------------




  getsingledata: function (params) {
    return new Promise(function (resolve, reject) {

      if (!params.tableName || !params.columns) {
        var res = { status: 0, message: "Missing required fields in the params" };
        resolve(res);
      }
      const tableName = params.tableName;
      const columns = params.columns;
      let whereClause = ' 1 ';
      if (params.where) {
        whereClause = params.where.join(' AND ');
      }
      let joinClause = '';
      if (params.join) {
        joinClause = params.join.join(' ');
      }
      const qry = `SELECT ${columns} FROM ${tableName} ${joinClause} WHERE ${whereClause}`;

      pool.getConnection(function (err, connection) {
        if (err) {
          connection.release();
          throw err;
        }
        connection.query(qry, (err, result) => {
            // console.log('------');
            // console.log(result);
            // console.log('--++--');
            if (err) {
              var res = { status: 0, message: "error occured", error: err };
              resolve(res);
            } else {
              resultx = result[0];
              var res = {
                status: 1,
                message: "Data fetched successfully",
                data: enc.encrypt_obj(resultx),
                datax: resultx
              };
              resolve(res);
            }
          })
        connection.on('error', function (err) {
          throw err;
          return;
        });
      });
      // db.query(qry, (err, result) => {
      //   console.log('------');
      //   console.log(result);
      //   console.log('--++--');
      //   if (err) {
      //     var res = { status: 0, message: "error occured", error: err };
      //     resolve(res);
      //   } else {
      //     resultx = result[0];
      //     var res = {
      //       status: 1,
      //       message: "Data fetched successfully",
      //       data: enc.encrypt_obj(resultx),
      //       datax: resultx
      //     };
      //     resolve(res);
      //   }
      // })
    })
  },










  decodeBase64Image: function (dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
  },

  formatDate: function (date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  },

  array_search_multidim: function (kk, vv, z) {
    var out = [];
    var ln = Object.keys(z).length;
    for (var i = 0; i < ln; i++) {
      var itm = z[i];
      if (itm[kk] == vv) {
        out.push(itm);
      }
    }
    return out;
  },

  timegap: function (st, end) {
    var sttime = new Date(st);
    var endtime = new Date(end);
    var diffMs = (endtime - sttime); // milliseconds between now & Christmas

    var minutes = Math.floor((diffMs / 1000) / 60);

    return minutes;
  },

  generateRandomString: function (length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  },


  clacualate_basic: function async(t_id, ctc) {
    var mm = this.blanker_two();
    var factor = 0;
    db.query(`SELECT * from salary_template_mst WHERE id=${t_id}`, (err, result) => {

      var r1 = result[0].range_1;
      var r1_arr = r1.split("-");

      var r2 = result[0].range_2;
      var r2_arr = r2.split("-");

      console.log(ctc);
      console.log(r1_arr[0]);
      console.log(r1_arr[1]);

      console.log('----------');


      console.log(r2_arr[0]);
      console.log(r2_arr[1]);


      var ctc_n = parseInt(ctc);
      if (ctc_n > parseInt(r1_arr[0]) && ctc <= parseInt(r1_arr[1])) {
        console.log('--111----');
        factor = result[0].factor_1;
      } else if (ctc_n > parseInt(r2_arr[0]) && ctc <= parseInt(r2_arr[1])) {
        console.log('--222----');
        factor = result[0].factor_2;
      } else {
        console.log('--33333----');
        factor = result[0].factor_3;
      }
      return factor;

    });

    //console.log(factor);


    //return mm+t_id+'==--=='+ctc;
  },













  blanker: function () {
    var mm = this.blanker_two();

    return mm + '==--==';
  },

  blanker_two: function () {


    return '==++==';
  },






};


