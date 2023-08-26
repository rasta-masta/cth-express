const express = require ("express");
const ejs = require ("ejs");
const db = require("./dial-to-mysql");
const e = require("express");

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended : false})); 
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/add-contact", (req, res) => {
  res.render("add-contact", { title : "Add New Contact" })
  })
 
app.post("/save", (req, res) => {
  const { firstName, lastName, phone, email, note } = req.body
  
  const sql = "INSERT INTO contacts (firstName, lastName, phone, email, note) values (?, ?, ?, ?, ?)";

  db.query(sql, [firstName, lastName, phone, email, note], (err, result) => {
    if(err) throw err
    res.redirect('/');
  });
});

app.get("/", (req, res) => {
  const sql = 'SELECT * FROM contacts';
  db.query(sql, (err, result) => {
  if(err) throw err;
    res.render('index', { contacts: result })
  });    
})

app.get("/details/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM contacts WHERE id=?`;
  
  db.query(sql, id, (err, result) => {
    if(err) {
      throw err;
    } else {
      res.render('data-details', {result})
    }
  })  
})

app.get("/details/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM contacts WHERE id=?';

  db.query(sql, id, (err, result) => {
    if(err) throw err;
    res.redirect('/');
  })
})

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM contacts WHERE id=?';

  db.query(sql, id, (err, result) => {
    if(err) throw err;
    // res.send(result);
    res.render('edit', {result});
  })
})

app.put("/edit/:id", (req, res) => {
  let { firstName, lastName, phone, email, note, id } = req.body;
 
  let sql = 'UPDATE contacts SET firstName= ? lastName=?  phone= ? email= ? note= ? where id= ?';

  db.query(sql, [firstName, lastName, phone, email, note, id], (err, result) => {
    if(err) throw err
    res.redirect('/', {contacts : result});
    // res.send('updated')
  });
});

app.listen(3000, () => {
  console.log('SERVER IS READY')
  
  db.connect(err => {
    if(err) throw(err)
    console.log("CONNECTED TO MYSQL");
  });
});


