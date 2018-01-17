import { Server } from 'hapi'
import Joi from 'joi'

const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 5000

const defaultPlugins = async (server) => {
  const plugins = [
    { plugin: require('inert') },
    { plugin: require('vision') },
    { plugin: require('blipp') },
    {
      plugin: require('good'),
      options: {
        ops: {
          interval: 5000,
        },
        reporters: {
          console: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{
                log: '*',
                response: '*',
                request: '*',
                error: '*',
              }],
            },
            {
              module: 'good-console',
              args: [{
                log: '*',
                response: '*',
                request: '*',
                error: '*',
              }],
            }, 'stdout'],
        },
      },
    },
    {
      plugin: require('hapi-swagger'),
      options: {
        cors: true,
        jsonEditor: false,
        documentationPath: '/',
        info: {
          title: 'Hapi API',
          version: '1.0.0',
          description: 'An example api',
        },
      },
    },
  ]

  await server.register(plugins)
}


export default async () => {

  const options = {
    router: {
      isCaseSensitive: false,
    },
    routes: {
      cors: true,
    },
  }

  if(env !== 'testing') {
    options.port = port
  }

  const server = new Server(options)

  await defaultPlugins(server)

  server.route({
    path: '/login',
    method: 'POST',
    options: {
      validate: {
        payload: {
          email: Joi.string().email().required().label('email'),
          password: Joi.string().min(6).max(128).required().label('password')
        }
      },
      tags: ['api']
    },
    handler: async (req, h) => {
      const { payload } = req
      console.log(payload)

      return payload
    }
  })

  await server.initialize()

  return server
}
