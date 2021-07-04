import { Data, DataModel } from "../src/Data";

var chaiSrc = require("chai");
var src = require("../src/data");

require("jsdom-global")();

var expect = chaiSrc.expect;

describe("data", () => {
  let data: DataModel[];
  before(() => {
    data = [
      {
        name: "a",
        data: [
          {
            name: "name_a",
            value: "1",
            description: "desc_a",
          },
          {
            name: "name_b",
            value: "2",
            description: "desc_b",
          },
        ],
      },
      {
        name: "b",
        data: [
          {
            name: "name_a",
            value: "3",
            description: "desc_a",
          },
          {
            name: "name_b",
            value: "4",
            description: "desc_b",
          },
        ],
      },
    ];
  });

  it("should return a number for max", () => {
    expect(Data.getAbsoluteMax(data)).to.be.a("number");
  });
    
  it("should return highest value", () => {
    expect(Data.getAbsoluteMax(data)).to.equal(4);
  });
});
