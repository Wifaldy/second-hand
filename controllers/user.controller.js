'use strict';
const { user } = require('../models')

class UserController {
  static async update(res, req, next) {
    try {
      await UserGameHistories.update({
        name: req.body.name,
        password: req.body.password,
        profile_pict: req.body.profile_pict,
        city: req.body.city,
        address: req.body.address,
        no_hp: req.body.no_hp
      }, {
        where: {
          id: req.user.id
        }
      })
      res.status(200).json({
        message: 'Successfully update Users'
      })
    } catch(err) {
      next(err)
    }
  }
}

module.exports = UserController