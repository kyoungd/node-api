var env = process.env.NODE_ENV || 'development';
if (env == 'development') {
  process.env.API_END_POINT = 'http://localhost:3000/api';
  process.env.PORT = 3001;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
}
else if (env == 'test') {
  process.env.API_END_POINT = 'http://localhost:3000/api';
  process.env.PORT = 3001;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}

const { all } = require('./models/setup');
all ().then(()=> {
  console.log('setup complete');
});

console.log('>>>>>>>>>>>>>>>>>>>>>>', env);

// else if (env == 'production')

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var app = express();
app.use(bodyParser.json());

app.get('/api/donations', (req, res) => {
})

app.get('/api/donation/:donationId/', (req, res) => {
  var donationId = req.params.donationId;
})

app.get('/api/donation/:donationId/products/', (req, res) => {
  var donationId = req.params.donationId;
})

app.post('/todos', (req, res) => {
  // var todo = new Todo({
  //   text: req.body.text
  // });
  // todo.save()
  // .then((result) => {
  //   res.send(result);
  // })
  // .catch((err) => {
  //   res.status(400).send(err);
  // })
})

app.get('/todos', (req, res)=> {
  // Todo.find()
  //   .then((result) => {
  //     res.send({todo: result});
  //   })
  //   .catch((err)=> {
  //     res.status(400).send(err);
  //   })
})

app.get('/todos/:id', (req, res)=> {
  var id = req.params.id;
  // if (!ObjectId.isValid(id))
  //   return res.status(404).send('Invalid ID type.');
  // Todo.findById(id)
  //   .then((doc) => {
  //     if (!doc)
  //       return res.status(404).send('Todo not found.');
  //     return res.send({text: doc});
  //   })
  //   .catch((err) => {
  //     res.status(404).send(err);
  //   });
})

app.patch('/todos/:id', (req, res)=> {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  // if (!ObjectId.isValid(id))
  //   return res.status(404).send('Invalid ID type.');

  // if (_.isBoolean(body.completed) && body.completed) {
  //   body.completedAt = new Date().getTime();
  // }
  // else {
  //   body.completed = false;
  //   body.completedAt = null;
  // }

  // Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
  //   .then((result) => {
  //     res.send({data: result});
  //   })
  //   .catch((err)=> {
  //     res.status(404).send('ERROR: ', err);
  //   })
})

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  // if (!ObjectId.isValid(id))
  //   return res.status(404).send('Invalid ID type.');
  // Todo.findByIdAndRemove(id)
  //   .then((result) => {
  //     if (!result)
  //       return res.status(404).send('ID not found.');
  //     res.send({data: result});
  //   })
  //   .catch((err) => {
  //     res.status(404).send('ERROR: ', err);
  //   })
})

let port = process.env.PORT;
app.listen(port, ()=> {
  console.log(`Started on port ${port}`);
});

module.exports.app = app;
