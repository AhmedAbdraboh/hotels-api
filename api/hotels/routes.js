'use strict';
// @ts-check

const { HotelsController } = require('hapi-arc').deps.hotels.controllers;
const { HotelsSchema } = require('hapi-arc').deps.hotels.schemas;

module.exports = [
  {
    method: 'GET',
    path: '/hotels',
    config: {
      handler: HotelsController.get,
      description:
        'search hotels by name, city, priceRange, dateRange or all and sort the result by either name or price',
      tags: ['api', 'hotels'],
      validate: HotelsSchema
    }
  }
];
