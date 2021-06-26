// @ts-expect-error
d3 = require("d3")

const chaiSrc = require("chai")
const clientSrc = require("../client")
const barplotSrc = require("../barplot")

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      console.log("asweadef")
      chaiSrc.expect("1").to.equal("1")
    });
  });
  describe('Client', function() {
    it('should return "a"', function() {
      let client = new clientSrc.Client()
      chaiSrc.expect(client.get_a()).to.equal("a")
    });
  });
  describe('Barplot', function() {
    it('should return "a"', function() {
      let result = barplotSrc.setAlpha("rgb(0,0,0,)", 1)
      chaiSrc.expect(result.opacity).to.equal(1);
    });
  });
});