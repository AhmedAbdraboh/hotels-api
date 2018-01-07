'use strict';
// @ts-check

const _ = require('lodash');
const { expect } = require('chai');
const { describe, it, before } = require('mocha');
const nock = require('nock');
const { server } = require('hapi-arc');
const SERVICE_URL = require('hapi-arc').config.apis.hotels;
const hotelsList = require('./hotelsList.json');

describe('HotelsController', function () {
  const MEDIUM_TIMEOUT = 4000;
  this.timeout(MEDIUM_TIMEOUT);

  before(() => {
    const SUCCESS_CODE = 200;
    const PROTOCOL = 'https://';
    nock(_.trimStart(SERVICE_URL, PROTOCOL))
      .get()
      .reply(SUCCESS_CODE, hotelsList);
  });

  describe('1. get ()', () => {
    it('should get all list of hotels sorted by name ascending', async function () {
      const SIX_HOTELS = 6;
      const expectedHead = {
        name: 'Concorde Hotel',
        price: 79.4,
        city: 'Manila',
        availability: [
          { from: '10-10-2020', to: '19-10-2020' },
          { from: '22-10-2020', to: '22-11-2020' },
          { from: '03-12-2020', to: '20-12-2020' }
        ]
      };
      const { payload } = await server.inject('/hotels');
      const result = JSON.parse(payload);
      expect(result).to.be.an('array');
      expect(result).to.have.length(SIX_HOTELS);
      expect(JSON.stringify(_.head(result))).to.eq(
        JSON.stringify(expectedHead)
      );
    });

    it('should get all list of hotels sorted by price desc', async function () {
      const SIX_HOTELS = 6;
      const expectedHead = {
        name: 'Novotel Hotel',
        price: 111,
        city: 'Vienna',
        availability: [
          { from: '20-10-2020', to: '28-10-2020' },
          { from: '04-11-2020', to: '20-11-2020' },
          { from: '08-12-2020', to: '24-12-2020' }
        ]
      };
      const { payload } = await server.inject(
        '/hotels?sortBy=price&sortType=desc'
      );
      const result = JSON.parse(payload);
      expect(result).to.be.an('array');
      expect(result).to.have.length(SIX_HOTELS);
      expect(JSON.stringify(_.head(result))).to.eq(
        JSON.stringify(expectedHead)
      );
    });

    it('should get specific hotel by name, price, date', async function () {
      const expectedHead = {
        name: 'Rotana Hotel',
        price: 80.6,
        city: 'cairo',
        availability: [
          { from: '10-10-2020', to: '12-10-2020' },
          { from: '25-10-2020', to: '10-11-2020' },
          { from: '05-12-2020', to: '18-12-2020' }
        ]
      };
      const { payload } = await server.inject(
        '/hotels?name=rot&minPrice=70&maxPrice=90&city=CAIRO&fromDate=2020-12-06&toDate=2020-12-17'
      );
      const result = JSON.parse(payload);
      expect(result).to.be.an('array');
      expect(JSON.stringify(_.head(result))).to.eq(
        JSON.stringify(expectedHead)
      );
    });
  });
});
