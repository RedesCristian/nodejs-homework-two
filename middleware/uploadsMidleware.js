
const  multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req, res, cb){
        cb(null, '/public');
    },
    filename:function(req,res,cb){
        cb(null, Date.now() + "-" + this.filename.originalname);
    }
});

const upload = multer({storage:storage});
module.exports = upload;