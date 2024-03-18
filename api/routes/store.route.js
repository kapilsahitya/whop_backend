module.exports = app => {
    const storeController = require("../controllers/store.controller");
    const token = require("../utils/veifyToken");

    app.post("/api/store/create", token,storeController.createStore);
}