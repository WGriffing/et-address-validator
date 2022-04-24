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

    const notImplementedResponse = (funcName) =>
      `Abstract method "${funcName}" not implemented in subclass.`;

    expect(() => badClass.rateLimitExceededResponse()).to.throw(
      notImplementedResponse("rateLimitExceededResponse")
    );

    expect(() => badClass.rateLimitMaxLength()).to.throw(
      notImplementedResponse("rateLimitMaxLength")
    );

    expect(() => badClass.lookupAddress()).to.throw(
      notImplementedResponse("lookupAddress")
    );
  });
});
