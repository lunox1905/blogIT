const Posts = require('../module/Posts')
const Users = require('../module/Users')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')
const limit = 10 
const size = 5
class ManagerController {
    //GET 
    index (req, res, next) {
        var skip = (parseInt(req.query.page)-1) * limit
        Promise.all([Users.find({}).skip(skip).limit(limit).sort({createdAt: -1}), Users.countDocuments()])
        .then(([users, countFlim]) => {
            var totalPage = 0
            if(countFlim > limit) totalPage = Math.floor(countFlim/limit) + 1
            res.render('manager/member', {
                users: mutipleMongooseToObject(users),
                username: req.data.name,
                role: req.data.role,
                image: req.data.avatar,
                size: size,
                current: req.query.page || 2,
                total: totalPage,
                layout: 'manager'
            })
        })
        
    }

    deleteMember (req, res, next) {
        Users.deleteOne({_id: req.params.id})
            .then(() => {
                res.redirect('back')
            })
    }

    authorization (req, res, next) {
        var skip = (parseInt(req.query.page)-1) * limit
        Promise.all([Users.find({}).skip(skip).limit(limit).sort({createdAt: -1}), Users.countDocuments()])
        .then(([users, countFlim]) => {
            var totalPage = 0
            if(countFlim > limit) totalPage = Math.floor(countFlim/limit) + 1
           
            res.render('manager/authorization', {
                users: mutipleMongooseToObject(users),
                username: req.data.name,
                role: req.data.role,
                image: req.data.avatar,
                size: size,
                current: req.query.page || 2,
                total: totalPage,layout: 'manager'
            })
        })
        
    }

    searchUser (req, res, next) {
        Users.find({email : {$regex : new RegExp(req.query.email, 'i')}})
        .then(users => {
            res.render('manager/authorization', {
                users: mutipleMongooseToObject(users),
                username: req.data.name,
                role: req.data.role,
                image: req.data.avatar,
                layout: 'manager'
            })
        })
    }  

    searchUserPageUser (req, res, next) {
        Users.find({email : {$regex : new RegExp(req.query.email, 'i')}})
        .then(users => {
            res.render('manager/member', {
                users: mutipleMongooseToObject(users),
                username: req.data.name,
                role: req.data.role,
                image: req.data.avatar,
                layout: 'manager'
            })
        })
    }  

    searchPost (req, res, next) {
        Posts.find({title : {$regex : new RegExp(req.query.title, 'i')}})
        .then(posts => {
           
            res.render('manager/post', {
                posts: mutipleMongooseToObject(posts),
                username: req.data.name,
                role: req.data.role,
                image: req.data.avatar,
                layout: 'manager',
                total: 0,
                size: 0
            })
        })
    } 

    updateRole (req, res, next) {
        Users.updateOne({_id: req.params.id}, {role: req.params.role})
        .then(() =>
            res.redirect('/manager/authorization')
        )
    }

    profile (req, res, next) {
        Users.findOne({_id: req.params.id})
        .then(user => {
            res.render('manager/profile', {
                user: mongooseToObject(user),
                username: req.data.name,
                role: req.data.role,
                image: req.data.avatar,
            }) 
        })
        
    }

    profileMe (req, res, next) {
        Users.findOne({_id: req.data._id})
        .then(user => {
            res.render('manager/profileme', {
                user: mongooseToObject(user),
                username: req.data.name,
                role: req.data.role,
                image: req.data.avatar,
            }) 
        })
        
    }

    updateProfile(req, res, next) {
        const img = req.file
        
        if(img) {
            req.body.avatar = '/' + img.path.split('\\').slice(1).slice(1).join('/')
        }
        console.log(req.body.birthday)
        console.log(req.data._id)
        Users.updateOne({_id: req.data._id}, req.body)
        .then(() => res.redirect(`/manager/profile`))
    }

    post(req, res, next) {
       
        var skip = (parseInt(req.query.page)-1) * limit
        Promise.all([Posts.find({isBrowse: true}).populate('author').skip(skip).limit(limit).sort({createdAt: -1}), Posts.countDocuments()])
        .then(([posts, countFlim]) => {
            var totalPage = Math.floor(countFlim/limit) + 1
            res.render('manager/post', {
                posts: mutipleMongooseToObject(posts),
                username: req.data.name,
                role: req.data.role,
                image: req.data.avatar,
                size: size,
                current: req.query.page || 2,
                total: totalPage,
                layout: 'manager'
            })
        })
    }
}

module.exports = new ManagerController();