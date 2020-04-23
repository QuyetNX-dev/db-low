
const express = require("express");
const app = express();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)

app.set('view engine', 'pug');
app.set('views', './views')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

db.defaults({ todos: []})
  .write()

app.get("/", (req, res) => {
  res.render('index.pug',{
    todos: db.get('todos').value()
  })
});

app.get("/todos", (req, res) => {
  if(req.query.q){
    var q = req.query.q;
    var matchedTodo = db.get('todos').value().filter(item => {
      return item.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
    res.render('todos.pug',{
      todos : matchedTodo
    })
  }
  res.send(`
    <h1 style='text-align: center;'>Vui lòng nhập Url theo /todos?q=</h1>
    <a style='display: block; text-align: center' href='/todos?q=nấu'>xem demo</a>
  `)
});

app.post('/todos/create',(req, res) => {
  if(req.body.name !== ""){
    let user = {id: db.get('todos').value().length + 1, name: req.body.name}
    db.get('todos').push(user).write();
    res.redirect('back')
  }
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
