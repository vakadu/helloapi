var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Vehicle = require('./app/models/vechicle');

//configure app for bodyParser()
//lets us grab data from the body of post
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//set up port for server to listen on
var port = process.env.PORT || 3000;

//connect to db
mongoose.connect('mongodb://vakadu10:sachin10@ds133547.mlab.com:33547/helloapi');

//API routes
var router = express.Router();

//Routes will be prefixed with /api
app.use('/api', router);

//Middleware
//middleware can be very useful for doing validations, we can log
//that the request is not safe.
//middleware to use for all requests
router.use(function (req, res, next) {
    console.log("Loading...");

    next();
});

//test route
router.get('/', function (req, res) {
    res.json({message: 'Hello API'});
});

router.route('/vehicles')
    .post(function (req, res) {
        var vehicle = new Vehicle();
        vehicle.make = req.body.make;
        vehicle.model = req.body.model;
        vehicle.color = req.body.color;

        vehicle.save(function (err) {
            if (err){
                res.send(err);
            }
            res.json({message: "Vehicle is created"});
        });
    })
    .get(function (req, res) {
        Vehicle.find(function (err, vehicles) {
            if (err){
                res.send(err);
            }
            res.json(vehicles);
        });
    });

router.route('/vehicle/:vehicle_id')
    .get(function (req, res) {
        Vehicle.findById(req.params.vehicle_id, function (err, vehicle) {
           if (err){
               res.send(err);
           }
           res.json(vehicle);
        });
    });

router.route('/vehicle/make/:make')
    .get(function (req, res) {
        Vehicle.find({make: req.params.make}, function (err, vehicle) {
            if (err){
                res.send(err);
            }
            res.json(vehicle);
        });
    });

router.route('/vehicle/color/:color')
    .get(function (req, res) {
        Vehicle.find({color: req.params.color}, function (err, vehicle) {
            if (err){
                res.send(err);
            }
            res.json(vehicle);
        });
    });

//start server
app.listen(port);

//print friendly message to console
console.log("Server listening " + port);
