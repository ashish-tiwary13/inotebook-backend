const express =require('express');
const router =express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');



//  ROUTE 1: fetch all notes using : GET "/api/auth/fetchallnote".  Login required

router.get('/fetchallnote', fetchuser , async (req,res)=>{
    try {    
    const fetchallnotes = await Note.find({user: req.user.id});
    res.json(fetchallnotes);

        //Catch errors
    } catch (err) {
        (err=> {console.log(err)
        res.json({error: "plz enter valid email",message:err.message})})
    }
})

//  ROUTE 2: Add a new notes using : POST "/api/auth/addnote".  Login required


router.post('/addnote', fetchuser , async (req,res)=>{
    try {    
        const {title,description,tag} = req.body;
        const note = new Note({
            title, description,tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    
    //Catch errors
    } catch (err) {
        (err=> {console.log(err)
        res.json({error: "plz enter valid email",message:err.message})})
    }
})


//  ROUTE 3: Update an existingnotes using : PUT "/api/note/updatenote".  Login required

router.put('/updatenote/:id', fetchuser , async (req,res)=>{
    try {    
        const {title,description,tag} = req.body;
        // Create a new note object
        const newNote ={};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
        // 
        let note = await Note.findById(req.params.id);
        // note don't exists
        if(!note){return res.status(404).send("Not Found")}
        // Matching user id 
        if(note.user.toString() !== req.user.id ){
            return res.status(401).send("Not Allowed");
        }
        
        // Find the note to be updated and update it
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.send({note});
    //Catch errors
    } catch (err) {
        (err=> {console.log(err)
        res.json({error: "plz enter valid email",message:err.message})})
    }
})

//  ROUTE 4: Deleting the note using : DELETE "/api/note/deletenote".  Login required

router.delete('/deletenote/:id', fetchuser , async (req,res)=>{
    try {    

        let note = await Note.findById(req.params.id);
        // note don't exists
        if(!note){return res.status(404).send("Not Found")}
        // Matching user id 
        if(note.user.toString() !== req.user.id ){
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        console.log(note);
        res.send({"Note Deleted":"note deleted"});
    //Catch errors
    } catch (err) {
        (err=> {console.log(err)
        res.json({error: "plz enter valid email",message:err.message})})
    }
})


module.exports = router;