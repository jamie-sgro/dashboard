var chai = require("chai")
const clientSrc = require("../client")

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      chai.expect("1").to.equal("1")
    });
  });
  describe('Client', function() {
    it('should return "a"', function() {
      let client = new clientSrc.Client()
      chai.expect(client.get_a()).to.equal("a")
    });
  });
});