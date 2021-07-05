import { Data, DataModel } from "../src/data";

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
      {
        name: "c",
        data: [
          {
            name: "name_a",
            value: "2",
            description: "desc_a",
          },
          {
            name: "name_b",
            value: "3",
            description: "desc_b",
          },
        ],
      },
    ];
  });
  describe("absolute max", () => {
    it("should return a number for max", () => {
      expect(Data.getAbsoluteMax(data)).to.be.a("number");
    });
      
    it("should return highest value", () => {
      expect(Data.getAbsoluteMax(data)).to.equal(4);
    });
  });

  describe("grouped max", () => {
    it("should have length equal to number of variables", () => {
      expect(Data.getMaxPerVariable(data).length).to.equal(2);
    });

    it("should return highest values per variable", () => {
      expect(Data.getMaxPerVariable(data)).to.eql([3, 4]);
    });
  });

  describe("grouped min", () => {
    it("should have length equal to number of variables", () => {
      expect(Data.getMaxPerVariable(data).length).to.equal(2);
    });
    
    it("should return lowest values per variable", () => {
      expect(Data.getMinPerVariable(data)).to.eql([1, 2]);
    });
  });
});
