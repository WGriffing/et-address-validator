"use strict";

class Provider {
  constructor() {
    if (this.constructor === Provider) {
      throw new TypeError(
        'Abstract class "Provider" cannot be instantiated directly.'
      );
    }
  }

  rateLimitExceededResponse() {
    throw new TypeError(
      'Abstract method "rateLimitExceededResponse" not implemented in subclass.'
    );
  }

  lookupAddress() {
    throw new TypeError(
      'Abstract method "lookupAddress" not implemented in subclass.'
    );
  }

  processLines(readline) {
    let firstLine = true;
    readline.on("line", async (line) => {
      if (firstLine) {
        // skip API call for first line, it is just the column headers
        firstLine = false;
        console.log(line);
      } else {
        this.processLine(line);
      }
    });
  }

  async processLine(line) {
    let address = "Invalid Address";
    const addressInputArray = line.split(",");
    if (addressInputArray.length === 3) {
      const [street, city, postalCode] = addressInputArray;
      address = await this.lookupAddress(street, city, postalCode);
      console.log(`${line} -> ${address}`);
    } else {
      // assume incomplete address inputs are invalid
      console.log(`${line} -> ${address}`);
    }
  }
}

module.exports = { Provider };
