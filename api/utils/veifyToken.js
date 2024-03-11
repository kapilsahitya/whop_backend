var jwt = require('jsonwebtoken');
const __TOKEN = process.env.authkey;

module.exports = (req, res, next) => {
    let token_header = req.headers['authorization'];
    // console.warn('------->>');
    // console.warn(token_header);
    // console.warn(__TOKEN);
    // console.warn('------->>||');

    let token='';
    if(token_header){
        // token = token_header.split('.')[2];
        token = token_header;
    }
    else{
        return res.status(403).send({ status:-1,auth: false, message: 'Forbidden!!' });
    }
    jwt.verify(token, __TOKEN, function (err, decoded) {
        //console.warn(decoded); 
        //console.warn(err); 
        if (err)
            return res.send({ status:-1,auth: false, message: 'Invalid Signature!' });
            //res.userId = decoded.id;
        req.userId = decoded.userId;
        req.userTyp = decoded.userTyp;
        next();
    }); 
}