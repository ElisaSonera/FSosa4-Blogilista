const _ = require('lodash')

//4.3
const dummy = (blogs) => {
  return 1
}

//4.4
const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

//4.5
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const reducer = (max, item) => {
    return max.likes > item.likes ? max : item
  }

  return blogs.reduce(reducer, blogs[0])
}

//4.6
//Lodash
//selvittää kirjoittajan, jolla on eniten blogeja
//paluuarvo kertoo kirjoittajan ja blogien määrän
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  //luo olion jossa avaimena kirjoittaja ja arvona blogien määrä
  const counts = _.countBy(blogs, 'author')

  //muutetaan avain-arvo parit taulukoksi
  const countsArray = _.toPairs(counts)

  //haetaan eniten blogeja omaava kirjoittaja
  const max = _.maxBy(countsArray, (authorBlogsPair) => authorBlogsPair[1])

  return { author: max[0], blogs: max[1] }
}

//4.7
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
