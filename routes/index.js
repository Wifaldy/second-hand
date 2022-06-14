const userRouter = require('./user.route')

const router = require('express').Router()

router.use(userRouter);

module.exports = router