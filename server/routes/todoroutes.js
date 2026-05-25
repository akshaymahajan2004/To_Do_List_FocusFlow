const express = require("express");
const router = express.Router();
const todo = require("../models/todo");


// Create TO-DO:

router.post("/",async(req,res) =>{
    try{
        const newTodo = new todo({
            title: req.body.title
        });

        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo)
    } catch(error){
        res.status(500).json({message:"Internal Server error"});
    }
});


// Get ALL TO-DO : 

router.get("/", async(req,res) => {
    try {
        const todos = await todo.find();

        res.status(200).json(todos);
    } catch(error){
        res.status(500).json(error);
    }
})


// Delete TO-DO :

router.delete("/:id", async(req,res) =>{
    try{
        await todo.findByIdAndDelete(req.params.id);

        res.status(200).json("To-do Deleted");
    } catch(error){
        res.status(500).json(error);
    }
});


// Update To-do :

router.put("/:id", async(req,res) =>{
    try{
        const updatedTodo = await todo.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },

            {
                returnDocument: 'after'
            }
        );
        res.status(200).json(updatedTodo);
    } catch(error){
        res.status(500).json(error);
    }
})


module.exports = router;