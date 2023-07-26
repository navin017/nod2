const express = require('express')
const router = express.Router()
const controller = require('../responseHandler.js/response')

router.get("/get-students", controller.showStudents)
router.get("/get-one", controller.getOne)
router.delete('/delete', controller.destroy)
router.put('/update', controller.updateDetails)
router.get('/category', controller.category)
router.post('/create', controller.create)

module.exports = router