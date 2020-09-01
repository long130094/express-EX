const express = require('express')
const app = express()
const port = 3000
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')
const adapter = new FileSync('db.json')
const db = low(adapter)
//Set some defaults (required if your JSON file is empty)
db.defaults({ users: [] })
  .write()
//Add a post 
// db.get('users')
//   .push({ id: 1, title: 'lowdb is awesome'})
//   .write()
// const bodyParser = require('body-parser'); NO NEED 
app.set('view engine', 'pug');
app.set('views', './views')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

let users = db.get('users').value();

// let users =  [
//   {id: 1, name: 'Hoang'},
//   {id :2, name : 'Long'}, 
//   {id :3, name: 'Pham'}
//   ]
app.get('/', (req, res) => {
  res.render("./index.pug", {
    name: 'AAA'
  });
})
app.get('/user', (req, res) => {
  res.render("users/index", {
    users: users
  })
})
app.get('/todos', (req, res) => {
  res.send('<ul> <li> Go market </li> <li>Cooking</li> <li>Cleaning disk</li> <li>studyng</li> </ul>')
})
//function to Searching
app.get('/user/search', (req, res) => {
  let q = req.query.q;
  let matchUser = users.filter((user) => {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });

  console.log(matchUser)

  res.render("users/index", {
    users: matchUser,
    question: q
  });

});
//
app.get("/user/create", (req, res) => {
  res.render("users/create");

})
//View usser
app.get("/user/:id", (req, res) => {
  let id = req.params.id;
  let user = db.get('users').find({ id: id }).value();
  res.render("users/view", {
    user: user
  });

});
//Delete user
app.get("/user/:id/delete", (req, res) => {
  let id = req.params.id;
  db.get('users')
    .remove({ id: id })
    .write()
  res.render("users/index",{
    users: users
  });
})


app.post("/user/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get('users').push(req.body).write();
  res.redirect("/user");

})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
