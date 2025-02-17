const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  //4.16
  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password is missing or is less than 3 characters long'
    })
  }

  if (!username || username.length < 3) {
    return response.status(400).json({
      error: 'username is missing or is less than 3 characters long'
    })
  }

  const isNotUnique = await User.findOne({ username }) // ei uniikki jos löytyy
  if (isNotUnique) {
    return response.status(400).json({
      error: 'expected `username` to be unique'
    })
  }
  //

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1
  })
  response.json(users)
})

module.exports = usersRouter
