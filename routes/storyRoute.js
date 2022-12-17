
import express from 'express';
import Story from '../models/storyModel.js';
import User from '../models/userModel.js';


const StoryRouter=express.Router();

StoryRouter.post('/add',async(req,res)=>{
    const newStory = new Story(req.body);
    try{

        const savedStory = await newStory.save();
        res.status(200).json(savedStory);

    }catch(error){
     res.status(500).json(error);
    }
})

StoryRouter.get('/all/:userId',async(req,res)=>{
    try{
    
        const currentUser= await User.findById(req.params.userId);
        const userStories = await Story.find({userId:currentUser._id});
        const friendStory = await Promise.all(currentUser.following.map((friendId)=>{
            return Story.find({userId:friendId})
        })
   );
   res.status(200).json(userStories.concat(...friendStory))

    }catch(error){
        res.status(500).json(error);
    }
})

 
export default  StoryRouter;