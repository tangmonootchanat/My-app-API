const express = require('express');
const app = express();
const mysql = require('mysql');
const _ = require('lodash');
const bodyParser = require('body-parser')
const cors = require('cors');
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

//Som-o
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

//creat User Login Tang-mo
app.post('/apis/creatLogin', (req, res) => {
  const LoginUsername = req.body.Username;
  const LoginPassword = req.body.Password;

  console.log('LoginUsername', LoginUsername)
  console.log('LoginPassword', LoginPassword)

  try {
    if (LoginUsername && LoginPassword) {
        con.query('SELECT * FROM tbl_logins WHERE Username = ? AND Password = ?', [
          LoginUsername, LoginPassword
        ], (err, data, Field) => {
          if (data && data.length > 0) {
            const Id = data[0].Id;
            const Username = data[0].Username;

            const token = jwt.sign({ Id, Username }, 'my_secure_secret_key_for_jwt', { expiresIn: '1h' });

            return res.status(200).json({
              RespCode: 200,
              RespMessage: ' Login สำเร็จแล้ว! ',
              Id,
              Username,
              token
            })  
          } else {
            console.log('ERR 2! : ไม่พบข้อมูลผู้ใช้งาน');
            return res.status(401).json({
              RespCode: 401,
              RespMessage: 'bad: ไม่พบข้อมูลผู้ใช้งาน',
              Log: 2
            })
          }
        })
    } else {
      console.log('ERR 1! : กรุณากรอกข้อมูลการ Login')
      return res.status(400).json({
        RespCode: 400,
        RespMessage: 'bad: กรุณากรอกข้อมูลการ Login',
        Log: 1
      })
    }
  }
  catch(error) {
    console.log('ERR 0! :', error)
    return res.status(500).json({
      RespCode: 500,
      RespMessage: 'เกิดข้อผิดพลาด ลองใหม่ภายหลัง',
      Log: 0
    })
  }
})

//get Usr Login
app.get('/apis/getallLogin', (req, res) => {
  try {
    con.query('SELECT * FROM tbl_logins', [],
    (err, data, Fil) => {
      if (data && data[0]){
        return res.status(200).json({
          RespCode: 200,
          RespMessage: 'successfully',
          Result: data
        })
      }
      else {
        console.log('ERR 1! : ไม่พบข้อมูล')
        return res.status(400).json({
          RespCode: 400,
          RespMessage: 'bad: ไม่พบข้อมูล',
          Log: 1
        })
      }
    })
  }
  catch(error) {
    console.log('ERR 0! :', error)
    return res.status(400).json({
      RespCode: 400,
      RespMessage: 'bad',
      Log: 0
    })
  }
})

// //get by id

// app.get('/apis/getLoginbyID', (req, res) => {
//   var loginid = _.get(req, ['body','Id']);

//   try {
//     if (loginid) {
//       con.query('SELECT * FROM tbl_logins WHERE Id = ?', [
//         loginid
//       ],
//       (err, data, Fil) => {
//         if (data && data[0]){
//           return res.status(200).json({
//             RespCode: 200,
//             RespMessage: 'successfully',
//             Result: data
//           })
//         }
//         else {
//           console.log('ERR 1! : Invalid data')
//           return res.status(200).json({
//             RespCode: 400,
//             RespMessage: 'bad: Invalid data',
//             Log: 1
//           })
//         }
//       })
//     }
//     else {
//       console.log('ERR 2! : not found data')
//       return res.status(200).json({
//         RespCode: 400,
//         RespMessage: 'bad: not found data',
//         Log: 2
//       })
//     }
//   }
//   catch(error) {
//     console.log('ERR 0! :', error)
//     return res.status(200).json({
//       RespCode: 400,
//       RespMessage: 'bad',
//       Log: 0
//     })
//   }
// })

// Update user password
// app.put('/apis/updataPassword/:Id', (req, res) => {
//   const Id = req.params.Id; // รับ Id จาก URL parameter
//   const { Username, newPassword, confirmNewPassword } = req.body;

//   // ตรวจสอบว่ารหัสผ่านใหม่และยืนยันรหัสผ่านตรงกันหรือไม่
//   if (newPassword !== confirmNewPassword) {
//     return res.status(403).json({ error: 'Passwords do not match' });
//   }

//   try {
//     // ตรวจสอบว่ามีข้อมูลที่จำเป็นสำหรับการอัปเดตหรือไม่
//     if (Id && Username && newPassword && confirmNewPassword) {
//       // ทำการอัปเดตข้อมูลในฐานข้อมูล
//       const updateQuery = 'UPDATE tbl_logins SET Password = ? WHERE Id = ? AND Username = ?';
//       const updateValues = [newPassword, Id, Username];
//       con.query(updateQuery, updateValues, (err, data, fields) => {
//         if (err) {
//           console.log('Error updating user data:', err);
//           return res.status(400).json({
//             RespCode: 400,
//             RespMessage: 'bad: Unable to update user data',
//             Log: 2
//           });
//         } else {
//           console.log('User data updated successfully!');
//           return res.status(200).json({
//             RespCode: 200,
//             RespMessage: 'User data updated successfully!',
//           });
//         }
//       });
//     } else {
//       console.log('ERR 1! : Please provide necessary data for update')
//       return res.status(401).json({
//         RespCode: 401,
//         RespMessage: 'bad: Please provide necessary data for update',
//         Log: 1
//       })
//     }
//   }
//   catch(error) {
//     console.log('ERR 0! :', error)
//     return res.status(500).json({
//       RespCode: 500,
//       RespMessage: 'Error occurred. Please try again later',
//       Log: 0
//     })
//   }
// })

// //delete user login
// app.delete('/apis/delteLogin', (req, res) => {
//   var id = _.get(req, ['body','Id']);
  
//   try {
//     if (id) {
//       con.query('DELETE FROM tbl_logins WHERE Id = ? ', [
//         parseInt(id)
//       ], (err, resp, fil) => {
//         if (resp) {
//           return res.status(200).json({
//             RespCode: 200,
//             RespMessage: 'Delete successfully',
//           })
//         }
//         else {
//           console.log('ERR 2! : bad sql')
//           return res.status(200).json({
//             RespCode: 400,
//             RespMessage: 'bad: bad sql',
//             Log: 2
//           })
//         }
//       })
//     }
//     else {
//       console.log('ERR 1! : Invalid id')
//       return res.status(200).json({
//         RespCode: 400,
//         RespMessage: 'bad: Invalid id',
//         Log: 1
//       })
//     }
//   }
//   catch(error) {
//     console.log('ERR 0! :', error)
//     return res.status(200).json({
//       RespCode: 400,
//       RespMessage: 'bad',
//       Log: 0
//     })
//   }
// })

//E-ham
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

  // Check if new passwords match
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
    
  }

  // Update the password in the database
  const updatePasswordQuery = 'UPDATE tbl_logins SET Password = ? WHERE Id = ?';
  const updatePasswordValues = [newPassword, Id];

  con.query(updatePasswordQuery, updatePasswordValues, (updatePasswordErr, updatePasswordResults) => {
    if (updatePasswordErr) {
      console.error('Error updating password:', updatePasswordErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if any rows were affected (i.e., if the user with the specified ID exists)
    if (updatePasswordResults.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the password update is successful, send a success response
    res.status(200).json({ message: 'Password updated successfully' });
  });
});


module.exports = app;