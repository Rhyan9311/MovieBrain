const router = require('express').Router()
const { models: { Movies }} = require('../db')
module.exports = router


router.get('/', async (req, res, next) => {
    try {
      const movies = await Movies.findAll({
        // explicitly select only the id and username fields - even though
        // users' passwords are encrypted, it won't help if we just
        // send everything to anyone who asks!
        attributes: ['id']
      })
      res.json(movies)
    } catch (err) {
      next(err)
    }
  })