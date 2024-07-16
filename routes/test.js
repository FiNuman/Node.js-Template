const express = require('express')
const routes = express.Router();
const multer = require('multer');
let upload = multer({}).none()
  
const rateLimit = require('express-rate-limit');  

const depositLimiter = rateLimit({
    windowMs: 2 * 1000,
    max: 1,
});


routes
    .route('/unitType')
    .get(async (req, res) => {
        upload(req, res, async function (err) {
            try {
                 res.send('Have a good day') 
            } catch (error) {
                res.status(500).json({ data: 'serverError', errorCode: 'NE034214' })
            }
        })
})
    


module.exports = routes;


