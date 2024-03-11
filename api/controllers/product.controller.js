const db = require("../config/db.config"); 
const pool = require("../config/db.config");
const enc = require("../utils/myencrypt");  
const helper = require("../utils/myfunction");  
var jwt = require("jsonwebtoken");  



var outz = ' `id`, `prod_code`, `cat_id`, `seller_id`, `name`, `base_price`, `prod_tagline`, `short_info`, `prod_info`, `thumbnail`, `meta_title`, `meta_keyword`, `meta_description`';
var paramz = {
          tableName:"product_mst",
          columns:outz,
          where:[' 1 '],
          input_columns: [ 'prod_code', 'cat_id',  'name', 'prod_tagline', 'prod_info', 'thumbnail', 'meta_title', 'meta_keyword', 'meta_description'],
          required_input_columns:['prod_code','cat_id', 'name', 'prod_tagline', 'prod_info', 'thumbnail'],
          
  };

var c_outz = ' `id`, `refId`, `user_id`, `product_id`, `quantity`';
var c_paramz = {
          tableName:"cart",
          columns:c_outz,
          where:[' 1 '],
          input_columns: [ 'id', 'refId',  'user_id', 'product_id', 'quantity'],
          required_input_columns:['product_id','quantity'],          
};
  //////////////////////CART APIS==================


function doQuery(conn,sql,args='') {
     return new Promise (function( resolve, reject ) {
        conn.query(sql, args, function (error, results, fields) {
            if (error) return reject(error)
            resolve({results, fields})
        }) 
     })
 }


  exports.purchase = async  (req, res) => { 
      var uid = req.userId;

       let cartdata = await doQuery (db, `SELECT * 
                      , (SELECT name FROM product_mst WHERE id = cart.product_id) as prod_name  
                      , (SELECT seller_id FROM product_mst WHERE id = cart.product_id) as seller_id  
                     ,  (SELECT base_price FROM product_mst WHERE id = cart.product_id) as price   

                     FROM cart WHERE  user_id="${uid}"`);
       var list = cartdata.results;
       list.map((val, key) => {                   
                    var ddt = {};
                    ddt.refId = helper.generateRandomString(6);
                    ddt.prod_id = val.product_id;
                    ddt.seller_id = val.seller_id;
                    ddt.cust_id = uid;
                    ddt.name = val.prod_name;
                    ddt.mrp_price = val.price;
                    ddt.sell_price = val.price;
                    ddt.payment_engine = 'COD';                     
                    db.query('INSERT INTO prod_order SET ?', ddt, (err, result) => {});    
          });

        let crt_clr = await doQuery (db, `delete from  cart WHERE user_id="${uid}"`);
          res.json({
                    status: 1,
                    message: "Data Proceed Successfully.",
                            
          });                   
  };

  exports.cart = async  (req, res) => { 
      var uid = req.userId;
      var subqry = `
                     ,  (SELECT name FROM product_mst WHERE id = cart.product_id) as prod_name  
                     ,  (SELECT base_price FROM product_mst WHERE id = cart.product_id) as price    
                  `;

      const data = req.body;
      const typ = req.body.typ;

      if(typ){
          data.product_id = req.body.product_id;
          data.user_id = uid;
          data.quantity = 1;
          data.refId = helper.generateRandomString(6);
          delete data.typ;
      }
      

      if(typ=='C'){
                  db.query('INSERT INTO cart SET ?', data, (err, result) => {
                      if (err) {
                        console.error('Database query error:', err);
                        res.json({ status: 0, message: "error occured", error: err });
                      } else {
                          db.query("SELECT * "+subqry+" FROM cart WHERE  user_id=?;",uid, (err, result) => {
                            if (err) {
                              res.json({ status: -1, message: "error occured", error: err });
                            }else{
                                res.json({
                                    status: 1,
                                    message: "Fetching cart data.",
                                    uid: uid,
                                    cart_count: result.length, 
                                    data: result,              
                                });    
                            }
                          }); 
                      }
                  });
      }else if(typ=='D'){
            ////DELETE QRY:-----
            var dqry = 'DELETE FROM cart WHERE product_id = '+data.product_id+' AND user_id = '+uid;
            db.query(dqry, (err, result) => {
                  if (err) {
                    console.error('Database query error:', err);
                    res.json({ status: 0, message: "error occured", error: err });
                  } else {
                      db.query("SELECT * "+subqry+" FROM cart WHERE  user_id=?;",uid, (err, result) => {
                        if (err) {
                          res.json({ status: -1, message: "error occured", error: err });
                        }else{
                            res.json({
                                status: 1,
                                message: "Fetching cart data.",
                                uid: uid,
                                cart_count: result.length,         
                                data: result,         
                            });    
                        }
                      });              
                  }
            });
      }else{
          db.query("SELECT * "+subqry+" FROM cart WHERE  user_id=?;",uid, (err, result) => {
            if (err) {
              res.json({ status: -1, message: "error occured", error: err });
            }else{
                res.json({
                    status: 1,
                    message: "Fetching cart data.",
                    uid: uid,
                    cart_count: result.length,         
                    data: result,         
                });    
            }
          });
      }               
  };
  //////////////////////PRODUCT APIS==================
  exports.getAll = async  (req, res) => { 
  
            // var p  = paramz;
            // var limit  = req.query.limit; 
            // p.where = '';            
            // p.is_single = ''; 
            // p.limit = limit;             
            // var out = await helper.getdata(p);
            // res.json(out);  
            // const qry = `select a.* , b.name as cat_name from product_mst a INNER JOIN category b on a.cat_id = b.id limit ${req.query.limit}`;
            const qry = `select a.* , b.name as cat_name from product_mst a INNER JOIN category b on a.cat_id = b.id`;
            pool.getConnection(function(err, connection) {
              if(err)
              {
                throw err;
              }
              connection.query(qry, function(err, result){
                if(err)
                {
                  res.json({ status: -1, message: "error occured", error: err });
                }
                else{
                  if(result && result.length > 0)
                  {
                    res.json({
                      status: 1,
                      message: "Fetched data successfully",
                      data: enc.encrypt_obj(result)
                    });
                  }
                  else{
                    res.json({
                      status: 1,
                      message: "Fetched data successfully",
                      data: []
                    });
                  }
                }
              })
            })                
  };
  
  exports.getAllSeller = async  (req, res) => {
        let seller_id= req.userId;

       var pp  = paramz;

        let userTyp= req.userTyp;
        if(seller_id && seller_id>0 && userTyp =="Seller" ){
            pp.where = ['seller_id='+seller_id];
            pp.is_single = ''; 
            var out = await helper.getdata(pp);
            res.json(out);
          }else{
            var res={ status: 0, message: "Provide Seller Id" };
          }        
  };

  exports.getbycode = async (req, res) => {
      var code = req.params.code;
      paramz.where = ['prod_code= "'+code+'" '];
      paramz.is_single = 1;

      paramz.subqry = `

               ,  (SELECT CONCAT(user_name," ",user_lname) FROM user_mst WHERE id  = (SELECT seller_id from product_mst WHERE prod_code= "`+code+`" limit 1 )) as seller_name  
               ,  (SELECT business_name FROM user_mst WHERE id  = (SELECT seller_id from product_mst WHERE prod_code= "`+code+`" limit 1 )) as business_name  

            `; 

      var out = await helper.getdata(paramz);
      res.json(out);
  };

  exports.get = async (req, res) => {
      var id = req.params.id;
      paramz.where = ['id='+id];
      paramz.is_single = 1;
      var out = await helper.getdata(paramz);
      res.json(out);
  };

  exports.create = async (req, res) => {
      const data = req.body;
      data.created_by = req.userId;
      paramz.input_data = data;
      var out = await helper.adddata(paramz);
      res.json(out);
  };

  exports.delete = async (req, res) => {
      paramz.del_id = req.params.id;
      var out = await helper.deldata(paramz);
      res.json(out);
  };

  exports.update = (req, res) => {
      const data = req.body;
      const cId = req.params.id;
       
      db.query(
          'UPDATE product_mst SET ? WHERE id = ?',
          [data, cId],
          (err, result) => {
            if (err) {
              res.json({ status: -1, message: "error occured", error: err });
            } else {
              res.json({
                    status: 1,
                    message: "Data updated successfully",
                    data: result
                });
            }
      });
  };

 // exports.getbycode = async  (req, res) => {
  //       let cod= req.params.cod;

  //      var pp  = paramz;

  //       let userTyp= req.userTyp;
  //       if(cod &&   cod !="" ){
  //           pp.where = ['seller_id='+seller_id];
  //           pp.is_single = ''; 
  //           var out = await helper.getdata(pp);
  //           res.json(out);
  //         }else{
  //           var res={ status: 0, message: "Provide Seller Id" };
  //         }        
  // };


