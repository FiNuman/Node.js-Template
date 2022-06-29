
//========================================================================================
//                                import part
//========================================================================================
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
require("dotenv").config();




//========================================================================================
//                                Express fil
//========================================================================================
app.use('/static', express.static('public'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/files', express.static('files'));
app.use('/images', express.static('images'));
app.use(express.urlencoded({
    limit: '150mb',
    extended: true
}));



//========================================================================================
//                                database
//========================================================================================
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function () {
    console.log("MongoDB database connection successfully");
});



//========================================================================================
//                                 Data base schema
//========================================================================================
let schema = new mongoose.Schema(
    {
        name: String,
        phone: String,
        gmail: String,
        img: String,
    }
);


//========================================================================================
//                                    Data Model
//========================================================================================
let model = mongoose.model('database_folder_name', schema);





//========================================================================================
//                                route
//========================================================================================
const admin = require('./routes/admin/test')
const user = require('./routes/user/test')


app.use('/admin', admin)
app.use('/user', user)





//========================================================================================
//                                Multer
//========================================================================================
// let time;      //need this variable 
// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'images/uploads/')
//     },
//     filename: function (req, file, cb) {
//         time = Date.now();
//         cb(null, file.fieldname + '-' + time + ".png")
//     }
// })
// const fileFilter = (req, file, cb) => {
//     if ((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };
// let upload = multer({ storage: storage, fileFilter: fileFilter }).single('myimg')
// upload(req, res, function (err) {

// })



app.set('view engine', 'pug')
app.set("views", path.join(__dirname, "html"));
//========================================================================================
//                                request and responsse
//========================================================================================








//========================================================================================
//                                Server start
//========================================================================================
app.listen(process.env.PORT || 8181, () => {
    console.log(`Running`);
})
