const db = require("../config/db.config");
const pool = require("../config/db.config")
const enc = require("../utils/myencrypt");
const helper = require("../utils/myfunction");
const __AUTHTOKEN = process.env.authkey;
var jwt = require("jsonwebtoken");
var md5 = require('md5');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')

var smtpConfig = {
  // host: 'smtp.ipower.com',
  // port: 465,
  // auth: {
  //     user: 'kapilsahitya96@gmail.com',
  //     pass: 'zkdy imke uraa ajih'
  // }
  host: 'smtp.gmail.com',
  port: 25,
  secure: false,
  auth: {
    user: 'pavanhemantraopatil@gmail.com',
    pass: 'zcetasjztabggqaw'
  }
};

var transporter = nodemailer.createTransport(smtpConfig);
var outz = '`id`, `user_id`, `user_typ`, `user_role_id`, `user_name`, `user_mname`, `user_lname`, `thumbnail`, `user_email`, `phone`, `business_name`, `business_name_slug`, `business_address`, `business_website`, `business_logo`, `tax_number`, `country_id`, `state_id`, `state`, `city`, `zip`';

var outfields = require('md5');

exports.uploadit = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  var fullUrl = req.protocol + "://" + req.get("host");
  var emp_id = '9988uuii8899';

  console.warn(fullUrl);
  console.warn('===============================');
  //console.warn(req); 
  //   if (req.files.thumbdp) {
  // }else{
  //    res.json({message:'Wrong File sent!!!'});
  // }

  res.json({
    status: 1,
    message: "We are in....lxxx",
    fl: req.file,

  });
};

exports.register = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const data = {
    user_typ: "User",
    status_email: 1,
    user_email: req.body.user_email,
  }
  // data.user_typ = "Seller";
  data.status_email = 1;
  let logintype = "manual"
  if (req.body.loginType) {
    logintype = req.body.loginType;
  }

  // const data = req.body;
  // data.user_typ = "User";
  data.rand_key = helper.generateRandomString(35);
  // data.user_password = md5(data.password);
  // delete data.password;
  data.user_id = helper.generateRandomString(6);
  db.query('INSERT INTO user_mst SET ?', data, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      if (logintype === "google") {
        res.json({
          status: 1,
          message: "Sign-up Successful"
        });
      }
      else {
        const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        var text = "Dear " + data.user_email + ",<br /><br /> Your Verification Code is :" + OTP + "   <br /> <br /> Regards<br /> Whop";
        var mailOptions = {
          from: 'pavanhemantraopatil@gmail.com', // sender address
          to: data.user_email, // list of receivers
          subject: "Verify your Whop Sign-up", // Subject line
          html: text
        };
        transporter.sendMail(mailOptions, function (err1, data1) {
          
          if (!err1) {
            const qry1 = "update user_mst set otp='" + OTP + "' where user_email='" + data.user_email + "';";
            
            // result_send = {
            //   status: 1,
            //   message: "Data inserted successfully.",
            //   lastInsertId: result.insertId
            // };
            db.query(qry1, (err2, result2) => {
              if (err2) {
                
                result_send = {
                  msg: err2,
                  status: "ERROR in Storing OTP in DB."
                };
                res.json(result_send);
              }
              else {
                result_send = {
                  msg: "OTP Sent Successfully.",
                  status: "OK"
                };
                
                res.json(result_send);
              }
            })
          }
          else {
            result_send = {
              msg: err1,
              status: "ERROR"
            };
            res.json(result_send);
          }
        });
      }
      // res.json({
      //   status: 1,
      //   message: "Data inserted successfully.",
      //   lastInsertId: result.insertId
      // });
    }
  });
};

exports.login = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const email = req.body.email;

  // const pass = req.body.password;
  // var md_pass = md5(pass);
  let logintype = "manual"
  if (req.body.loginType) {
    logintype = req.body.loginType;
  }
  db.query("SELECT * FROM user_mst where user_email=?;", email, (err, result) => {
    if (err) {
      res.json({ status: -1, message: "error occured", error: err });
    } else {
      if (result.length > 0) {
        let token = jwt.sign(
          { userId: result[0].id, userTyp: result[0].user_typ, userEmail: result[0].user_email },
          __AUTHTOKEN
        );
        if (logintype === "google") {
          res.json({
            status: 1,
            message: "Login Successful",
            accessToken_enc: enc.encrypt(token),
            accessToken: token,
            user_typ: result[0].user_typ,
            email: result[0].user_email,
            username: result[0].user_id,
            id: result[0].id
          });
        }
        else {
          const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
          var text = "Dear " + email + ",<br /><br /> Your Verification Code is :  " + OTP + " <br /> <br /> Regards<br /> Whop";
          var mailOptions = {
            from: 'pavanhemantraopatil@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Verify your Whop Sign-in", // Subject line
            html: text
          };
          transporter.sendMail(mailOptions, async function (err1, data) {
            if (!err1) {
              const qry1 = "update user_mst set otp='" + OTP + "' where user_email='" + email + "';";
              db.query(qry1, (err2, result2) => {
                if (err2) {
                  result_send = {
                    msg: err2,
                    status: "ERROR in Storing OTP in DB."
                  };
                  res.json(result_send);
                }
                else {
                  result_send = {
                    msg: "OTP Sent Successfully.",
                    status: "OK"
                  };
                  res.json(result_send);
                }
              })
            }
            else {
              result_send = {
                msg: err1,
                status: "ERROR"
              };
              res.json(result_send);
            }
          });
        }

      }
      else {
        res.json({ status: -1, message: "Wrong Credentilas. Pls try again." });
      }
    }
  });
};

exports.verifyloginotp = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const email = req.body.email;
  const otp = req.body.otp;
  db.query("select * from user_mst where user_email = '" + email + "' and otp='" + otp + "';", (err, result) => {
    if (err) {

      res.json({ status: -1, message: "error occured", error: err });
    } else {

      if (result.length > 0) {
        let token = jwt.sign(
          { userId: result[0].id, userTyp: result[0].user_typ, userEmail: result[0].user_email },
          __AUTHTOKEN
        );
        res.json({
          status: 1,
          message: "Login Successful",
          accessToken_enc: enc.encrypt(token),
          accessToken: token,
          user_typ: result[0].user_typ,
          email: result[0].user_email,
          username: result[0].user_id,
          id: result[0].id
        });
      }
      else {
        res.json({
          status: -1,
          message: "Invalid OTP."
        });
      }
    }
  })
}

exports.verifysignupotp = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  
  const email = req.body.email;
  const otp = req.body.otp;
  
  db.query("select * from user_mst where user_email = '" + email + "' and otp='" + otp + "';", (err, result) => {
    if (err) {
      
      res.json({ status: -1, message: "error occured", error: err });
    } else {

      if (result.length > 0) {
        // let token = jwt.sign(
        //   { userId: result[0].id, userTyp: result[0].user_typ, userEmail: result[0].user_email },
        //   __AUTHTOKEN
        // );
        // res.json({
        //   status: 1,
        //   message: "Login Successful",
        //   accessToken_enc: enc.encrypt(token),
        //   accessToken: token,
        //   user_typ: result[0].user_typ,
        //   email: result[0].user_email,
        //   username: result[0].user_id,
        //   id: result[0].id
        // });
        res.json({
          status: 1,
          message: "Sign-up Successful",
        })
      }
      else {
        res.json({
          status: -1,
          message: "Invalid OTP."
        });
      }
    }
  })
}

exports.getAll = (req, res) => {
  db.query("SELECT * FROM user_mst ", (err, result) => {
    if (err) {
      res.json({ status: -1, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "All user fetched successfully",
        data: result
      });
    }
  });
};


// input_columns: ['id', 'user_id', 'user_typ', 'user_role_id', 'user_name', 'user_mname', 'user_lname', 'thumbnail', 'user_email', 'phone', 'business_name', 'business_name_slug', 'business_address', 'business_website', 'business_logo', 'tax_number', 'country_id', 'state_id', 'state', 'city', 'zip']
// required_input_columns:['user_name','user_mname','user_mname'],
var paramz = {
  tableName: "user_mst",
  columns: outz,
  where: [' user_typ ="Seller" '],
  input_columns: ['id', 'user_id', 'user_typ', 'user_role_id', 'user_name', 'user_mname', 'user_lname', 'thumbnail', 'user_email', 'phone', 'business_name', 'business_name_slug', 'business_address', 'business_website', 'business_logo', 'tax_number', 'country_id', 'state_id', 'state', 'city', 'zip'],
  required_input_columns: ['user_name', 'user_mname', 'user_mname'],

};
//////////////////////SELLER APIS==================
exports.sellerlist = async (req, res) => {
  var out = await helper.getdata(paramz);
  res.json(out);
};

exports.getseller = async (req, res) => {
  var id = req.params.id;
  paramz.where = [' user_typ ="Seller" ', 'id=' + id];
  paramz.is_single = 1;
  var out = await helper.getdata(paramz);
  res.json(out);
};

// exports.createseller = (req, res) => {
//     const data = req.body;
//     data.user_typ = "Seller";
//     data.user_password = md5(data.user_password);
//     data.user_id = helper.generateRandomString(6);


//     paramz.input_data = data;
//     var out = await helper.getdata(paramz);
//     res.json(out);


// };

exports.createseller = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const data = {
    user_typ: "Seller",
    status_email: 1,
    user_email: req.body.user_email,
  }
  // data.user_typ = "Seller";
  data.status_email = 1;
  let logintype = "manual"
  if (req.body.loginType) {
    logintype = req.body.loginType;
  }
  // data.user_password = md5(data.user_password);
  data.user_id = helper.generateRandomString(6);
  db.query('INSERT INTO user_mst SET ?', data, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      if (logintype === "google") {
        res.json({
          status: 1,
          message: "Sign-up Successful"
        });
      }
      else {
        const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        var text = "Dear " + data.user_email + ",<br /><br /> Your Verification Code is :" + OTP + "   <br /> <br /> Regards<br /> Whop";
        var mailOptions = {
          from: 'pavanhemantraopatil@gmail.com', // sender address
          to: data.user_email, // list of receivers
          subject: "Verify your Whop Sign-up", // Subject line
          html: text
        };
        transporter.sendMail(mailOptions, function (err1, data1) {
          
          if (!err1) {
            const qry1 = "update user_mst set otp='" + OTP + "' where user_email='" + data.user_email + "';";
            
            // result_send = {
            //   status: 1,
            //   message: "Data inserted successfully.",
            //   lastInsertId: result.insertId
            // };
            db.query(qry1, (err2, result2) => {
              if (err2) {
                
                result_send = {
                  msg: err2,
                  status: "ERROR in Storing OTP in DB."
                };
                res.json(result_send);
              }
              else {
                result_send = {
                  msg: "OTP Sent Successfully.",
                  status: "OK"
                };
                
                res.json(result_send);
              }
            })
          }
          else {
            result_send = {
              msg: err1,
              status: "ERROR"
            };
            res.json(result_send);
          }
        });
      }
      // res.json({
      //   status: 1,
      //   message: "Data inserted successfully.",
      //   lastInsertId: result.insertId
      // });
    }
  });
};

exports.updateseller = (req, res) => {
  const data = req.body;
  const cId = req.params.id;

  db.query(
    'UPDATE user_mst  SET ? WHERE user_typ="Seller" AND   id = ?',
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

exports.deleteseller = (req, res) => {
  const cId = req.params.id;

  db.query(
    'DELETE FROM user_mst WHERE id = ?', cId,
    (err, result) => {
      if (err) {
        res.json({ status: -1, message: "error occured", error: err });
      } else {
        res.json({
          status: 1,
          message: "Data deleted successfully",
          data: result
        });
      }
    });
};
//////////////////////SELLER APIS==================


//////////////////////USERS APIS==================
exports.userlist = (req, res) => {
  db.query('SELECT ' + outz + ' from user_mst WHERE user_typ="User"', (err, result) => {
    if (err) {
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "Data fetched successfully",
        data: enc.encrypt_obj(result),
        datax: result,
      });
    }
  });
};

exports.getuser = (req, res) => {
  var id = req.params.id;
  db.query(`SELECT ` + outz + `  FROM user_mst WHERE user_typ='User' AND id=${id}`, (err, result) => {
    if (err) {
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "Fetched data successfully",
        data: result[0]
      });
    }
  });
};

exports.createuser = (req, res) => {
  //const dat = req.body;
  //const data = enc.decrypt_obj(dat.enc);

  const data = req.body;
  data.user_typ = "User";
  data.status_email = 1;
  data.user_password = md5(data.user_password);
  data.user_id = helper.generateRandomString(6);
  db.query('INSERT INTO user_mst SET ?', data, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "Data inserted successfully.",
        lastInsertId: result.insertId
      });
    }
  });
};

exports.updateuser = (req, res) => {
  const data = req.body;
  const cId = req.params.id;

  db.query(
    'UPDATE user_mst  SET ? WHERE user_typ="User" AND   id = ?',
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

exports.deleteuser = (req, res) => {
  const cId = req.params.id;

  db.query(
    'DELETE FROM user_mst WHERE user_typ="User" AND id = ?', cId,
    (err, result) => {
      if (err) {
        res.json({ status: -1, message: "error occured", error: err });
      } else {
        res.json({
          status: 1,
          message: "Data deleted successfully",
          data: result
        });
      }
    });
};
//////////////////////USERS APIS==================




//////////////////////STAFF APIS==================
exports.stafflist = (req, res) => {
  db.query('SELECT ' + outz + ' from user_mst WHERE user_typ="Staff"', (err, result) => {
    if (err) {
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "Data fetched successfully",
        data: enc.encrypt_obj(result),
        datax: result,
      });
    }
  });
};

exports.getstaff = (req, res) => {
  var id = req.params.id;
  db.query(`SELECT ` + outz + `  FROM user_mst WHERE user_typ='Staff' AND id=${id}`, (err, result) => {
    if (err) {
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "Fetched data successfully",
        data: result[0]
      });
    }
  });
};

exports.createstaff = (req, res) => {
  //const dat = req.body;
  //const data = enc.decrypt_obj(dat.enc);

  const data = req.body;
  data.user_typ = "Staff";
  data.status_email = 1;
  data.user_password = md5(data.user_password);
  data.user_id = helper.generateRandomString(6);
  db.query('INSERT INTO user_mst SET ?', data, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "Data inserted successfully.",
        lastInsertId: result.insertId
      });
    }
  });
};

exports.updatestaff = (req, res) => {
  const data = req.body;
  const cId = req.params.id;

  db.query(
    'UPDATE user_mst  SET ? WHERE user_typ="Staff" AND   id = ?',
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

exports.deletestaff = (req, res) => {
  const cId = req.params.id;

  db.query(
    'DELETE FROM user_mst WHERE user_typ="Staff" AND id = ?', cId,
    (err, result) => {
      if (err) {
        res.json({ status: -1, message: "error occured", error: err });
      } else {
        res.json({
          status: 1,
          message: "Data deleted successfully",
          data: result
        });
      }
    });
};
//////////////////////USERS APIS==================



//////////////////////STAFF APIS==================
exports.rolelist = (req, res) => {
  db.query('SELECT id,name,status from user_role WHERE status = 1', (err, result) => {
    if (err) {
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "Data fetched successfully",
        data: enc.encrypt_obj(result),
        datax: result,
      });
    }
  });
};

exports.getrole = (req, res) => {
  var id = req.params.id;
  db.query(`SELECT id,name,status  FROM user_role WHERE  id=${id}`, (err, result) => {
    if (err) {
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "Fetched data successfully",
        data: result[0]
      });
    }
  });
};

exports.createrole = (req, res) => {
  const data = req.body;
  db.query('INSERT INTO user_role SET ?', data, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.json({ status: 0, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "Data inserted successfully.",
        lastInsertId: result.insertId
      });
    }
  });
};

exports.updaterole = (req, res) => {
  const data = req.body;
  const cId = req.params.id;

  db.query(
    'UPDATE user_role  SET ? WHERE user_typ="Staff" AND   id = ?',
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

exports.deleterole = (req, res) => {
  const cId = req.params.id;

  db.query(
    'DELETE FROM user_role WHERE  id = ?', cId,
    (err, result) => {
      if (err) {
        res.json({ status: -1, message: "error occured", error: err });
      } else {
        res.json({
          status: 1,
          message: "Data deleted successfully",
          data: result
        });
      }
    });
};
//////////////////////USERS APIS==================

exports.profile = (req, res) => {
  const id = req.params.userId;

  db.query(`SELECT name,lname,email,phone,city,zip FROM employee where id=${id}`, (err, result) => {
    if (err) {
      res.json({ status: -1, message: "error occured", error: err });
    } else {
      res.json({
        status: 1,
        message: "JWT Verified | User Info Fetched successfully",
        data: result
      });
    }
  });
};

exports.create = (req, res) => {
  const data = req.body;
  db.query(
    "INSERT INTO employee (name, lname, phone, email, address, city, state, zip) VALUES (?,?,?,?,?)",
    [data.name, data.lname, data.phone, data.email, data.address, data.city, data.state, data.zip],
    (err, result) => {
      if (err) {
        res.json({ status: -1, message: "error occured", error: err });
      } else {
        res.json({
          status: 1,
          message: "Insert successfully..."
        });
      }
    }
  );
};

exports.getlatestuser = (req, res) => {
  const qry = "select id, user_id, user_typ, user_name, user_mname, user_lname,thumbnail,insert_date  from user_mst where insert_date >= (NOW() - INTERVAL 100 DAY) and user_typ NOT IN ('Admin')";
  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    connection.query(qry, function (err, result) {

      if (err) {
        res.json({ status: -1, message: "error occured", error: err });
      }
      else {
        if (result && result.length > 0) {
          res.json({
            status: 1,
            message: "Fetched data successfully",
            data: enc.encrypt_obj(result)
          });
        }
        else {
          res.json({
            status: 1,
            message: "Fetched data successfully",
            data: []
          });
        }

      }
    })
    connection.on('error', function (err) {
      throw err;
    });
  })
}