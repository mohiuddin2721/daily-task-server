const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e4q8k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('daily-task').collection('task');

        // get task
        app.get('/task', async (req, res) => {
            const query = {};
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })

        // post task
        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

        // update task by id
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    completed: task.completed
                },
            };
            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
            console.log(result);
        })
    }
    finally { }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('My Daily Task are running!!!')
})

app.listen(port, () => {
    console.log(`My daily task listening on port ${port}`)
})