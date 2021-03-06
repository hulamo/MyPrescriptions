    var express = require('express')
    var app = express()
    var passport = require('passport')
    var session = require('express-session')
    var bodyParser = require('body-parser')
    var env = require('dotenv').load()
    var exphbs = require('express-handlebars')
    var Handlebars = require('handlebars')
    var PORT = process.env.PORT || 5000;


    //For BodyParser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static(__dirname + "/public"));

    // For Passport
    app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions


    //For Handlebars


    Handlebars.registerHelper("formatdate", function(fecha) {

        return fecha.getFullYear() + "-" + +fecha.getMonth() + "-" + fecha.getDate()

    });


    //app.engine('handlebars', engines.handlebars);

    app.set('helpers', './helpers')

    app.set('views', './views')
    app.engine('hbs', exphbs({ extname: '.hbs' }));
    app.set('view engine', '.hbs');



    app.get('/', function(req, res) {
        res.redirect('/dashboard');
    });


    //Models
    var models = require("./models");


    //Routes
    var authRoute = require('./routes/auth.js')(app, passport);
    require("./routes/apiRoutes")(app);

    //    var authRoute = require('./app/routes/apiRoutes.js');

    //load passport strategies
    require('./passport/passport.js')(passport, models.Doctor);


    //Sync Database
    models.sequelize.sync().then(function() {
        console.log('Nice! Database looks fine')

    }).catch(function(err) {
        console.log(err, "Something went wrong with the Database Update!")
    });



    app.listen(PORT, function(err) {
        if (!err)
            console.log("Site is live");
        else console.log(err)

    });