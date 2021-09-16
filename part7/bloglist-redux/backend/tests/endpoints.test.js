const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// NOTE: This is how you invoke api
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
const helpers = require('../utils/test_helpers')

// 07.03 19:51: made this work; now we have a default
// DB setup with two users, each having two blog posts
beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const userA = await User.create(helpers.userA)
    const userB = await User.create(helpers.userB)
    
    for (let blog of helpers.initBlogsByA) {
        blog.user = userA._id
        let blogObject = new Blog(blog)
        const blogReturn = await blogObject.save()
        userA.blogs = userA.blogs.concat(blogReturn._id)
        await userA.save()
    }
    
    for (let blog of helpers.initBlogsByB) {
        blog.user = userB._id
        let blogObject = new Blog(blog)
        const blogReturn = await blogObject.save()
        userB.blogs = userB.blogs.concat(blogReturn._id)
        await userB.save()
    }
})

describe('GET endpoint /api/blogs', () => {

    // 4.8 
    test('GET returns correct number of blogs', async ()=>{
        response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helpers.numBlogs)
    })

    // 4.9
    test('GET id property is defined in response', async ()=>{
    response = await api.get('/api/blogs')
        for (let item of response.body) {
            expect(item.id).toBeDefined()
        }
    })
})

describe('POST endpoint /api/blogs', () => {

    // 4.10 making HTTP POST to create a blog
    // This test is modified to makesure:
    // a) you can't create a blog without a token
    // b) you can create a blog if you log in and have a token
    // This test falls under 4.10 (a) (401)
    test('POST creating a blog without a token should fail', async ()=> {
        await api.post('/api/blogs').send(helpers.testBlogs.blogPostValid).expect(401)
    })

    // 4.10 (a)
    // respond with 400 when a token is invalid
    test('POST creating a blog with an invalid token should fail', async ()=> {
        await api.post('/api/blogs').send(helpers.testBlogs.blogPostValid).set('Authorization', `bearer ${helpers.invalidToken}`).expect(400)
    })

    // 4.10 (b)
    test('POST creating a blog with a valid token should succeed', async ()=> {
        const res1 = await api.post('/api/login').send({username: 'usera', password: 'password'}).set('Content-Type', 'application/json').expect(200)
        const validToken = res1.body.token
        
        const res2 = await api.post('/api/blogs').send(helpers.testBlogs.blogPostValid).set('Authorization', 'bearer '+validToken).expect(201)
    })
    
    // 4.11
    // if likes value not set, defaults to 0
    test('POST creating a blog without likes should default to 0', async ()=> {
        const res1 = await api.post('/api/login').send({username: 'usera', password: 'password'}).set('Content-Type', 'application/json').expect(200)
        const validToken = res1.body.token
        
        const res2 = await api.post('/api/blogs').send(helpers.testBlogs.blogPostNoLikes).set('Authorization', 'bearer '+validToken).expect(201)
        expect(res2.body.likes).toBe(0)
    })

    // 4.12
    // With a valid token, you can't create a blog if
    // a) title or url is missing
    test('POST creating a blog without title or url should fail', async ()=> {
        const res = await api.post('/api/login').send({username: 'usera', password: 'password'}).set('Content-Type', 'application/json').expect(200)
        const validToken = res.body.token
        
        await api.post('/api/blogs').send(helpers.testBlogs.blogPostNoTitle).set('Authorization', 'bearer '+validToken).expect(400)
        
        await api.post('/api/blogs').send(helpers.testBlogs.blogPostNoUrl).set('Authorization', 'bearer '+validToken).expect(400)
    })
})

describe('DELETE endpoint /api/blogs', ()=>{

    // 4.13
    // a) without token, you can't delete a post
    test('DELETE a blog without a token should fail', async ()=> {
        const res = await api.get('/api/blogs')
        for (let item of res.body) {
            await api.delete(`/api/blogs/${item.id}`).expect(401)
        }
    })

    // b) with a valid token and the user is not you, you can't delete
    // c) if you are logged in and you are the user
    test('DELETE a blog succeeds by the right user, fails by the wrong user', async ()=> {
        const res1 = await api.get('/api/blogs')
        const res2 = await api.post('/api/login').send({username: "usera", password: "password"}).expect(200)
        const token = res2.body.token
        const curUsername = res2.body.username

        for (let blogPost of res1.body) {
            if (blogPost.user.username === curUsername ) {
                await api.delete(`/api/blogs/${blogPost.id}`).set('Authorization', 'bearer '+token).expect(204)
            } else {
                await api.delete(`/api/blogs/${blogPost.id}`).set('Authorization', 'bearer '+token).expect(401)
            }
        }
    })

})

describe('PUT endpoint /api/blogs', ()=> {
    // 4.14
    // updating the info of a single blog post
    // 1) should not work if not logged in
    test('PUT updating a blog post should fail without a token', async ()=>{
        const res = await api.get('/api/blogs')
        for (let item of res.body) {
            await api.put(`/api/blogs/${item.id}`).send({title: "Hello Test"}).expect(401)
        }
    })

    test('PUT updating a blog post should fail without a title or url', async ()=>{
        const res = await api.get('/api/blogs')
        const res2 = await api.post('/api/login').send({username: "usera", password: "password"}).expect(200)
        const token = res2.body.token
        const curUsername = res2.body.username

        for (let item of res.body) {
            if (item.user.username === curUsername) {
                await api.put(`/api/blogs/${item.id}`).send({title: ""}).set('Authorization', 'bearer '+token).expect(400)
                await api.put(`/api/blogs/${item.id}`).send({url: ""}).set('Authorization', 'bearer '+token).expect(400)
            }
        }
    })

    // 2) should not work if logged in but you're not the user
    // 3) should work if logged in as the right user
    test('PUT updating a blog post should fail as wrong user, should succeed as right user', async ()=>{
        const res = await api.get('/api/blogs')
        const res2 = await api.post('/api/login').send({username: "usera", password: "password"}).expect(200)
        const token = res2.body.token
        const curUsername = res2.body.username

        for (let item of res.body) {
            if (item.user.username === curUsername) {
                await api.put(`/api/blogs/${item.id}`).send({title: "HELLOWORLD"}).set('Authorization', 'bearer '+token).expect(200)
                const blogRes = await api.get(`/api/blogs/${item.id}`).expect(200)
                expect(blogRes.body.title).toBe('HELLOWORLD')
            } else {
                await api.put(`/api/blogs/${item.id}`).send({title: "HELLOWORLD"}).set('Authorization', 'bearer '+token).expect(401)
            }
        }
    })

})

describe("POST /api/users creating users", ()=>{

    test('creating users with a username shorter than 3 chars should fail', async () => {
        await api.post('/api/users').send({username: 'ab', password: '123456', name: 'ab'}).expect(400)
    })

    test('creating users with a password shorter than 3 chars should fail', async () => {
        await api.post('/api/users').send({username: 'abc', password: '12', name:'abc'}).expect(400)
    })

    test('creating a user with valid username/password should succeed, with a dupe username should fail', async () => {
        await api.post('/api/users').send({username: 'godzilla', password: '123456', name: "Destroy Tokyo" }).expect(200)
        await api.post('/api/users').send({username: 'godzilla', password: '12345678', name: "Destroy Tokyo" }).expect(400)
    })
})

afterAll(
    () => {
        mongoose.connection.close()
    }
)
