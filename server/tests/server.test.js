const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server')// the .. goes back from the tests directory into the server directory from where we can acces server.js without passing the extension
const {Todo} = require('./../models/todo');

beforeEach((done) => { //executes before test cases 
    Todo.remove({})//wipes all the database
    .then(() => {
        done();
    });
})

describe('Post /todos', ()=>{
    it('should create a new todo', (done) =>{
        var text = 'Test todo text';
        request(app)
        .post('/todos')
        .send({//converted in a Json by supertest
            text:text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {//similar to mongoDb 
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) =>{
                return done(e);
            });
        });
    });
    it('should not create new todo', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            Todo.find().then((todos) => {//similar to mongoDb 
                expect(todos.length).toBe(0);
                done();
            }).catch((e) =>{
                return done(e);
            });
        });
    });
});