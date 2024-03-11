const multer = require('multer')
const fs = require('fs');
const path = require('path');

let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            // console.log("filename",file.fieldname);
            //  console.log("filename2",file.originalname);
            var s=file.fieldname;
            // if (file.fieldname=="thumb") {
            //      s = "thumb";
            // }

            let dest = path.join(__dirname, '../../', `/uploads/`,s); 

            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest);
            }
            callback(null, dest);
            // fs.mkdir(dest, function (err) {
            //     if (err) {
            //         return console.error(err);
            //     }
            //     callback(null, dest);
            // });
            // fs.mkdirsSync(path);
        },
        filename: (req, file, callback) => {
            console.log("he",file);
            console.log("------>>------");
            //originalname is the uploaded file's name with extn
            var extension=file.mimetype.replace("image/", ".");
            var extension=extension.replace("text/", ".");
            var extension=extension.replace("application/vnd.ms-excel", ".csv");

             

            if (file.fieldname=="thumb") {
                //console.log("callback",extension);
                 callback(null, file.originalname);
            }else{
                callback(null, new Date().getTime() + extension);
            }

            
        }
    })
});

module.exports = upload;