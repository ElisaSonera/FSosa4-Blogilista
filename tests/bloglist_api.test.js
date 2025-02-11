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

//4.12 puuttuu: (Laajenna ohjelmaa)

test('blog without title or url is not added', async () => {
  const newBlog = {
    author: 'Kuka Tahansa',
    likes: 10
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// ...
test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

// ...
test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})


after(async () => {
  await mongoose.connection.close()
})