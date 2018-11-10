const { ObjectId } = require('mongodb');
const expect = require('chai').expect;
const request = require('supertest');

const { app } = require('../server/server');
const { Todo } = require('../server/models/todo');

describe('POST /todos', ()=> {

  const todos = [
    {_id: new ObjectId(), text: 'first item on the collection.', completed: false, completedAt: new Date().getTime()},
    {_id: new ObjectId(), text: 'second item on the collection.', completed: false, completedAt: new Date().getTime()}
  ];

  beforeEach((done)=> {
    Todo.remove({}).then(()=> {
      return Todo.insertMany(todos);
    })
    .then(()=> done());
  });

  it('should create a new todo POSt', (done)=> {
    var text = 'Test todo test';
    request(app)
      .post('/todos')
      .send({text: text})
      .expect(200)
      .expect((res)=> {
        expect(res.body.text).to.equal(text);
      })
//      .end(done);
      .end((err, res)=> {
        if (err)
          return done(err);
        Todo.find({text}).then((todos)=> {
          expect(todos).to.have.lengthOf(1);
          expect(todos[0].text).to.equal(text);
          done();
        }).
        catch((err) => done(err));
      });
  })

  it('should not create a new todo with invalid POST', (done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      // .end(done);
      .end((err, res) => {
        if (err)
          return done(err);
        Todo.find().then((todos)=> {
          expect(todos).to.have.lengthOf(2);
          done();
        })
        .catch((err) => done(err));
      });
  });

  it('should get all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo).to.have.lengthOf(2)
      })
      .end(done);
  });

  describe('GET /todos/:id tests', () => {
    it('should return a valid todo with an id', (done)=> {
      // console.log('>>>>>>>>>>>> ', JSON.stringify(todos, undefined, 2));
      let id = todos[0]._id;
      request(app)
        .get(`/todos/${id}`)
        .expect(200)
        .expect((res)=>{
          // console.log(' ');
          // console.log('>>>>>>>>>>>> ', JSON.stringify(res.body, undefined, 2));
          // console.log(' ');
          expect(res.body.text.text).to.equal(todos[0].text);
        })
        .end(done);
    });

    it('should return a 404 with an wrong id', (done)=> {
      let id = '49c18925e18e500c50bb8d38';
      request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
      });


    it('should return a 404 with an invalid id', (done)=> {
      let id = '49c18925e18e500c50bb8d38aaa';
      request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
      });
  })

  describe('DELETE /todos/:id', ()=> {
    it('should delete a valid todo with an id', (done)=> {
      let id = todos[0]._id;
      request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res)=> {
          // console.log(' ');
          // console.log('>>>>>>>>>>>> ', JSON.stringify(res.body, undefined, 2));
          // console.log(' ');
          expect(res.body.data.text).to.equal(todos[0].text);
          expect(res.body.data._id).to.equal(id.toHexString());
        })
        .end((err, res)=> {
          expect(err).to.be.null;
          Todo.findById(id)
            .then((todo)=>{
              expect(todo).to.be.null;
              done();
            })
            .catch((err)=> {
              done(err);
            })
        });
    });
    it('should return a 404 with a wrong id', (done)=> {
      let id = '49c18925e18e500c50bb8d38aaa';
      request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
    it('should return a 404 with an invalid id', (done)=> {
      let id = '49c18925e18e500c50bb8d38aaa';
      request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /todos/:id', ()=> {
    var id = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    it('should update a valid todo with an id to completed', (done)=> {
      request(app)
        .patch(`/todos/${id}`)
        .send({completed: true, text})
        .expect(200)
        .expect((res)=> {
          expect(res.body.data.completed).to.equal(true);
          expect(res.body.data.text).to.equal(text);
        })
        // .end(done);
        .end((err, res) => {
          if (err)
            done(err);
          Todo.findById(id)
            .then((result) => {
              expect(result.completed).to.equal(true);
              expect(result.text).to.equal(text);
              done();
            })
            .catch((err) => {
              done(err);
            })
        });
    })

    it('should update the completed of a valid todo with an id', (done)=> {
      var completed = false;
      request(app)
        .patch(`/todos/${id}`)
        .send({ completed })
        .expect(200)
        .expect((res)=>{
          expect(res.body.data.completed).to.equal(completed);
        })
        .end((err, res) => {
          if (err)
            done(err);
          Todo.findById(id)
            .then((item) => {
              expect(item.completed).to.equal(completed);
              done();
            })
            .catch((err) => {
              done(err);
            })
        })
    })

  });

});
