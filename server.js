//express
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const dotenv = require('dotenv')

//create an instance of express

const app=express();
app.use(cors());
app.use(express.json())
dotenv.config()

//sample inmemory storagefor todo items
// let todos = [];

//connecting db
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('db connected')
})
.catch((err)=>{
    console.log(err)
})

//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//create model
const todoModel = mongoose.model('Todo', todoSchema);

//create a new todo item
app.post('/todos', async (req, res)=>{
    const {title, description} = req.body;

    // const newTodo = {
    //     id: todos.length+1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos)
    try{
        const newTodo = new todoModel({title, description})
        await newTodo.save(); 
        res.status(201).json(newTodo);
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
   
})

//get all utems
app.get('/todos',async (req, res)=>{
    try{
      const todos =  await todoModel.find();
      res.json(todos);
    }catch(error){
        
    }
    
})

//update todo item
app.put('/todos/:id',async (req, res)=>{
    try{
         const {title, description} = req.body;
         const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description},
            {new: true}
        )
        if(!updatedTodo){
        return res.status(404).json({ message : "Todo Not found"})
        }
        res.json(updatedTodo)
    }catch(error){
         console.log(error)
        res.status(500).json({message: error.message})
    }
   
})

//delete item
app.delete('/todos/:id',async (req, res)=>{
    try{
        const id = req.params.id;
        await todoModel.findByIdAndDelete(
            id
         )
    res.status(204).end();
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
   
})

//start server
const port = process.env.PORT || 10000;
app.listen(port, ()=>{
    console.log("server listening " + port);

})