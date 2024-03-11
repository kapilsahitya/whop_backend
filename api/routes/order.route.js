
module.exports = app => {
  const Cantrler = require("../controllers/order.controller");
  const token = require("../utils/veifyToken");
  

  
    //Get all Module 

    app.get("/api/order/getAll", token, Cantrler.getAll); 
    app.get("/api/order/getbycode/:code", token,  Cantrler.getbycode); 
    app.get("/api/order/getAllSeller", token, Cantrler.getAllSeller); 
    app.get("/api/order/getAllUser", token, Cantrler.getAllUser); 
    
    

}; 