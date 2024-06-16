const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors());

const dbUri = 'mongodb://db:27017/Todo-Db';
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

let isConnected = false;
const maxRetries = 24; 
let retryCount = 0;

const connectWithRetry = () => {
    mongoose.connect(dbUri, connectionOptions).then(() => {
        console.log('Connected to Todo-Db database');
        isConnected = true;
    }).catch((error) => {
        retryCount++;
        console.error(`Error connecting to MongoDB (attempt ${retryCount}):`, error);
        if (retryCount < maxRetries) {
            setTimeout(connectWithRetry, 5000);
        } else {
            console.error('Failed to connect to MongoDB after multiple attempts. Exiting...');
            process.exit(1);
        }
    });
};

connectWithRetry();

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

const startServer = () => {
    if (isConnected) {
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    } else {
        setTimeout(startServer, 1000);
    }
};

startServer();

app.get("/", (req, res) => {
    res.send("App is Working");
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await ToDo.find();
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Error fetching todos' });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const updatedTodo = await ToDo.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Error updating todo' });
    }
});

app.post('/addTodo', async (req, res) => {
    try {
        const { text, status } = req.body;
        const todo = new ToDo({ text, status });
        await todo.save();
        res.json(todo);
    } catch (error) {
        console.error('Error adding Todo:', error);
        res.status(500).json({ error: 'Error adding Todo' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await ToDo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(deletedTodo);
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Error deleting todo' });
    }
});

