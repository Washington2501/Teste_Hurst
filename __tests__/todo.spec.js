const { faker } = require('@faker-js/faker')
const request = require('supertest')

const email = faker.internet.email()
const nome = faker.person.firstName()
const sobrenome = faker.person.lastName()
const idade = Math.floor(Math.random() * 50) + 18
const urlBase = 'https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com'

beforeAll( async () => {
    const res = await request(`${urlBase}`)
    .post(`/auth/sign-up`)
    .send({
        cpf: '59687819049',
        email: email,
        firstName: nome,
        lastName: sobrenome,
        age: idade,
        description: 'Descricao',
        password: '123Mudar'

    })

    console.log(res.body)
    expect(res.body).toHaveProperty('data')
})

describe('Login de usuario', () => {

    it('Login - Senha correta', async () => {
        const res = await request(`${urlBase}`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)

    })
    
    it('Login - Senha incorreta', async () => {
        const res = await request(`${urlBase}`)
        .post(`/auth/sign-in`)
        .send({
            password: '456Mudar',
            email: email
        })

        expect(res.body).toHaveProperty('data')
        expect(res.body.data.message).toBe('PASSWORD_NOT_MATCH')
        expect(res.status).toBe(401)

    })

    it('Login - Email incorreto', async () => {
        const res = await request(`${urlBase}`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: 'emailerrado@qa.com'
        })

        expect(res.body).toHaveProperty('data')
        expect(res.body.data.message).toBe('USER_NOT_FOUND')
        expect(res.status).toBe(401)
    })

})

describe('Pesquisa de usuario', () => {
    
    it('Pesquisar usuario - usuario existente', async () => {
        const response = await request(`${urlBase}`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token

        const res = await request(`${urlBase}`)
        .get(`/account`)
        .set('Authorization', jwtToken)

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)
        
    })

    it('Pesquisar usuario - usuario inexistente', async () => {
        const res = await request(`${urlBase}`)
        .get(`/account`)
        .set('Authorization', 'Token errado')

        expect(res.body.data.message).toBe('UNAUTHORIZED')
        expect(res.status).toBe(401)
    })

})

describe('Criar to_do de usuario', () => {

    it('Criar to_do corretamente', async () => {
        const response = await request(`${urlBase}`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token

        const res = await request(`${urlBase}`)
        .post(`/todo`)
        .set('Authorization', jwtToken)
        .send({
            description: 'Descricao',
            name: 'Nome Teste to_do',
            userId: 'userId Teste to_do',
            createdAt: '2023-11-07T20:27:22.752Z',
            updatedAt: '2023-11-07T20:27:22.752Z'
        })

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

})

describe('Obter to_do de um usuario', () => {

    it('Obter um to_do de usuário', async () => {
        const response = await request(`${urlBase}`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token
        
        const resTodo = await request(`${urlBase}`)
        .post(`/todo`)
        .set('Authorization', jwtToken)
        .send({
            description: 'Descricao',
            name: 'Nome Teste to_do',
            userId: 'userId Teste to_do',
            createdAt: '2023-11-07T20:27:22.752Z',
            updatedAt: '2023-11-07T20:27:22.752Z'
        })

        const todoId = resTodo.body.data.id

        const res = await request(`${urlBase}`)
        .get(`/todo/${todoId}`)
        .set('Authorization', jwtToken)

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        
    })

})

describe('Obter todos os to_do_s de usuario', () => {

    it('Obter todos os to_do_s de um usuario existente', async () => {
        const response = await request(`${urlBase}`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token

        const resTodo = await request(`${urlBase}`)
        .post(`/todo`)
        .set('Authorization', jwtToken)
        .send({
            description: 'Descricao',
            name: 'Nome Teste to_do',
            userId: 'userId Teste to_do',
            createdAt: '2023-11-07T20:27:22.752Z',
            updatedAt: '2023-11-07T20:27:22.752Z'
        })

        const res = await request(`${urlBase}`)
        .get(`/todo`)
        .set('Authorization', jwtToken)

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        
    })

    it('Obter todos os to_do_s de um usuario inexistente', async () => {
        const res = await request(`${urlBase}`)
        .get(`/todo`)
        .set('Authorization', 'Token errado')

        expect(res.body.data.message).toBe('UNAUTHORIZED')
        expect(res.status).toBe(401)

    })

})

describe('Atualizar to_do de usuario', () => {

    it('Atualizar to_do de usuario existente', async () => {
        const response = await request(`${urlBase}`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token

        const resTodo = await request(`${urlBase}`)
        .post(`/todo`)
        .set('Authorization', jwtToken)
        .send({
            description: 'Descricao',
            name: 'Nome Teste to_do',
            userId: 'userId Teste to_do',
            createdAt: '2023-11-07T20:27:22.752Z',
            updatedAt: '2023-11-07T20:27:22.752Z'
        })

        const todoId = resTodo.body.data.id

        const res = await request(`${urlBase}`)
        .put(`/todo/${todoId}`)
        .set('Authorization', jwtToken)
        .send({
            description: 'Descricao',
            name: 'Nome Teste to_do',
            userId: 'userId Teste to_do',
            createdAt: '2023-11-07T20:27:22.752Z',
            updatedAt: '2023-11-07T20:27:22.752Z',
            id: 'Id Teste to_do'
        })
        
        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

})

describe('Deletar to_do de usuario', () => {

    it('Deletar to_do de usuario existente', async () => {
        const response = await request(`${urlBase}`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token

        const resTodo = await request(`${urlBase}`)
        .post(`/todo`)
        .set('Authorization', jwtToken)
        .send({
            description: 'Descricao',
            name: 'Nome Teste to_do',
            userId: 'userId Teste to_do',
            createdAt: '2023-11-07T20:27:22.752Z',
            updatedAt: '2023-11-07T20:27:22.752Z'
        })

        const todoId = resTodo.body.data.id

        const res = await request(`${urlBase}`)
        .del(`/todo/${todoId}`)
        .set('Authorization', jwtToken)

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

})


describe('Deletar usuario', () => {

    it('Deletar usuário existente', async () => {
        const response = await request(`${urlBase}`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token

        const res = await request(`${urlBase}`)
        .del(`/account`)
        .set('Authorization', jwtToken)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

})

