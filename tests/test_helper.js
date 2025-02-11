const Blog = require('../models/blog')

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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}