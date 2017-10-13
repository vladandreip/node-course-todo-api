const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server')// the .. goes back from the tests directory into the server directory from where we can acces server.js without passing the extension
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectId} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')


beforeEach(populateUsers);
beforeEach(populateTodos);

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
describe('PATCH /todos:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'This is the new todo'
        request(app)
        .patch(`/todos/${id}`)
        .send({
            completed: true, 
            text
        })
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.completed).toBe(true);
            expect(response.body.todo.text).toBe(text);
            expect(response.body.todo.completedAt).toBeA('number');
            
        })
        .end(done);
    });
    it('should clear(set null) completedAt when todo is not completed', (done) =>{
        var id = todos[1]._id.toHexString();
        var text = 'New test'
        request(app)
        .patch(`/todos/${id}`)
        .send({
            text,
            completed: false
        })
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.completed).toBe(false);
            expect(response.body.todo.text).toBe(text);
            expect(response.body.todo.completed).toNotExist();
        })
        .end(done);

    });
})

describe('GET /users/me', () => {
    it('should return user if authendicated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((response) => {
            expect(response.body._id).toBe(users[0]._id.toHexString());
            expect(response.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it('should return a 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});
describe('Post /users', () => {
    it('should create a user', (done) => {
        request(app)
        .post('/users')
        .send({
            email:'vlad@gmaileanu.com',
            password:'123456'
        })
        .expect(200)
        .expect((res) => {
            console.log(res.body);
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe('vlad@gmaileanu.com');
        })
        .end(done);
    });
    it('should return validation errors if request invalid', (done) => {
        request(app)
        .post('/users')
        .send({
            email:'abc',
            password:'123'
        })
        .expect(400)
        .end(done);
        
    });
     it('should not create user if email in use', (done) => {
        request(app)
        .post('/users')
        .send({
            email: "vlad@example.com",
            password: '123456'
        })
        .expect(400)
        .end(done);
    });
})
describe('Post /users/login', ()=>{
    it('should login user and return auth token', (done)=>{
        request(app)
        .post('/users/login')
        .send({
            email:users[0].email,
            password:users[0].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
        })
        //.end(done);
        .end((err, res) => {
            if(err){
                return done(err);
            }
            User.findOne({email: res.body.email}).then((user) => {
                console.log(user);
                expect(res.headers['x-auth']).toBe(user.tokens[1].token);
                done();
            }).catch((e) =>{
                return done(e);
            });
        })
    })
    it('should reject invalid login', (done)=>{
        request(app)
        .post('/users/login')
        .send({
            email:users[0].email,
            password:'badPass'
        })
        .expect(400)
        .end(done);
    })
});
describe('DELETE /users/me/token', ()=>{
    it('should remove auth token on logout', (done)=>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, res) =>{
            if(err){
                return done(err);
            }
            User.findById(users[0]._id).then((user) =>{
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) =>{
                return done(e);
            });
        });
    
    });
})