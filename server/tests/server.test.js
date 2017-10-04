const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server')// the .. goes back from the tests directory into the server directory from where we can acces server.js without passing the extension
const {Todo} = require('./../models/todo');
const {ObjectId} = require('mongodb');



const todos = [{//2 dummy data
    _id: new ObjectId(),
    text: 'First test todo'
}, {
    _id: new ObjectId(),
    text: 'Second test todo'
}];
beforeEach((done) => { //executes before test cases 
    Todo.remove({})//wipes all the database
    .then(() => {
        //done();
        return Todo.insertMany(todos);
        //done();
    }).then(() => done());
});

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

            Todo.find({text}).then((todos) => {//similar to mongoDb 
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
            Todo.find().then((todos) => {//Querrying data with Mangoose, similar to mongoDb 
                expect(todos.length).toBe(2);//2 from the dummy data added above 
                done();
            }).catch((e) =>{
                return done(e);
            });
        });
    });
});

describe('GET /todos', ()=>{
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)//expect that a 200 comes back
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);// THERE IS NO NEED TO PROVIDE A FUNCTION TO END LIKE WE ARE DOING UP ABOVE
                   // BECAUSE WE ARE NOT DOING ANYTHING ASYNCHRONOUSLY
    });
});
describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        }).end(done);
    });
});

it('should return a 404 if todo not found', (done) => {
    var _id = new ObjectId();
    request(app)
    .get(`/todos/${_id.toHexString}`)
    .expect(404)
    .end(done);
});

it('should return a 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
});

describe('DELETE /todos/:id', () => {
    var _id = todos[0]._id.toHexString();
    it('should delete a record', (done) => {
        request(app)
        .delete(`/todos/${_id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(_id);//aici conteaza toHexString. Daca nu il folosesti, vede id.ul ca fiind diferint de string(cred ca il extrage ca objectId)
        })
        .end((err, res) =>{
            if(err){
                return done(err); //if we have an error there is no need to continue the function execution. There is no need to querry the database to see if we deleted the item
            }
            Todo.findById(_id).then((result) =>{
                expect(result).toNotExist();
                done();
            }).catch((e) =>{
                return done(e);
            })
        });
    });
    it('should return 404 if todo not found', (done) => {
        var _id = new ObjectId();
        request(app)
        .delete(`/todos/${_id.toHexString}`)
        .expect(404)
        .end(done);
    });
    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete('/todos/123abc')
        .expect(404)
        .end(done);
    });

});