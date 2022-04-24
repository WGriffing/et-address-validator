"use strict";
const log = require("loglevel");
// separate log object, output, dedicated to functional output
// so it is not impacted by the CLI `--log-level` argument
const output = require("loglevel").getLogger("output");
output.setLevel("info");

class Provider {
  static maxRetries = 8;

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

  rateLimitMaxLength() {
    throw new TypeError(
      'Abstract method "rateLimitMaxLength" not implemented in subclass.'
    );
  }

  lookupAddress() {
    throw new TypeError(
      'Abstract method "lookupAddress" not implemented in subclass.'
    );
  }

  async processLines(readline) {
    let firstLine = true;
    for await (const line of readline) {
      if (firstLine) {
        // skip API call for first line, assume it is just the column headers
        firstLine = false;
        output.info(line);
      } else {
        const result = await this.processLine(line);
        output.info(result);
      }
    }
  }

  async processLine(line) {
    let address = "Invalid Address";
    const addressInputArray = line.split(",");
    if (addressInputArray.length === 3) {
      log.debug(`line: ${line}`);
      const [street, city, postalCode] = addressInputArray;
      address = await this.apiCallWithRetry(
        async () => await this.lookupAddress(street, city, postalCode)
      );
    }
    return `${line} -> ${address}`;
  }

  async apiCallWithRetry(fn, retry = 0) {
    try {
      const result = await fn();

      if (retry > Provider.maxRetries) {
        return result;
      } else if (result?.status === this.rateLimitExceededResponse()) {
        /* prefer to wait for the exact amount of time remaining
        but fall back to exponential backoff if exact amount of time
        is not available */
        const waitLengthSec = result?.ratelimit_seconds || 2 ** retry;
        await this.wait(waitLengthSec * 1000);
        return await this.apiCallWithRetry(fn, retry + 1);
      } else {
        return result;
      }
    } catch (e) {
      return "Invalid Address";
    }
  }

  async wait(ms) {
    const delay = Math.min(ms, this.rateLimitMaxLength() * 1000);
    // intentionally blocking single thread so that we give the API
    // rate limit a chance to reset
    return await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

module.exports = { Provider };
