var chaiSrc = require("chai");
var citySrc = require("../../src/city/City");

require("jsdom-global")();

var expect = chaiSrc.expect;

describe("City", function () {
  it("should be constructable", function () {
    let onClick = () => {
      return "click";
    };
    let city = new citySrc.City(1, "name", onClick);

    expect(city.id).to.equal(1);
    expect(city.name).to.equal("name");
    expect(city.onClick()).to.equal("click");
  });
});
