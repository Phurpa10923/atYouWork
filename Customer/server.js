const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const bodyparse = require("body-parser");
const csrf = require("csurf");
const firebase = require("./models/firebaseconnection");

const cookieparser = require("cookie-parser");
//Firebase Admin

var admin = require("firebase-admin");

var Port = process.env.PORT || 5000;
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://atyourdoor-2182d-default-rtdb.firebaseio.com",
});

//Cookie middleware

const csrfMiddleware = csrf({ cookie: true });
// File Sytem

const fs = require("fs");
// Sql Database

const mysql = require("./models/sqlconnection");

//Mongoose
const userModel = require("./models/user");
const { json } = require("body-parser");
const e = require("express");

app.use(bodyparse.json());
app.use(cookieparser());

app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// GEt ANd POST request
app.post("/insert", function (req, res) {
  var query = "select*from customer";

  mysql.query(query, function (err, result) {
    const cust_id = result.length + 1;
    var insertQuery =
      "insert into customer values(" +
      cust_id +
      ",'" +
      req.body.formdata.fullname.toString() +
      "','" +
      req.body.formdata.email.toString() +
      "')";
    mysql.query(insertQuery, function (err, result) {
      if (err) console.log(err);
      console.log("DOne" + JSON.stringify(result));
    });

    var database = firebase.database();
    database.ref("users/" + cust_id + "/details").set(
      {
        Name: req.body.formdata.fullname.toString(),
        Email: req.body.formdata.email.toString(),
        ContactNumber: req.body.formdata.ContactNumber.toString(),
      },
      (error) => {
        if (error) {
          // The write failed...
          console.log("Firebase data not saved");
        } else {
          // Data saved successfully!
          console.log("Firebase data saved");
        }
      }
    );
  });

  res.redirect("/login");
});

app.get("/", function (req, res) {
  res.render("index.html");
});

app.use(csrfMiddleware);
app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  //console.log("Ok\t"+req.csrfToken());
  next();
});

app.post("/sessionLogin", (req, res) => {
  var idToken = req.body.idToken.toString();
  var query =
    "select*from customer where Email='" + req.body.username.toString() + "'";

  mysql.query(query, function (req, result) {
    if (result.length > 0) {
      fs.writeFileSync(
        "./data/userid.json",
        JSON.stringify({ userid: result[0].cust_id })
      );

      //const csrfToken=req.body.csrfToken.toString();

      const expiresIn = 60 * 60 * 24 * 5 * 1000;

      admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
          (sessionCookie) => {
            const options = { maxAge: expiresIn, httpOnly: true, secure: true };
            res.cookie("session", sessionCookie, options);
            res.end(JSON.stringify({ status: "Success" }));
          },
          (error) => {
            res.status(401).send("UNAUTHORIZED REQUEST!");
          }
        );
    } else {
      console.log("Not Registsered");
    }
  });
});

app.get("/login", function (req, res) {
  if (req.cookies.session != undefined) {
    res.send("No Can do");
    fs.writeFileSync("./data/log.json", JSON.stringify({ logged: true }));
  } else {
    fs.writeFileSync("./data/log.json", JSON.stringify({ logged: false }));
    res.render("login.html");
  }
});

app.get("/index", function (req, res) {
  if (req.cookies.session != undefined) {
    fs.writeFileSync("./data/log.json", JSON.stringify({ logged: true }));
    res.render("index.html");
  } else {
    res.render("index.html");
  }
});

app.get("/sessionlogout", function (req, res) {
  res.clearCookie("session");
  fs.writeFileSync("./data/log.json", JSON.stringify({ logged: false }));
  fs.writeFileSync("./data/userid.json", JSON.stringify({}));
  res.redirect("/login");
});

app.get("/pro", function (req, res) {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
      fs.writeFileSync("./data/log.json", JSON.stringify({ logged: true }));
      var query;
      var search_value = req.param("search");

      if (search_value == undefined || search_value == "all") {
        query = "select*from pro";
      } else {
        query =
          "select*from pro where Skill='" +
          search_value[0].toUpperCase() +
          search_value.slice(1).toLowerCase() +
          "'";
      }

      mysql.query(query, function (err, result) {
        if (!err) {
          fs.writeFileSync("./allpro.json", JSON.stringify(result));
        }
      });

      res.render("pro.html");
    })
    .catch((err) => {
      res.status(401).render("NotAuthorized.html");
    });
});

app.get("/propage/user", function (req, res) {
  if (req.cookies.session != undefined) {
    var id = req.param("id");
    var name = req.param("name");

    var database = firebase.database();

    database
      .ref("Professional/pro" + id + "/details")
      .once("value", (snapshot) => {
        fs.writeFileSync(
          "./data/prodetails.json",
          JSON.stringify(snapshot.val())
        );
        res.render("pro_page.html");
      });
  } else {
    res.status(401).render("NotAuthorized.html");
  }
});

app.get("/aboutus", function (req, res) {
  res.render("Aboutus.html");
});
app.get("/loginerror", function (req, res) {
  setTimeout(() => {
    res.redirect("login");
  }, 1000);
});

app.use(function (req, res) {
  res.status(404).render("NotFound.html");
});

app.listen(Port, console.log("Server running"));
