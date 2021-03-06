// routes/apiRoutes.js

var db = require("../models");


module.exports = function(app) {


    //------------------------------------------------------
    // Doctors
    //------------------------------------------------------
    app.get("/api/doctors", isLoggedIn, function(req, res) {
        email = req.user.email;

        db.Doctor.findAll({ where: { email: email } }).then(function(dbResult) {
            res.json(dbResult);
        });
    });

    // Menu Principal de Doctores

    app.get("/dashboard", isLoggedIn, function(req, res) {
        email = req.user.email;

        db.Doctor.findOne({ where: { email: email } }).then(function(dbResult) {
            res.render("doctorsMenu", {
                msg: "Doctor: " + titleCase(dbResult.firstname + " " + dbResult.lastname),
                recs: dbResult,
                login: true,
                logt: "Logout",
                logh: "/Logout"
            });
        });
    });
    /// Lista de Pacientes
    app.get("/patientsList", isLoggedIn, function(req, res) {
        id = req.user.id;
        nombre = req.user.firstname;
        apellido = req.user.lastname;

        db.Patient.findAll({ where: { DoctorId: id } }).then(function(dbResult) {
            res.render("patientsList", {
                msg: "Doctor: " + nombre + " " + apellido,
                recs: dbResult,
                login: true,
                logt: "Logout",
                logh: "/Logout"

            });
        });
    });

    /// Records
    app.get("/records/:id", isLoggedIn, function(req, res) {
        id = req.user.id;
        paciente2 = "";


        db.Patient.findOne({ where: { DoctorId: id, id: req.params.id } }).then(function(dbResult) {

            paciente2 = titleCase(dbResult.firstname + " " + dbResult.lastname)
            console.log("Paciente  " + paciente2);
        });
        db.Prescription.findAll({
            where: { idPatient: req.params.id, idDoctor: id },
            order: [
                ['id', 'ASC']
            ]
        }).then(function(dbResult) {
            console.log(dbResult);
            res.render("records", {

                recs: dbResult,
                login: true,
                paciente: paciente2


            });
        });
    });


    /// MyAccount
    app.get("/MyAccount", isLoggedIn, function(req, res) {
        res.render("MyAccount", {



            login: true,

            id: req.user.id,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email: req.user.email,
            phone: req.user.phone,
            license: req.user.license,
            password: '*******'

        });



    });




    // New Patient HTML Forma

    app.get("/newpatient", isLoggedIn, function(req, res) {
        email = req.user.email;

        db.Doctor.findOne({ where: { email: email } }).then(function(dbResult) {
            res.render("patientsEdit", {
                msg: "Doctor: " + dbResult.firstname + " " + dbResult.lastname,
                email: dbResult.email,
                id: dbResult.id,
                login: true,
                logt: "Logout",
                logh: "/Logout"
            });
        });
    });



    // Create ---------------------------
    app.post("/api/doctors", function(req, res) {
        db.Doctor.create(req.body).then(function(dbResult) {
            res.json(dbResult);
        });
    });

    // Nueva Receta ---------------------
    app.get("/api/nuevareceta/:id", isLoggedIn, function(req, res) {
        id = req.user.id;
        nombre = req.user.firstname;
        apellido = req.user.lastname;

        db.Patient.findOne({ where: { id: req.params.id } }).then(function(
            dbResult
        ) {
            res.render("prescriptions", {
                msg: "Doctor: " + nombre + " " + apellido,
                recs: dbResult,
                fecha: dbResult.birthdate.getFullYear() + "-" + +dbResult.birthdate.getMonth() + "-" + dbResult.birthdate.getDate(),
                DoctorId: id,
                login: true,
                logt: "Logout",
                logh: "/Logout"

            });
        });
    });

    //------------------------------------------------------
    // Patients
    //------------------------------------------------------
    app.get("/api/patients", function(req, res) {
        db.Patient.findAll({}).then(function(dbResult) {
            res.json(dbResult);
        });
    });

    // Create ---------------------------
    app.post("/api/patients", function(req, res) {
        db.Patient.create(req.body).then(function(dbResult) {
            res.json(dbResult);
        });
    });

    // Delete by id ---------------------
    app.delete("/api/patients/:id", function(req, res) {
        db.Patient.destroy({ where: { id: req.params.id } }).then(function(
            dbResult
        ) {
            res.json(dbResult);
        });
    });

    //------------------------------------------------------
    // Prescriptions
    //------------------------------------------------------
    app.get("/api/prescriptions", function(req, res) {
        db.Prescription.findAll({}).then(function(dbResult) {
            res.json(dbResult);
        });
    });

    // Create ---------------------------
    app.post("/api/insertapaciente", isLoggedIn, function(req, res) {

        data = {
            DoctorId: req.user.id,
            firstname: req.body.pat_firstname,
            lastname: req.body.pat_lastname,
            birthdate: req.body.pat_birthdate,
            gender: req.body.pat_gender,
            email: req.body.pat_email,
            phone: req.body.pat_phone,
        }

        db.Patient.create(data).then(function(dbResult) {
            //res.json(dbResult);
            res.redirect('/dashboard');
        });
    });


    app.post("/api/insertareceta2", isLoggedIn, function(req, res) {

        data = {
            idDoctor: req.user.id,
            idPatient: req.body.PatientId,
            weight: req.body.weight,
            height: req.body.height,
            prescription: req.body.prescription,
            observations: req.body.observations,
            PatientId: req.body.PatientId,
            pulse: req.body.pulse

        };
        console.log("Prueba")
        console.log(data);
        db.Prescription.create(data).then(function(dbResult) {
            //res.json(dbResult);
            res.redirect('/dashboard');
        });
    });



    // Delete by id ---------------------
    app.delete("/api/prescriptions/:id", function(req, res) {
        db.Prescription.destroy({ where: { id: req.params.id } }).then(function(
            dbResult
        ) {
            res.json(dbResult);
        });
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            console.log("Prueba");

            console.log(req.user.email);

            return next();
        } else {
            res.redirect('/doctorsLogin');
        }
    }

    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }
    //------------------------------------------------------
    //------------------------------------------------------
};