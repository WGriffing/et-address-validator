"use strict";
const axios = require("axios");
const { Provider } = require("./provider");
const log = require("loglevel");

const ByteplantResponse = {
  valid: "VALID",
  suspect: "SUSPECT",
  invalid: "INVALID",
  delayed: "DELAYED",
  rateLimitExceeded: "RATE_LIMIT_EXCEEDED",
  apiKeyInvalid: "API_KEY_INVALID_OR_DEPLETED",
  restricted: "RESTRICTED",
  internalError: "INTERNAL_ERROR",
};

class Byteplant extends Provider {
  constructor({ apiKey }) {
    super();
    this.apiKey = apiKey;
  }

  rateLimitExceededResponse() {
    return ByteplantResponse.rateLimitExceeded;
  }

  rateLimitMaxLength() {
    // byteplant API rate interval reset period maximum is 300 seconds
    return 300;
  }

  async lookupAddress(street, city, postalCode) {
    const data = await this.apiCall(street, city, postalCode);

    const { status, ratelimit_remain, ratelimit_seconds } = data;

    log.debug(
      `----- ratelimit info | remain: ${ratelimit_remain} | seconds: ${ratelimit_seconds}`
    );

    if (
      status === ByteplantResponse.valid ||
      status === ByteplantResponse.suspect
    ) {
      const { streetnumber, street, city, postalcode } = data;
      return [`${streetnumber} ${street}`, city, postalcode].join(", ");
    } else if (
      [
        ByteplantResponse.apiKeyInvalid,
        ByteplantResponse.rateLimitExceeded,
        ByteplantResponse.restricted,
      ].includes(status)
    ) {
      return { status, ratelimit_seconds };
    }
    return "Invalid Address";
  }

  async apiCall(street, city, postalCode) {
    const response = await axios({
      method: "get",
      url: "https://api.address-validator.net/api/verify",
      params: {
        APIKey: this.apiKey,
        StreetAddress: street,
        City: city,
        PostalCode: postalCode,
        CountryCode: "US",
      },
    });
    return response.data;
  }
}

module.exports = { Byteplant, ByteplantResponse };
