'use strict';

const Good = require('good');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package.json');

module.exports = [
  {
    register: Good,
    options: {
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [
              {
                response: '*',
                log: '*'
              }
            ]
          },
          { module: 'good-console' },
          'stdout'
        ]
      }
    }
  },
  Inert,
  Vision,
  {
    register: HapiSwagger,
    options: {
      info: {
        title: Pack.name + ' Documentation',
        version: Pack.version,
        description: Pack.description,
        contact: { name: Pack.author }
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'api_key',
          in: 'header',
          description: 'client api key'
        }
      },
      jsonEditor: false
    }
  }
];
