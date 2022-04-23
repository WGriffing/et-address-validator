"use strict";
const readline = require("readline");
const fs = require("fs");
const yargs = require("yargs");
const { Byteplant } = require("./provider/byteplant");

const run = () => {
  const argv = yargs(process.argv.slice(2))
    .options({
      input: {
        alias: "i",
        description: "Input source",
        type: "string",
        choices: ["stdin", "csv"],
        default: "stdin",
      },
      file: {
        alias: "f",
        description: "Input file. Required when --input=csv",
        type: "string",
      },
      provider: {
        alias: "p",
        description: "Provider to use",
        type: "string",
        choices: ["byteplant"],
        default: "byteplant",
      },
      "api-key-env-var": {
        alias: "k",
        description: "Environment variable holding the provider's API key",
        type: "string",
        demandOption: true,
      },
    })
    .help()
    .version(false)
    .alias("help", "h")
    .check((argv) => {
      if (argv.input === "csv" && !argv.file) {
        return "Missing required argument: --file must be specified when using --input=csv";
      }
      if (argv.input === "stdin" && argv.file) {
        return "Invalid argument: --file can not used when using --input=stdin";
      }
      if (argv["api-key-env-var"] && !process.env[argv["api-key-env-var"]]) {
        return `Environment variable ${argv["api-key-env-var"]} not set`;
      }
      return true;
    }).argv;

  // FUTURE: add additional providers here
  const providers = { byteplant: Byteplant };

  let Provider;
  switch (argv.provider) {
    // FUTURE: add additional providers here
    case "byteplant":
    default:
      Provider = providers.byteplant;
      break;
  }

  let inputStream;
  switch (argv.input) {
    case "csv":
      inputStream = fs.createReadStream(argv.file);
      break;
    case "stdin":
    default:
      inputStream = process.stdin;
      break;
  }

  const rl = readline.createInterface({
    input: inputStream,
    output: process.stdout,
    terminal: false,
  });

  const apiKey = process.env[argv["api-key-env-var"]];
  const provider = new Provider({ apiKey });
  provider.processLines(rl);
};

run();
