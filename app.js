
//========================================================================================
//                                Import File
//========================================================================================
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
require("dotenv").config();




//========================================================================================
//                                Express File
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
//                                 Route
//========================================================================================
const admin = require('./routes/admin/test')
const user = require('./routes/user/test')


app.use('/admin', admin)
app.use('/user', user)




app.set('view engine', 'pug')
app.set("views", path.join(__dirname, "html"));
//========================================================================================
//                                Request and Responsse
//========================================================================================








//========================================================================================
//                                Server Start
//========================================================================================
app.listen(process.env.PORT || 80, () => {
    console.log(`Running`);
})
