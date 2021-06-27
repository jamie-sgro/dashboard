var chaiSrc = require("chai");
var src = require("../../src/widgets/DataList");

require("jsdom-global")();
require("crypto");

var expect = chaiSrc.expect;

describe("DataList", () => {
  let dataListModel = [
    { id: 0, value: "a" },
    { id: 1, value: "b" },
    { id: 2, value: "c" },
  ];

  it("should be constructable", () => {
    let onClick = () => {
      return "click";
    };
    let datalist = new src.DataList("some-id", dataListModel, onClick);

    expect(datalist.htmlId).to.equal("some-id");
    expect(datalist.onClick()).to.equal("click");
  });

  describe("on input", () => {
    let result: number;
    let onClick: Function;

    before(() => {
      onClick = (id: number) => {
        result = id;
      };
    });

    beforeEach(() => {
      result = undefined;
    });

    it("should select ids from matching user selection", () => {
      let datalist = new src.DataList("some-id", dataListModel, onClick);

      datalist.convertInputToIndexAndProcessClick("c");
      expect(result).to.equal(2);
    });

    it("should reject ids from non-matching user selection", () => {
      let datalist = new src.DataList("some-id", dataListModel, onClick);

      datalist.convertInputToIndexAndProcessClick("invalid input");
      expect(result).to.equal(undefined);
    });
  });
});
