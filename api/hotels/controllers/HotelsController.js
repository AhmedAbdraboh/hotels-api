'use strict';
// @ts-check

const { server } = require('hapi-arc');
const { Hotels } = require('hapi-arc').deps.hotels.services.HotelsService;

module.exports = {
  get: async (request, reply) => {
    try {
      const hotels = new Hotels();
      await hotels.init();
      reply(hotels.search(request.query));
    }
    catch (error) {
      server.log('error', error);
      reply(error);
    }
  }
};
