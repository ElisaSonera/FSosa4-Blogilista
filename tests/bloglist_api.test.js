const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Blogi',
    author: 'Telia',
    url: 'www.eimikään.fi',
    likes: 13
  },
  {
    title: 'Toinen Blogi',
    author: 'DNA',
    url: 'www.eimikään.fi',
    likes: 11
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})

test.only('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test.only('the first blog is called Blogi', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map((e) => e.title)
  assert.strictEqual(titles.includes('Blogi'), true)
})
