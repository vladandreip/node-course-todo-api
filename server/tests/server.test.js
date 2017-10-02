const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server')// the .. goes back from the tests directory into the server directory from where we can acces server.js without passing the extension
const {Todo} = require('./../models/todo');

beforeEach((done) => { //executes before test cases 
    Todo.remove({})//wipes all the database
    .then(() => {
        //done();
        return Todo.insertMany(todos);
    }).then(() => done());
});

const todos = [{//2 dummy data
    text: 'First test todo'
}, {
    text: 'Second test todo'
}];

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
    })
})