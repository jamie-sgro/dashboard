require('jsdom-global')()

import { expect } from 'chai';
import { setAlpha } from '../src/barplot';

describe("barplot", () => {
  it("should update alpha", function() {
    let result = setAlpha("rgb(0,0,0,)", 1)
    expect(result.opacity).to.equal(1);
  });
});