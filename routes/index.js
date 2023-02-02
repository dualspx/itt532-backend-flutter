const express = require('express')
var router = express.Router()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookie = require('cookie')
const mongodb = require('mongodb');
const User = require('../models/user');
const Project = require('../models/project')
const jwt = require('jsonwebtoken');
const ObjectID = mongodb.ObjectId;
const secret = 'rahsia'

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    console.log(req.body.email, req.body.password)
    try {
        User.findOne({ email: req.body.email, password: req.body.password }, async function (err, data) {
            if (data) {
                const token = jwt.sign({ data }, secret)
                console.log('data', token)
                return res.cookie('access_token', token, {
                    httpOnly: true,
                    secure: secret
                }).status(200).send({ data: data.username, token: token })
            }
            else {
                res.status(200).send('No account found')
                console.log(err)
            }
        })
    } catch (e) { res.send(e); }

})

router.get('/home', (req, res) => {
    console.log(req.cookies.data)
    res.render('home.ejs')
})

router.get('/', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    try {
        const newUser = User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        User.findOne({ username: req.body.username }, (err, data) => {
            if (err) console.log(err)

            else if (data) res.send('The username is taken')

            else {
                newUser.save((err) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    else {
                        console.log('Successfuly register')
                        res.status(200).send('Successfuly register')
                        // res.redirect('/login')
                    }
                })
            }
        })

    }
    catch (err) {
        res.send(err)
    }
})

router.post('/editPage', (req, res) => {
    const tokenJS = req.body.token
    const token = JSON.parse(tokenJS)
    const data = jwt.verify(token, secret);
    // console.log(token)
    // console.log("TOKEN FROM FLUTTER:", token)
    if (!token) {
        return res.sendStatus(202)
    }
    try {
        // const data = jwt.verify(token, secret)
        console.log(data.data)
        return res.status(200).send(data.data)
    } catch (error) {
        console.log(error)
    }
})

router.put('/editProfile', async (req, res) => {

    var token = req.headers["authorization"];
    if (!token) {
        return res.send(403)
    }
    else {
        token = token.split(" ")[1];
        token = JSON.parse(token)
        const data = jwt.verify(token, secret)
        console.log("before update", data)
        try {
            const updatedProfile = await User.findOneAndUpdate({
                _id: data.data._id
            },
                {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                },
                {
                    new: true
                })

            //const data = jwt.verify(token, secret);
            console.log("verify!")
            console.log("after update", updatedProfile)
            return res.status(200).send(updatedProfile)
        } catch (e) {
            console.log(e)
            return res.sendStatus(403);
        }
    }
})


router.post('/project', (req, res) => {
    try {
        const newProject = Project({
            name: req.body.name,
            description: req.body.description,
            creationDate: req.body.creationDate,
            member: req.body.member,
            // media: req.body.media,
            status: req.body.status,
            admin: req.body.admin
        })
        newProject.save().then((err,data) => {
            if (err) res.send(err)
            else {
                console.log('Successfuly created the project!')
                console.log(data._id)
                return res.status(200).send(data._id)
            }
        })
    } catch (err) {
        console.log(err)
    }
    console.log(req.body.creationDate)
})

router.post('/projectFind', (req, res) => {
    Project.findOne({ admin: req.body.admin }, function (err, data) {
        if (data) {
            res.send(data._id)
        } else console.log(err)
    })
})

router.get('/allProject',(req,res) => {
    Project.find({},function(err,data){
        if(err){
            console.log(err)
        }
        res.status(200).send(data)
    })
})

router.post('/getUser',(req,res) => {
    var token = req.body.token
    if(!token){
        res.send(403)
    }
    else{
        token = JSON.parse(token)
        console.log(token)
        try {
            var data = jwt.verify(token,secret)
            console.log(data)
            res.status(200).send(data)
        } catch (error) {
            console.log(error)
        }
    }
    
})

router.get('/allMembers',(req,res) => {
    try {
        User.find({},('username'), function(err,result){
            if(err){
                console.log(err)
            }
            else{
                var members = []
                result.map(function(element) {
                    if(element && element.username){
                        
                        console.log(element.username)
                        members.push( element.username);
                      }
                  });
                  res.send(members).status(200)
            }
        })
    } catch (error) {
        console.log(error)
    }
    
})

router.post('/addMember',(req,res) => {
    console.log(req.body.name)
    User.find({username:req.body.name},function(err,result){
        if(err) {
            return err
        }
        else{
            console.log("find!",req.body.name)
            return res.status(200).send(req.body.name)
        }
    })
    
})

router.delete('/deleteProject/:id',(req,res) => {
    const id = req.params.id;
    const filter = { _id:id};
    Project.findOneAndDelete(filter, function(err,result){
        if(err){
            res.status(404).send(err)
        }
        return res.status(200)
    })
})

async function authenticateToken(req, res, next) {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(202).redirect('/login');
    }
    try {
        const data = jwt.verify(token, secret);
        console.log(token)
        // Almost done
        req.name = data.name;
        // req.userRole = data.role;
        return next();
    } catch {
        return res.sendStatus(403);
    }
}


module.exports = router