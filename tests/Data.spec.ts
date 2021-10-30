import { Data, DataModel, DataPoint } from "../src/data";

var chaiSrc = require("chai");
var src = require("../src/data");

require("jsdom-global")();

var expect = chaiSrc.expect;

describe("arithmetic mean city", function(){
  let city: DataPoint[];
  before(() => {
    city = [
      {
        name: "a", value: "56.8"
      },
      {
        name: "a", value: "23.4"
      },
      {
        name: "a", value: "36.9"
      },
      {
        name: "a", value: "6.0"
      },
      {
        name: "a", value: "7.23"
      },
      {
        name: "a", value: "0.92"
      },
      {
        name: "a", value: "97.51"
      }
    ];
  });
  it("should calculate the arithmetic mean of all data points within a city", () => {
    let city : DataPoint[] = [
      {
        name: "a", value: "1"
      },
      {
        name: "a", value: "2"
      }
    ];
    expect(Data.getArithmenticMeanForCity(city)).to.equal(1.5);
  });
  it ("should calculate the arithmetic mean of more complex data points within a city", () => {
    expect(Data.getArithmenticMeanForCity(city).toFixed(5)).to.equal("32.68");
  });
  it ("should calculate the arithmetic mean of more complex data points within a city", () => {
    expect(Data.getPseudoGeometricMeanForCity(city).toFixed(5)).to.equal("16.87214");
  });
  it("should return 0 if the city has no data points", () => {
    let city = [];
    expect(Data.getArithmenticMeanForCity(city)).to.equal(0);
  });
});

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
