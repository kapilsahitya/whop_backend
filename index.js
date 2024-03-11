const express = require("express");
const app = express();
require ('dotenv').config();
const path = require('path');
const fs = require( 'fs' );
const cors = require("cors");
const helmet = require("helmet");
const multer = require('multer');


const port = 3000; 


app.use(helmet());
app.use(cors());
app.options("*", cors());
app.use(express.json()); //parse request Data to json


////// Start----------------------------Dynamic route Import
let routesPath = path.join(__dirname,'api','routes');
let PATHS = fs.readdirSync( routesPath );
PATHS.forEach( ( module ) => {
  if( module !== 'index.js' ) {
      const name = module.split( '.js' )[ 0 ];
      require(`./api/routes/${name}`)(app);
  }
} );
/// End------------------------------------------------
 


app.get('/', (req, res) => {
    res.status(201).json({
        status: true,
        message: "test api is Working..."
         
    });
});


 

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
    const getStorage = (folder) => {
      return multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join('uploads', folder);
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          //cb(null, file.fieldname + '-' + uniqueSuffix + ext);
          cb(null, uniqueSuffix + ext);
        },
      });
    };




    app.use('/uploads', express.static('uploads'));
    app.use(express.json()); // Add this line to parse JSON in the request body
    app.post('/upload/:folder', (req, res) => {
      const folder = req.params.folder || 'default-folder';

      // console.warn('----------------');
      // console.warn(req.params.folder);
      // console.warn("====================");
      const upload = multer({ storage: getStorage(folder) });
      upload.single('image')(req, res, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error uploading file' });
        }
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        const imageUrl = `https://${req.get('host')}/uploads/${folder}/${req.file.filename}`;
        res.json({ imageUrl });
      });
    });

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

 





app.listen(port, () => console.log(`App listening on port ${port}!`));
