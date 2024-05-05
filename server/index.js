const express = require ("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const mysql = require('mysql');
require ("dotenv").config()
const multer = require('multer')


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: "crud",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// search
app.post("/api/search", (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
  
    const sqlQuery = "select * from users where  username=? and password=?";
    db.query(sqlQuery, [name,password], (err, result) => {
        res.send(result);
        console.log(err)
    });
});


  
//count
app.get('/api/count', (req, res) => {
    const sqlCount = 'SELECT COUNT(*) AS rowCount FROM users';
    db.query(sqlCount,(err,result)=>{
        res.send(result);
    })
  });

//User information
app.get("/api/get",(req,res)=>{
    const sqlSelect = "select * from users";
    db.query(sqlSelect,(err,result)=>{
        res.send(result);
    })
})

// questions fetch
app.get("/api/schedule1",(req,res)=>{
    const sqlSelect = "select * from questions";
    db.query(sqlSelect,(err,result)=>{
        res.send(result);
        
    })
})

// points fetch
app.get("/api/tickets",(req,res)=>{
    const sqlSelect = "select * from points";
    db.query(sqlSelect,(err,result)=>{
        res.send(result);
    })
})

//submission fetch
app.get("/api/tickets1",(req,res)=>{
    const sqlSelect = "select * from submisions";
    db.query(sqlSelect,(err,result)=>{
        res.send(result);
    })
})

//delete
app.delete("/api/deleteticket/:idtickets", (req, res) => {
    const id = req.params.idtickets;
    const sqldelete = "DELETE FROM users WHERE idusers=?";
    
    db.query(sqldelete, id, (err, result) => { 
        if (err) {
            console.log(err);
            console.log(id);
            res.status(500).send("Error deleting news"); 
        } else {
            console.log("News deleted successfully");
            res.status(200).send("News deleted successfully"); 
        }
    });
});

//delete points
app.delete("/api/deletepoints/:idtickets", (req, res) => {
    const id = req.params.idtickets;
    const sqldelete = "DELETE FROM points WHERE idpoints=?";
    
    db.query(sqldelete, id, (err, result) => { 
        if (err) {
            console.log(err);
            console.log(id);
            res.status(500).send("Error deleting news"); 
        } else {
            console.log("News deleted successfully");
            res.status(200).send("News deleted successfully"); 
        }
    });
});

// Login 
app.post("/api/insert", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const sqlQuery = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sqlQuery, [username, password], (err, results) => {
        if (err) {
            res.status(500).json({ error: "An error occurred while processing your request" });
        } else {
            if (results.length > 0) {
                res.send({message:'user insert'})
               
            } else {
               
                res.status(401).json({ error: "Invalid username or password" });
                console.log(err)
            }
        }
    });
});

//admin login server
app.post("/api/adminlogin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const sqlQuery = "SELECT * FROM admin WHERE username = ? AND password = ?";
    db.query(sqlQuery, [username, password], (err, results) => {
        if (err) {
            res.status(500).json({ error: "An error occurred while processing your request" });
        } else {
            if (results.length > 0) {
                res.send({message:'user insert'})
               
            } else {
                
                res.status(401).json({ error: "Invalid username or password" });
                console.log(username)
            }
        }
    });
});

//Sign up
app.post("/api/signup", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const school = req.body.school;
    const date = req.body.date;
    const username = req.body.username;
    const password = req.body.password;

    const sqlQuery = "INSERT INTO users (name, email, school, contact, date, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sqlQuery, [name, email, school, contact, date, username, password], (err, result) => {
        if (err) {
            res.status(500).json({ error: "An error occurred while processing your request" });
            console.log(err);
        } else {
            res.status(200).json({ message: "User inserted successfully" });
        }
    });
});

//points server
app.post("/api/points", (req, res) => {
    const qid = req.body.qid;
    const studentid = req.body.studentid;
    const points = req.body.points;
    
    const sqlQuery = "INSERT INTO points (qid, studentid, points) VALUES (?, ?, ?)";
    const sqlUpdateQuery = "UPDATE submissions SET status = 'done' WHERE idsubmisions = ?";
    db.query(sqlQuery, [qid, studentid, points], (err, result) => {
        if (err) {
            res.status(500).json({ error: "An error occurred while processing your request" });
            console.log(err);
        } else {
            res.status(200).json({ message: "points inserted successfully" });
        }
    });
    
});

//update status
app.post("/api/updatestatus", (req, res) => {
    
    const idsubmision = req.body.idsubmision;

    const sqlQuery = "UPDATE submisions SET status = 'done' WHERE idsubmisions = ?";
    db.query(sqlQuery, [idsubmision], (err, result) => {
        if (err) {
            res.status(500).json({ error: "An error occurred while processing your request" });
            console.log(err);
        } else {
            res.status(200).json({ message: "done" });
        }
    });
    
});

//image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/src/images'); // specify the directory for storing uploaded images
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // keep the original file name
    }
  });
  
  const upload = multer({ storage: storage });
  
  app.post('/upload', upload.single('image'), (req, res) => {
    res.send('Image uploaded successfully');
  });

//submission
app.post("/api/submission", upload.single('image'), (req, res) => {
    const qid = req.body.qid;
    const studentid = req.body.studentid;
    const { originalname } = req.file;
    
    

    const sqlQuery = "INSERT INTO submisions (qid, studentid,image) VALUES ( ?, ?, ?)";
    db.query(sqlQuery, [qid, studentid,originalname], (err, result) => {
        if (err) {
            res.status(500).json({ error: "An error occurred while processing your request" });
            console.log(err);
        } else {
            res.status(200).json({ message: "User inserted successfully" });
        }
    });
});

//question 3
app.post("/api/q3", (req, res) => {
    const qid = req.body.qid;
    const studentid = req.body.studentid;
    const answer = req.body.answer;
    
    const sqlQuery = "INSERT INTO submisions (qid, studentid, answer) VALUES (?, ?, ?)";
    db.query(sqlQuery, [qid, studentid, answer], (err, result) => {
        if (err) {
            res.status(500).json({ error: "An error occurred while processing your request" });
            console.log(err);
        } else {
            res.status(200).json({ message: "points inserted successfully" });
        }
    });
    
});


// ticket buy
app.post("/api/signup1", (req, res) => {
    const name = req.body.name;
    
    const sqlQuery = "select * from submisions where  status=?";
    db.query(sqlQuery, [name], (err, result) => {
        res.send(result);
        
    });
});

//fetch submissions
app.post("/api/signup2", (req, res) => {
    const name = req.body.name;
   
    const sqlQuery = "select * from submisions where  idsubmisions=?";
    db.query(sqlQuery, [name], (err, result) => {
        res.send(result);
       
    });
});


// Newsinsert
app.post("/api/news", (req, res) => {
    const headline = req.body.headline;
    const description = req.body.description;
    const date = req.body.date;
    const location = req.body.location;

    const sqlQuery = "INSERT INTO news (headline, description, date, location) VALUES (?, ?, ?, ?)";
    db.query(sqlQuery, [headline, description, date, location], (err, result) => {
        if (err) {
            res.status(500).json({ error: "An error occurred while processing your request" });
            console.log(date);
        } else {
            res.status(200).json({ message: "User inserted successfully" });
            console.log('news inserted')
            console.log(date)
        }
    });
});

//News update
app.post('/api/newsupdate/:id', (req, res) => {
    
    const id = req.params.id;
  const { headline, description, date, location } = req.body;
  
    const sql = `UPDATE news SET headline=?, description=?, date=?, location=? WHERE idnews=?`;
    db.query(sql, [headline, description, date, location,id], (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        console.log(date);
        res.status(500).json({ error: 'Error updating data' });
        return;
      }
      console.log(err);
      console.log(date);
      res.status(200).json({ message: 'Data updated successfully' });
    });
  });


//Ticket update
app.post('/api/ticketupdate/:id', (req, res) => {
    
    const id = req.params.id;
  const { points } = req.body;
  
    const sql = `UPDATE points SET points=? WHERE idpoints=?`;
    db.query(sql, [points,id], (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        console.log(id);
        res.status(500).json({ error: 'Error updating data' });
        return;
      }
      console.log(err);
     
      res.status(200).json({ message: 'Data updated successfully' });
    });
  });

  // row count
  app.get('/api/rowcount', (req, res) => {
    connection.query('SELECT COUNT(*) AS row_count FROM your_table_name', (error, results, fields) => {
      if (error) throw error;
      res.json(results[0].row_count);
    });
  });


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});