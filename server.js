const express = require('express');
const app = express();
const mysql = require('mysql');
const _ = require('lodash');
const bodyParser = require('body-parser')
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

const server = app.listen(7000, () => {
  console.log('Nodejs is running on port 7000!')
})

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: 'my-app'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//Som-o register
app.post('/register', async (req, res) => {
  const { Id , Username, Password, confirmPassword } = req.body;

  if (Password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const query = `INSERT INTO tbl_logins (Id, Username, Password) VALUES (?, ?, ?)`;
    const values = [Id , Username, Password];

    con.query(query, values, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      
      res.status(201).json({ message: 'Register successful', userId: results.insertId });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Tang-mo Login 
app.post('/login', (req, res) => {
  const { Username, Password } = req.body;

  console.log('Username', Username);
  console.log('Password', Password);

  try {
    con.query('SELECT * FROM tbl_logins WHERE Username = ?', [Username], async (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = results[0];
      const storedPassword = user.Password; // รหัสผ่านที่เก็บไว้ในฐานข้อมูล

      // const passwordMatch = await bcrypt.compare(String(Password), String(storedPassword));

      // if (!passwordMatch) { // เปรียบเทียบรหัสผ่านที่เก็บไว้กับรหัสผ่านที่ผู้ใช้ส่งเข้ามา
      //   return res.status(401).json({ error: 'Invalid password' });
      // }

      const token = jwt.sign({ userId: user.Id }, 'yourSecretKey', { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    });
  } catch (error) {
    console.error('Error Login User-password:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


//E-ham Reset Password
app.get("/test", (req, res) => {
  const query = "SELECT * FROM tbl_logins"; 

  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(200).json({ data: results });
  });
});

app.get("/test/:Id", (req, res) => {
  const userId = req.params.Id;
  const query = "SELECT * FROM tbl_logins WHERE Id = ?"; 

  con.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ data: results[0] });
  });
});

app.put("/password/:Id", (req, res) => {
  const { Id } = req.params;
  const { newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  const updatePasswordQuery = 'UPDATE tbl_logins SET Password = ? WHERE Id = ?';
  const updatePasswordValues = [newPassword, Id];

  con.query(updatePasswordQuery, updatePasswordValues, (updatePasswordErr, updatePasswordResults) => {
    if (updatePasswordErr) {
      console.error('Error updating password:', updatePasswordErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if any rows were affected 
    if (updatePasswordResults.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign({ userId: Id }, 'yourSecretKey', { expiresIn: '1h' });

    // If the password update is successful, send a success response with the token
    res.status(200).json({ message: 'Password updated successfully', token });
  });
});


module.exports = app;