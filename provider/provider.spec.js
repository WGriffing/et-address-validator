"use strict";
const { Provider } = require("./provider");
const { expect } = require("chai");

class BadClass extends Provider {
  constructor() {
    super();
  }
}

describe("Provider", () => {
  it("should throw an error if abstract class is instantiated", () => {
    //const data = new Provider();

    expect(() => new Provider()).to.throw(
      'Abstract class "Provider" cannot be instantiated directly.'
    );
  });

  it("should throw an error if abstract method is not implemented in subclass", () => {
    const badClass = new BadClass();

    expect(() => badClass.rateLimitExceededResponse()).to.throw(
      'Abstract method "rateLimitExceededResponse" not implemented in subclass.'
    );

    expect(() => badClass.lookupAddress()).to.throw(
      'Abstract method "lookupAddress" not implemented in subclass.'
    );
  });
});
