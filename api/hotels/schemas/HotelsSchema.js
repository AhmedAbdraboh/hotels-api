'use strict';
// @ts-check

const Joi = require('joi');

module.exports = {
  query: {
    name: Joi.string()
      .description('hotel name')
      .example('Media One Hotel'),

    city: Joi.string()
      .description('hotel city')
      .example('vienna'),

    maxPrice: Joi.number()
      .description('hotel max price')
      .example('200'),

    minPrice: Joi.number()
      .description('hotel min price')
      .example('100'),

    fromDate: Joi.date().description(
      'the date the hotel will be available from'
    ),

    toDate: Joi.date().description('the date the hotel will be available to'),

    sortBy: Joi.string()
      .description('attribute to sort result by')
      .example('name')
      .default('name')
      .valid(['name', 'price']),

    sortType: Joi.string()
      .description('sorting type ascending or descending')
      .example('asc')
      .default('asc')
      .valid(['asc', 'desc'])
  }
};
