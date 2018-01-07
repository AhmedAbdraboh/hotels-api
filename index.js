'use strict';

const HapiArc = require('hapi-arc');

HapiArc.start()
  .then()
  .catch((err) => {
    console.log(err);
    const FAIL_CODE = 1;
    process.exit(FAIL_CODE);
  });
