'use strict';
// @ts-check

const _ = require('lodash');
const { expect } = require('chai');
const { describe, it, before } = require('mocha');
const nock = require('nock');
const { Hotels } = require('hapi-arc').deps.hotels.services.HotelsService;
const SERVICE_URL = require('hapi-arc').config.apis.hotels;
const hotelsList = require('./hotelsList.json');

describe('HotelsService', function () {
  const hotels = new Hotels();
  const MEDIUM_TIMEOUT = 4000;
  this.timeout(MEDIUM_TIMEOUT);

  before(() => {
    const SUCCESS_CODE = 200;
    const PROTOCOL = 'https://';
    nock(_.trimStart(SERVICE_URL, PROTOCOL))
      .get()
      .reply(SUCCESS_CODE, hotelsList);
  });

  describe('1. init ()', () => {
    it('should initialize the hotels list', async function () {
      await hotels.init();
      expect(hotels.initialized).to.eq(true);
      expect(hotels).to.contain.keys(['allHotels']);
      expect(hotels.allHotels).to.be.an('array');
      expect(_.head(hotels.allHotels)).contain.keys([
        'name',
        'price',
        'city',
        'availability'
      ]);
    });
  });

  describe('2. _doesNameInclude (hotelName, searchName)', () => {
    it('should return true if the hotel name includes the search string', () => {
      const hotelName = 'Rotana Hotel',
        searchString = 'an';

      const result = hotels._doesNameInclude(hotelName, searchString);
      expect(result).to.eq(true);
    });

    it('should return false if the hotel name doesn\'t include the search string', () => {
      const hotelName = 'Rotana Hotel',
        searchString = 'za';

      const result = hotels._doesNameInclude(hotelName, searchString);
      expect(result).to.eq(false);
    });
  });

  describe('3. _doesCityEqual (hotelCity, searchCity)', () => {
    it('should return true if the city name is the same as the search string', () => {
      const cityName = 'Cairo',
        searchString = 'cairo';

      const result = hotels._doesCityEqual(cityName, searchString);
      expect(result).to.eq(true);
    });

    it('should return false if the city name doesn\'t match the search string', () => {
      const cityName = 'Cairo',
        searchString = 'ca';

      const result = hotels._doesCityEqual(cityName, searchString);
      expect(result).to.eq(false);
    });
  });

  describe('4. _isAvailableInRange (hotelAvailability, fromDate, toDate)', () => {
    it('should return true if the hotel is available in specific range', () => {
      const hotelAvailability = [
          { from: '05-12-2020', to: '18-12-2020' },
          { from: '08-12-2020', to: '10-12-2020' }
        ],
        fromDate = '2020-12-06',
        toDate = '2020-12-09';

      const result = hotels._isAvailableInRange(
        hotelAvailability,
        fromDate,
        toDate
      );
      expect(result).to.eq(true);
    });

    it('should return false if the hotel is unavailable in specific range', () => {
      const hotelAvailability = [
          { from: '05-12-2020', to: '18-12-2020' },
          { from: '08-12-2020', to: '10-12-2020' }
        ],
        fromDate = '2020-12-05',
        toDate = '2020-12-17';

      const result = hotels._isAvailableInRange(
        hotelAvailability,
        fromDate,
        toDate
      );
      expect(result).to.eq(false);
    });
  });

  describe('5. _isAvailableInDate (hotelAvailability, checkDate)', () => {
    it('should return true if the hotel is available in specific date', () => {
      const hotelAvailability = [
          { from: '05-12-2020', to: '18-12-2020' },
          { from: '08-12-2020', to: '10-12-2020' }
        ],
        date = '2020-12-06';

      const result = hotels._isAvailableInDate(hotelAvailability, date);
      expect(result).to.eq(true);
    });

    it('should return false if the hotel is unavailable in specific date', () => {
      const hotelAvailability = [
          { from: '05-12-2020', to: '18-12-2020' },
          { from: '08-12-2020', to: '10-12-2020' }
        ],
        date = '2020-12-19';

      const result = hotels._isAvailableInDate(hotelAvailability, date);
      expect(result).to.eq(false);
    });
  });

  describe('6. search (queryObject)', () => {
    it('should search in the hotels list based on queryObject specifications', async () => {
      const queryObject = {
        name: 'm',
        city: 'Dubai',
        minPrice: 100,
        maxPrice: 150,
        fromDate: '2020-10-11',
        toDate: '2020-10-13',
        sortBy: 'name',
        sortType: 'asc'
      };
      const ONE_HOTEL = 1;
      const EXPECTED_HOTEL = {
        name: 'Media One Hotel',
        price: 102.2,
        city: 'dubai',
        availability: [
          { from: '10-10-2020', to: '15-10-2020' },
          { from: '25-10-2020', to: '15-11-2020' },
          { from: '10-12-2020', to: '15-12-2020' }
        ]
      };
      const hotels = new Hotels();
      await hotels.init();
      const result = hotels.search(queryObject);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(ONE_HOTEL);
      expect(_.head(result)).to.contain.keys([
        'name',
        'price',
        'city',
        'availability'
      ]);
      expect(JSON.stringify(_.head(result))).to.eq(
        JSON.stringify(EXPECTED_HOTEL)
      );
    });
  });
});
