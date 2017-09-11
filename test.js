'use strict';

const chai = require('chai');
const expect = chai.expect;

const energy_meter = require('./index.js');

describe('Energymeter', function() {
    this.timeout(10000);

    it('Should emit a data event', function(done){
       energy_meter.on('data', function(data){
          expect(data).to.have.all.keys('sum', 'p1', 'p2', 'p3');
          console.log(data);
          done();
       });
    });
});