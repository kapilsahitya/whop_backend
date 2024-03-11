
module.exports = app => {
  const Catz = require("../controllers/category.controller");
  const token = require("../utils/veifyToken");
  

  
    //Get all Module 
    app.get("/api/cat/getAll", Catz.getAll); 
    app.get("/api/cat/get/:id", Catz.get);  
    app.post("/api/cat/create", Catz.create);
    app.post("/api/cat/update/:id", Catz.update);
    app.get("/api/cat/delete/:id", Catz.delete);
    

}; 