//jshint esversion:6

// var express = require('express')
// var app = express()

// app.get('/' ,function(req,res){

// res.send('Hello World! how are you my love')

// })

// app.listen(3000,function(){

// console.log('I am up and running on port 3000!')

// })


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
// require('dotenv').config();



// app.use(bodyParser.json());



const client = new Client({
  host : process.env.DB_HOST,
  port : process.env.DB_PORT,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,

});

// const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
// const client = new Client(connectionString);

app.use(express.urlencoded({ extended: false }));

// client.connect();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/signform.html");
  });

  app.post("/signform", (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const number = req.body.number;
  
    const insertQuery = "INSERT INTO signup.registration (firstname, lastname, email, password, number) VALUES ($1, $2, $3, $4, $5)";
    const insertValues = [firstname, lastname, email, password, number];
  
    client.connect(err => {
      if (err) {
        console.error("connection error", err.stack);
        res.send("Error connecting to database");
      } else {
        client.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            console.error("query error", err.stack);
            res.send("Error inserting data into database");
          } else {
            const selectQuery = "SELECT * FROM signup.registration";
  
            client.query(selectQuery, (err, result) => {
              if (err) {
                console.error("query error", err.stack);
                res.send("Error retrieving data from database");
              } else {
                res.send("Data inserted successfully: " + JSON.stringify(result.rows));
              }
              client.end();
            });
          }
        });
      }
    });
  });

// app.get("/", (req, res) => {
//     res.send("Welcome to my website!");
//   });
app.listen(3000, function() {
    console.log("Server started on port 3000.");
  });
