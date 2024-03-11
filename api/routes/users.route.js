module.exports = app => {
    const userscontrol = require("../controllers/users.controller");
    const token = require("../utils/veifyToken");
    const dotenv = require('dotenv')
    dotenv.config();
    // Create a new 

    app.post("/api/users/register", userscontrol.register);
    app.post("/api/users/login", userscontrol.login);
    app.post("/api/users/verifyloginotp", userscontrol.verifyloginotp);

    app.post("/api/users/createseller", userscontrol.createseller);
    app.get("/api/users/sellerlist", token, userscontrol.sellerlist);
    app.get("/api/users/getseller/:id", userscontrol.getseller);
    app.post("/api/users/updateseller/:id", userscontrol.updateseller);
    app.get("/api/users/deleteseller/:id", userscontrol.deleteseller);


    app.post("/api/users/createuser", userscontrol.createuser);
    app.get("/api/users/userlist", token, userscontrol.userlist);
    app.get("/api/users/getuser/:id", userscontrol.getuser);
    app.post("/api/users/updateuser/:id", userscontrol.updateuser);
    app.get("/api/users/deleteuser/:id", userscontrol.deleteuser);

    app.post("/api/users/createstaff", token, userscontrol.createstaff);
    app.get("/api/users/stafflist", token, userscontrol.stafflist);
    app.get("/api/users/getstaff/:id", userscontrol.getstaff);
    app.post("/api/users/updatestaff/:id", userscontrol.updatestaff);
    app.get("/api/users/deletestaff/:id", userscontrol.deletestaff);


    app.post("/api/users/createrole", token, userscontrol.createrole);
    app.get("/api/users/rolelist", token, userscontrol.rolelist);
    app.get("/api/users/getrole/:id", userscontrol.getrole);
    app.post("/api/users/updaterole/:id", userscontrol.updaterole);
    app.get("/api/users/deleterole/:id", userscontrol.deleterole);

    app.post("/api/users/upload", userscontrol.uploadit);

    app.get("/api/users/getlatestuser", userscontrol.getlatestuser);

    //app.get("/api/users/getall",token, userscontrol.getAll);
    //app.get("/api/users/getall", userscontrol.getAll);
    //app.post("/api/users/create", userscontrol.create);
    //app.get("/api/users/profile/:id",token, userscontrol.profile);  // verifing with jwt   
    //app.get("/api/users/profile/:id", userscontrol.profile);  // verifing with jwt  
};