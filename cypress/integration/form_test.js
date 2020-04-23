import { v4 as uuid } from 'uuid'

const name = uuid().slice(0, 5);
const email = `${name}@gmail.com`;
const password = 'Password123';
const option = 'Designer'

describe('User Onboarding', () => {
    it('can load & navigate the webpage', () => {
        cy.visit('http://localhost:3000/')
        cy.url().should('include', 'localhost')
    })

    it('can add a new user', () => {
        // inputs a username
        cy.get('input[name="name"]')
            .type(name)
            // to verify that form validation is working
            //.type('ok')
            .should('have.value', name)

        // inputs a valid email
        cy.get('input[name="email"]')
            .type(email)
            // to verify that form validation is working
            //.type('test2gmail.com')
            .should('have.value', email)

        // inputs a valid password
        cy.get('input[name="password"]')
            .type(password)
            // to verify that form validation is working
            //.type('password')
            .should('have.value', password)

        // selects a role
        cy.get('select[name="role"]')
            .select(option)
            .should('have.value', option)

        // checks the terms & services box
        cy.get('input[name="terms"]')
            .check()
            .should('have.checked')

        // successfully adds a new user
        cy.contains('Add User')
            .click()
    })  
})