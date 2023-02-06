var express = require('express');
var router = express.Router();
const checkLogin = require('../util/checkLogin')
const managerController = require('../app/controllers/ManagerController')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100)
      cb(null, uniqueSuffix + file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

const checkRole = (req, res, next) => {
  if(req.data.role == 'admin' || req.data.role == 'browse') {
    next()
  }
  else {
    res.redirect('back')
  }
}
router.get('/', checkLogin, checkRole, managerController.index)
router.get('/deletemember/:id', checkLogin, checkRole, managerController.deleteMember)
router.get('/authorization', checkLogin, checkRole, managerController.authorization)
router.get('/authorization/:id/:role', checkLogin, checkRole, managerController.updateRole)
router.get('/authorization/search', checkLogin, checkRole, managerController.searchUser)
router.get('/profile', checkLogin, managerController.profileMe)
router.get('/profile/:id', checkLogin, managerController.profile)
router.post('/profile', checkLogin, upload.single('avatar'), managerController.updateProfile)
router.get('/post', checkLogin, checkRole, managerController.post)
router.get('/member/search', checkLogin, checkRole, managerController.searchUserPageUser)
router.get('/post/search', checkLogin, checkRole, managerController.searchPost)

module.exports = router;