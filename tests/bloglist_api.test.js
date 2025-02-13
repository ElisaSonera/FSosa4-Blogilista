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
  await Blog.insertMany(helper.initialBlogs)
})

// 4.8
// Sovellus palauttaa JSON-muotoisia blogeja
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// Sovellus palauttaa oikean määrän blogeja
test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

//4.9 En tiedä ymmärsinkö tehtävää edes oikein, mutta toivottavasti
test('blog id is id and not _id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    assert(blog.id && !blog._id)
  })
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

//4.11
test('if likes are not given, likes are set to 0', async () => {
  const newBlog = {
    title: 'Testi Blogi',
    author: 'Kuka Tahansa',
    url: 'www.mikätahansa.fi'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const testBlog = await api.get(`/api/blogs/${response.body.id}`)
  assert.strictEqual(testBlog.body.likes, 0)
})

//4.12
test('blog without title or url is not added', async () => {
  const newBlog = {
    author: 'Kuka Tahansa'
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// 4.13
test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map((r) => r.title)
  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

//4.14
test('a specific blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const blogUpdate = {
    title: 'Päivitetty Blogi',
    author: 'Ihan Sama',
    url: 'www.mikätahansa.fi',
    likes: 100
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map((r) => r.title)

  assert.strictEqual(titles.includes('Päivitetty Blogi'), true)
})

// materiaalin esimerkki
// test('a specific blog can be viewed', async () => {
//   const blogsAtStart = await helper.blogsInDb()
//   const blogToView = blogsAtStart[0]

//   const resultBlog = await api
//     .get(`/api/blogs/${blogToView.id}`)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   assert.deepStrictEqual(resultBlog.body, blogToView)
// })

// materiaalin esimerkki
// test('the first blog is called Blogi', async () => {
//   const response = await api.get('/api/blogs')

//   const titles = response.body.map((e) => e.title)
//   assert.strictEqual(titles.includes('Blogi'), true)
// })

after(async () => {
  await mongoose.connection.close()
})
