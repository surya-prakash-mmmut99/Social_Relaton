
import express from 'express';
import bcrypt from 'bcryptjs';

import User from '../models/userModel.js';

const UserRouter = express.Router();

UserRouter.post('/registration', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        userauth: req.body.userauth,
        password: bcrypt.hashSync(req.body.password),
        imageprofile: req.body.imageprofile || './assets/image/upload/user1.png',
        imagecover: req.body.imagecover || './assets/image/upload/account.jpg',
    });

    const user = await newUser.save();
    res.send({
        _id:user._id,
        username: user.username,
        userauth: user.userauth,
        imageprofile: user.imageprofile,
        imagecover: user.imagecover,
        following: user.following,
        followers: user.followers
    })
});


//login

UserRouter.post('/login', async(req,res)=>{
    const user = await User.findOne({userauth:req.body.userauth});

    if(user){

        if(bcrypt.compareSync(req.body.password,user.password)){
            res.send({
                _id:user._id,
                username: user.username,
                userauth: user.userauth,
                imageprofile: user.imageprofile,
                imagecover: user.imagecover,
                following: user.following,
                followers: user.followers
            })
        }
    }
})

UserRouter.get('/:id',async(req,res) => {

    try{
    
        const user=await User.findById(req.params.id);
        if(user){
            res.send(user);
        }else{
            res.status(404).send({message:'User not found'});
        }
      
    }catch(error){
        res.status(500).json(error);
    } 
})


UserRouter.get("/friends/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.following.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, imageprofile} = friend;
        friendList.push({ _id, username, imageprofile});
      });
      res.status(200).json(friendList)
    } catch (err) {
      res.status(500).json(err);
    }
});

//grt all user
UserRouter.get("/",async(req,res)=>{
    const users = await User.find();
    res.send(users)
});


//follow user -> put or update followings
UserRouter.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { following: req.params.id } });
          res.status(200).json("User has been followed");
        } else {
          res.status(403).json("You allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You cant follow yourself");
    }
  });


//unfollow user
UserRouter.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { following: req.params.id } });
          res.status(200).json("User has been unfollowed");
        } else {
          res.status(403).json("You don't follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can't unfollow yourself");
    }
  });


  UserRouter.put("/update/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account has been updated");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
  });


export default UserRouter;