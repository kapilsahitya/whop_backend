const db = require("../models");
const Bill = db.bill;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

const { BadRequestError,DataBaseError } = require("../error/UserErrorHandeler");


//Add Bill
exports.addBill = (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  let billData = req.body;
  Bill.create(billData)
  .then((data) => {
    res.json({ status: 1, message: "Bill Added.", result: data });
  })
  .catch((err) => {
    return next(new DataBaseError(err, {"data": `${err}`}));
  });
};

//Get All Bill
exports.getAllBill =async (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  try {
    let sql = `select * from tbl_bill_mst order by id desc; `;

    const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
    res.json({
        status: 1,
        message: "All Bill fetched successfully",
        data: result
    });
  } catch (err) {
    return next(new DataBaseError(err, {"data": `${err}`}));
  }
};


//Get Bill by Id
exports.getBillById =async (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  try {
    let sql = `select * from tbl_bill_mst where id = ${req.params.id}; `;

    const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
    res.json({
        status: 1,
        message: "Bill by Id fetched successfully",
        data: result
    });
  } catch (err) {
    return next(new DataBaseError(err, {"data": `${err}`}));
  }
};


//Get Bill by Id
exports.getBillByuserId =async (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  try {
    let sql = `select * from tbl_bill_mst where userId = ${req.params.userId}; `;

    const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
    res.json({
        status: 1,
        message: "Bill by userId fetched successfully",
        data: result
    });
  } catch (err) {
    return next(new DataBaseError(err, {"data": `${err}`}));
  }
};

///Update Bill
exports.updateBill = (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  let billData = req.body;
  const id = req.params.id;
  Bill.update(billData, { returning: true, where: { id } })
    .then((data) => {
      res.json({
        status: 1,
        message: "Bill Updated",
      });
    })
    .catch((err) => {
      return next(new DataBaseError(err, {"data": `${err}`}));
    });
};

//Delete Bill
exports.deleteBill = (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  const id = req.params.id;
  Bill.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.json({
          status: 1,
          message: "Bill was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Bill with id=${id}. Maybe Bill was not found!`,
        });
      }
    })
    .catch((err) => {
      return next(new DataBaseError(err, {"data": `${err}`}));
    });
};
