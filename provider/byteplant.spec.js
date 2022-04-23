"use strict";
const { Byteplant, ByteplantResponse } = require("./byteplant");
const { expect } = require("chai");
const sinon = require("sinon");

const mainStreetAddress = "123 E Main St, Columbus, 43215";

describe("Byteplant", () => {
  let byteplant;

  beforeEach(() => {
    byteplant = new Byteplant({ apiKey: "" });
    const fakeLookup = sinon.fake((street, city, postalCode) => {
      if (
        street === "123 e Main Street" &&
        city === "Columbus" &&
        postalCode === "43215"
      ) {
        return mainStreetAddress;
      } else {
        return "Invalid Address";
      }
    });

    sinon.replace(byteplant, "lookupAddress", fakeLookup);
  });

  it("should return a corrected address, when possible", async () => {
    const address = await byteplant.lookupAddress(
      "123 e Main Street",
      "Columbus",
      "43215"
    );
    expect(address).to.equal(mainStreetAddress);
  });

  it('should return "Invalid Address" when address cannot be located', async () => {
    const address = await byteplant.lookupAddress(
      "1 Empora St",
      "Title",
      "11111"
    );
    expect(address).to.equal("Invalid Address");
  });

  it("should fail to look up an address without an API key", async () => {
    sinon.restore();
    // makes a real API call since the fake is disabled
    const data = await byteplant.lookupAddress(
      "123 Main St",
      "Anytown",
      "12345"
    );
    expect(data).to.equal(ByteplantResponse.apiKeyInvalid);
  });

  it("should return an address when used with valid API key and valid inputs", async () => {
    sinon.restore();
    byteplant = new Byteplant({ apiKey: process.env.BYTEPLANT_KEY });

    const address = await byteplant.lookupAddress(
      "8811 Manahan Drive",
      "Ellicott City",
      "21043"
    );

    expect(address).to.equal("8811 Manahan Dr, Ellicott City, 21043-5404");
  });

  it('should return "Invalid Address" when address cannot be located', async () => {
    sinon.restore();
    byteplant = new Byteplant({ apiKey: process.env.BYTEPLANT_KEY });

    const address = await byteplant.lookupAddress(
      "1 Empora St",
      "Title",
      "11111"
    );

    expect(address).to.equal("Invalid Address");
  });

  afterEach(() => {
    sinon.restore();
  });
});
