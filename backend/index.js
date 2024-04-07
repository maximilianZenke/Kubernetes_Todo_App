// the basic idea for this setup was taken from 
// https://www.geeksforgeeks.org/how-to-connect-mongodb-with-reactjs/#:%7E:text=First%2C%20we%20create%20a%20react,MongoDB
// and modified to fit the requirements of the exercise

const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Todo-Db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to yourDB-name database');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();

const ToDoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['done', 'not done'],
    default: 'not done'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const ToDo = mongoose.model('ToDo', ToDoSchema);

const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
  resp.send("App is Working");
});

app.post("/addTodo", async (req, resp) => {
  try {
    const { text } = req.body;
    const todo = new ToDo({ text });
    await todo.save();
    resp.send(todo);
  } catch (error) {
    console.error('Error adding Todo:', error);
    resp.status(500).send('Something went wrong');
  }
});

app.listen(5000);
