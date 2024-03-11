const db = require("../config/db.config"); 
const enc = require("../utils/myencrypt");  
const helper = require("../utils/myfunction");  
var jwt = require("jsonwebtoken");  



var outz = '   `id`, `refId`, `prod_id`, `seller_id`, `cust_id`, `name`, `mrp_price`, `sell_price`, `order_date`, `payment_date`, `payment_engine` ';
var paramz = {
          tableName:"prod_order",
          columns:outz,
          where:[' 1 '],
          input_columns: [ 'refId', 'prod_id',  'seller_id', 'cust_id', 'name', 'mrp_price', 'sell_price', 'payment_engine'],
          required_input_columns:['refId','prod_id', 'seller_id', 'cust_id'],
          
  };



  
function doQuery(conn,sql,args='') {
     return new Promise (function( resolve, reject ) {
        conn.query(sql, args, function (error, results, fields) {
            if (error) return reject(error)
            resolve({results, fields})
        }) 
     })
 }

  //////////////////////ORDER APIS==================
  exports.getAll = async  (req, res) => { 
            var p  = paramz;
            var limit  = req.query.limit; 
            p.where = '';            
            p.is_single = ''; 
            p.limit = limit;             
            var out = await helper.getdata(p);
            res.json(out);                  
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

  exports.getAllUser = async  (req, res) => {
        let u_id= req.userId;

       var pp  = paramz;

        let userTyp= req.userTyp;
        if(u_id && u_id>0 && userTyp =="User" ){
            pp.where = ['cust_id='+u_id];
            pp.is_single = ''; 
            var out = await helper.getdata(pp); 
            res.json(out);
          }else{
            var res={ status: 0, message: "Provide User Id" };
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
 