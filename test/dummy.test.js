import Server from '../src'

describe(`initial`, () => {

  let server
  before(async () => {
    server = await Server()
    expect(server).to.be.true()
  })

  it(`has valid server`, async () => {
    const { statusCode } = await server.inject('/')
    expect(statusCode).to.equal(200)
  })
})
