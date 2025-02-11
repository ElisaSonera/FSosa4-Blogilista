const { test, after, beforeEach } = require('node:test')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

//4.8
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the first blog is called Blogi', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map((e) => e.title)
  assert.strictEqual(titles.includes('Blogi'), true)
})

//4.10
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Testi Blogi',
    author: 'Kuka Tahansa',
    url: 'www.mikätahansa.fi',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map((e) => e.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1) // tarkistus että blogien määrä kasvaa

  assert(titles.includes('Testi Blogi')) // tarkistus että lisätty blogi on palautettujen joukossa
})

//4.9 Testi, joka varmistaa palautettujen blogien identifioinnin kentän olevan id

//4.11 Testi, joka varmistaa, että jos kentälle likes ei anneta arvoa, sen arvoksi asetetaan 0
// (Laajenna ohjelmaa)

//4.12 Testit HTTP POST pyynnölle, jotka varmistavat, että jos uusi blogi ei sisällä kenttää title tai url, niin pyyntään vastataan statuskoodilla 400 bad request
// (Laajenna ohjelmaa)

test('blog without title or url is not added', async () => {
  const newBlog = {
    author: 'Kuka Tahansa',
    likes: 10
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})


after(async () => {
  await mongoose.connection.close()
})