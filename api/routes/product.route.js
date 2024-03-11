
module.exports = app => {
  const Cantrler = require("../controllers/product.controller");
  const token = require("../utils/veifyToken");
  

  
    //Get all Module 

    app.get("/api/product/getAll",  Cantrler.getAll); 
    app.get("/api/product/getbycode/:code",  Cantrler.getbycode); 
    app.get("/api/product/getAllSeller", token, Cantrler.getAllSeller); 
    app.get("/api/product/get/:id", token, Cantrler.get);  
    app.post("/api/product/create", token, Cantrler.create);
    app.post("/api/product/update/:id", token, Cantrler.update);    
    app.get("/api/product/delete/:id", token, Cantrler.delete);


    app.post("/api/product/cart", token, Cantrler.cart);
    app.post("/api/product/purchase", token, Cantrler.purchase);
    

}; 