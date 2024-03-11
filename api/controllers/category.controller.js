const db = require("../config/db.config"); 
const enc = require("../utils/myencrypt");  

 

exports.getAll = (req, res) => {
  db.query("SELECT * from category", (err, result) => {
      if (err) {
        console.log("err", err)
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

exports.get = (req, res) => {
    var id = req.params.id;
    db.query(`SELECT * FROM category WHERE id=${id}`, (err, result) => {
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




exports.create = (req, res) => {
    //const dat = req.body;
    //const data = enc.decrypt_obj(dat.enc);
    
    const data = req.body;
    db.query('INSERT INTO category SET ?', data, (err, result) => {
          if (err) {
            console.error('Database query error:', err);

            res.json({ status: 0, message: "error occured", error: err });
          } else {
              res.json({
                  status: 1,
                  message: "Data inserted successfully."
              });
          }
    });  
};
exports.update = (req, res) => {
    const data = req.body;
    const cId = req.params.id;
     
    db.query(
        'UPDATE category SET ? WHERE id = ?',
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

 
exports.delete = (req, res) => {
    const cId = req.params.id;
     
    db.query(
        'DELETE FROM category WHERE id = ?', cId,
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
 











