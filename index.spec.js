"use strict";
const { expect } = require("chai");
const { spawnSync } = require("child_process");

const mySpawn = (args, input) => {
  return new Promise((resolve, reject) => {
    const { output, stdout, stderr, error } = spawnSync(
      "node",
      ["index.js", ...args],
      { env: { ...process.env, DUMMY: "dummy api key" }, input: input }
    );

    const data = output.join("\n").trim();
    //console.log(`data: ${data}`);
    resolve(data);
  });
};

describe("CLI", () => {
  it("should display help", async () => {
    const output = await mySpawn(["--input", "csv"]);

    expect(output).to.include("Options");
  });

  it("should display error if no API key is supplied", async () => {
    const output = await mySpawn(["--input", "csv"]);

    expect(output).to.include("Missing required argument: api-key-env-var");
  });

  it("should display error if supplied --api-key-env-var is undefined", async () => {
    const envVar = "OTHER_DUMMY";
    const output = await mySpawn([
      "-k",
      envVar,
      "--input",
      "csv",
      "--file",
      "sample.csv",
    ]);

    expect(output).to.include(`Environment variable ${envVar} not set`);
  });

  it('should display error if attempt to use "--input csv" without specifying "--file"', async () => {
    const output = await mySpawn(["-k", "DUMMY", "--input", "csv"]);

    expect(output).to.include("Missing required argument");
  });

  it('should display error if attempt to use "--input stdin" while also specifying "--file"', async () => {
    const output = await mySpawn([
      "-k",
      "DUMMY",
      "--input",
      "stdin",
      "--file",
      "sample.csv",
    ]);

    expect(output).to.include("Invalid argument");
  });

  it("should accept file input if supplied with valid arguments", async () => {
    const output = await mySpawn([
      "-k",
      "BYTEPLANT_KEY",
      "--input",
      "csv",
      "--file",
      "sample.csv",
    ]);

    expect(output).to.include("Street Address, City, Postal Code");
  });

  it("should accept std input if supplied with valid arguments", async () => {
    const output = await mySpawn(
      ["-k", "DUMMY", "--input", "stdin"],
      `Street Address, City, Postal Code
123 e Maine Street, Columbus`
    );

    expect(output).to.include("Street Address, City, Postal Code");
  });
});
