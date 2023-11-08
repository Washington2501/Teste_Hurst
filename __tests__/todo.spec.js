const { faker } = require('@faker-js/faker')
const request = require('supertest')

const email = faker.internet.email()
const nome = faker.firstName
const userId = faker.userId

beforeAll( async () => {
    const res = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
    .post(`/auth/sign-up`)
    .send({
        cpf: '59687819049',
        email: email,
        firstName: 'Renato',
        lastName: 'Moreira',
        age: '28',
        description: 'Descricao',
        password: '123Mudar'

    })

    console.log(res.body)
    expect(res.body).toHaveProperty('data')
})

describe('Login de usuario', () => {

    it('Login - Senha correta', async () => {
        const res = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)

    })
    
    it('Login - Senha incorreta', async () => {
        const res = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
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
        const res = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
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
        const response = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token

        const res = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .get(`/account`)
        .set('Authorization', jwtToken)

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)
        
    })

    it('Pesquisar usuario - usuario inexistente', async () => {
        const res = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .get(`/account`)
        .set('Authorization', 'Token errado')

        expect(res.body.data.message).toBe('UNAUTHORIZED')
        expect(res.status).toBe(401)
    })

})

describe('Criar to_do de usuario', () => {

    it('Criar to_do corretamente', async () => {
        const response = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token

        const res = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .post(`/todo`)
        .set('Authorization', jwtToken)
        .send({
            description: 'Descricao',
            name: nome,
            userId: userId,
            createdAt: '2023-11-07T20:27:22.752Z',
            updatedAt: '2023-11-07T20:27:22.752Z'
        })

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)
        expect(res.success).toBe(true)
    })

})

describe('Obter to_do de um usuario', () => {

    it('Obter um to_do de usuário', async () => {
        const response = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token
        
        const resTodo = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .post(`/todo`)
        .set('Authorization', jwtToken)
        .send({
            description: 'Descricao',
            name: nome,
            userId: userId,
            createdAt: '2023-11-07T20:27:22.752Z',
            updatedAt: '2023-11-07T20:27:22.752Z'
        })

        const todoId = resTodo.body.data.id

        const res = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .get(`/todo/${todoId}`)
        .set('Authorization', jwtToken)

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)
        expect(res.success).toBe(true)
        
    })

})

describe('Obter todos os to_do_s de usuario', () => {

    it('Obter todos os to_do_s de um usuário existente', async () => {
        const response = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .post(`/auth/sign-in`)
        .send({
            password: '123Mudar',
            email: email
        })

        const jwtToken = response.body.data.token

        const resTodo = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .post(`/todo`)
        .set('Authorization', jwtToken)
        .send({
            description: 'Descricao',
            name: nome,
            userId: userId,
            createdAt: '2023-11-07T20:27:22.752Z',
            updatedAt: '2023-11-07T20:27:22.752Z'
        })

        const res = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .get(`/todo`)
        .set('Authorization', jwtToken)

        expect(res.body).toHaveProperty('data')
        expect(res.status).toBe(200)
        expect(res.success).toBe(true)
        
    })

    it('Obter todos os to_do_s de um usuário inexistente', async () => {
        const res = await request(`https://c94dh2pfp1.execute-api.us-west-2.amazonaws.com`)
        .get(`/todo`)
        .set('Authorization', 'Token errado')

        expect(res.body.data.message).toBe('UNAUTHORIZED')
        expect(res.status).toBe(401)

    })

})

// describe('Atualizar to_do de usuario', () => {

//     it('', async () => {
        
//     })

// })

// describe('Deletar to_do de usuario', () => {

//     it('', async () => {
        
//     })

// })


// describe('Deletar usuario', () => {

//     it('', async () => {
        
//     })

// })

