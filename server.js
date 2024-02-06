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
app.post('/register', async (req, res) => {
  const { id,Username, Password, confirmPassword } = req.body;

  
  if (Password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
   
    const hashedPassword = await bcrypt.hash(Password, 6);

    
    const query = `INSERT INTO tbl_logins (id, Username, Password) VALUES (?, ?, ?)`;
    const values = [id, Username, hashedPassword];

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
//creat User Login
app.post('/apis/creatLogin', (req, res) => {
  var LoginUsername = _.get(req, ['body','Username']);
  var LoginPassword = _.get(req, ['body','Password']);

  console.log('LoginUsername', LoginUsername)
  console.log('LoginPassword', LoginPassword)

  try {
    if (LoginUsername && LoginPassword) {
        con.query('select * from tbl_logins where Username = ? and Password = ?', [
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
    con.query('select * from tbl_logins', [],
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
//       con.query('select * from tbl_logins where Id = ?', [
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

// //update use login
// app.put('/apis/updataLogin', (req, res) => {
//   var id = _.get(req, ['body','Id']);
//   var Username = _.get(req, ['body','Username']);
//   var Password = _.get(req, ['body','Password']);

//   try {
//     if (id && Username && Password) {
//       con.query('update tbl_logins set Username = ?, Password = ? where Id = ?', [
//         Username, Password, parseInt(id)
//       ], (err, data, fil) => {
//         if (data) {
//           return res.status(200).json({
//             RespCode: 200,
//             RespMessage: 'successfully',
//           })
//         }
//         else {
//           console.log('ERR 2! : Update fail')
//           return res.status(200).json({
//             RespCode: 400,
//             RespMessage: 'bad: Update fail',
//             Log: 2
//           })
//         }
//       })
//     }
//     else {
//       console.log('ERR 1! : Invalid data')
//       return res.status(200).json({
//         RespCode: 400,
//         RespMessage: 'bad: Invalid data',
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

// //delete user login
// app.delete('/apis/delteLogin', (req, res) => {
//   var id = _.get(req, ['body','Id']);
  
//   try {
//     if (id) {
//       con.query('delete from tbl_logins where Id = ? ', [
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

module.exports = app;