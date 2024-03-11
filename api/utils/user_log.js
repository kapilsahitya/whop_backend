const db = require("../config/db.config");
const func = require("../utils/myfunction");
const enc = require("../utils/myencrypt");


function doQuery(conn,sql,args='') {
     return new Promise (function( resolve, reject ) {
        conn.query(sql, args, function (error, results, fields) {
            if (error) return reject(error)
            resolve({results, fields})
        }) 
     })
 }

module.exports = {

 create: function (table_name,primary_id,old_data=null,new_data=null,created_by,comment=null,emp_id=null) {

 	const sql=`INSERT INTO user_log set ? `;
 	const log_data = {
 						'table_name':table_name,
 						'primary_id':primary_id,
            'old_data':JSON.stringify(old_data),
 						'new_data':JSON.stringify(new_data),
 						'created_by':created_by,
 						'remarks':comment,
            'employee_id':emp_id,
 					 }
 	db.query(sql,log_data,(err,result)=>{
          if (err) {
            console.log(err);
          } else {}
  });
   
  },

  update: function (table_name,primary_id,old_data,data=null,employee_id,comment=null) {

 	const sql=`UPDATE user_log set ? WHERE primary_id=${primary_id}`;
 	const log_data = { 
 						'table_name':table_name,
 						'primary_id':primary_id,
 						'old_data':JSON.stringify(old_data),
 						'new_data':JSON.stringify(data),
 						'created_by':employee_id,
 						'remarks':comment
 					 }
 	db.query(sql,log_data,(err,result)=>{});
   
  },

};

