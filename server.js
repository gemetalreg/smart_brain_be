const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('knex')({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {rejectUnauthorized: false},
      host : process.env.DATABASE_HOST,
      port : 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
    }
  });

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require('./controllers/profile');
const image = require("./controllers/image");
  

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('success');
})

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt))

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get("/profile/:id", (req, res) => profile.handleProfile(req, res, bd));

app.put("/image" , (req, res) => image.handleImage(req, res, db));

app.post("/imageapi", (req, res) => image.handleApiCall(req, res));

app.listen(PORT || 3001, () => {
    console.log(`app is running on port ${PORT}`);
})

