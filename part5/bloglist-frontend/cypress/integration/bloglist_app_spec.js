describe('Bloglist app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const newUser = {
      username: 'cypressTest',
      name: 'Cypress Test',
      password: 'cypressTestPass'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', newUser)
  })

  // 5.17
  // Login form is shown
  it('Login form is shown', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Login to application')
    cy.get('#loginForm').should('contain', 'username').and('contain', 'password')
    cy.get('#loginButton').should('contain', 'Login')
  })

  describe('Login', function() {

    // 5.18 - a
    // With correct credentials, login succeeds.
    it('succeeds with right credentials', function() {
      cy.visit('http://localhost:3000')
      cy.get('#loginUsername').type('cypressTest')
      cy.get('#loginPassword').type('cypressTestPass')
      cy.get('#loginButton').click()
      cy.contains('Cypress Test logged in.')
    })

    // 5.18 - b
    // With wrong credentials, login fails.
    // And the error message is in red.
    it('fails with wrong credentials', function() {
      cy.visit('http://localhost:3000')
      cy.get('#loginUsername').type('WrongUserName')
      cy.get('#loginPassword').type('WrongPassWord')
      cy.get('#loginButton').click()
      cy.contains('Login Failed.').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    // 5.19
    beforeEach( function() {
      cy.visit('http://localhost:3000')
      cy.get('#loginUsername').type('cypressTest')
      cy.get('#loginPassword').type('cypressTestPass')
      cy.get('#loginButton').click()
    })

    it('A blog can be created', function() {
      cy.contains('create a blog').click()
      cy.get('#blogTitle').type('Cypress Blog Title')
      cy.get('#blogAuthor').type('Cypress Author')
      cy.get('#blogUrl').type('http://blog.xyz/123')
      cy.get('#blogCreate').click()

      cy.visit('http://localhost:3000')
      cy.get('#listOfBlogs').should('contain', 'Cypress Blog Title')
    })

    it('You can like a blog', function(){
      
    })
  })
})