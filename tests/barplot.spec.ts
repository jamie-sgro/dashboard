// @ts-expect-error
d3 = require("d3")

var chaiSrc = require("chai")
var barplotSrc = require("../src/barplot")

describe('Base', function() {
  it('should have basic chai and mocha validation', function() {
    chaiSrc.expect("1").to.equal("1")
  });
});

describe('Barplot', function() {
  it('should return "a"', function() {
    let result = barplotSrc.setAlpha("rgb(0,0,0,)", 1)
    chaiSrc.expect(result.opacity).to.equal(1);
  });
});