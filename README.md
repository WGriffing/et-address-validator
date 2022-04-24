# Purpose

This is a command-line utility designed to address the specifictions outlined in [code_sample.md](code_sample.md). 

It accepts a CSV file as input and returns either `Invalid Address` or a corrected/standardized address obtained via API call to a provider.

# Table of Contents

- [Purpose](#purpose)
- [Table of Contents](#table-of-contents)
- [Requirements](#requirements)
- [Setup](#setup)
  - [Dependencies](#dependencies)
  - [CSV file format](#csv-file-format)
- [Normal Usage](#normal-usage)
- [Testing](#testing)
  - [Requirements](#requirements-1)
  - [Run Tests Once](#run-tests-once)
  - [Watch Tests](#watch-tests)
  - [Coverage Report](#coverage-report)
- [Design Decisions](#design-decisions)
  - [Use Case 1 - Support the ability to add other API providers in the future](#use-case-1---support-the-ability-to-add-other-api-providers-in-the-future)
  - [Use Case 2 - Use streams to keep memory footprint small](#use-case-2---use-streams-to-keep-memory-footprint-small)
  - [Use Case 4 - Handle API rate limit](#use-case-4---handle-api-rate-limit)
  - [Use Case 4 - Tidy CLI interface](#use-case-4---tidy-cli-interface)
  - [Use Case 5 - Caching (Not implemented)](#use-case-5---caching-not-implemented)
  - [General methodology](#general-methodology)

# Requirements

The following tools must be installed on your system:

1. `node` - https://nodejs.org/en/
2. `yarn` - https://yarnpkg.com/
   - **Note**: You may substitute `npm` for yarn, but `package-lock.json` is not provided. There is a risk that the verions of packages will not be an exact match for those specified within `yarn.lock.`

# Setup
## Dependencies

To install the nececessary dependencies, run `yarn` from the root of your git clone.

## CSV file format

This tool accepts as CSV file as input. The format of that file is expected to be:
```csv
Street Address, City, Postal Code
123 e Maine Street, Columbus, 43215
```

See also: [code_sample](./code_sample.md)

# Normal Usage

To see the available CLI arguements, run

```bash
node ./index.js --help
```

The output will resemble

```
Options:
  -i, --input            Input source
                           [string] [choices: "stdin", "csv"] [default: "stdin"]
  -f, --file             Input file. Required when --input=csv          [string]
  -p, --provider         Provider to use
                          [string] [choices: "byteplant"] [default: "byteplant"]
  -l, --log-level        Log level
         [string] [choices: "trace", "debug", "info", "warn", "error"] [default:
                                                                         "warn"]
  -k, --api-key-env-var  Environment variable holding the provider's API key
                                                             [string] [required]
  -h, --help             Show help                                     [boolean]
```

As you can see in the above output, several inputs are required.

Additionally, certain combinations (for example `--input stdin --file sample.csv`) are invalid.

If you fail to supply the required arguments, or you supply an invalid combination of arguments, you will be greeted with an error message. 

Here's an example error response where `--api-key-env-var` (alias `-k`) was not specified:

```
% cat sample.csv | node ./index.js --input stdin
Options:
  -i, --input            Input source
                           [string] [choices: "stdin", "csv"] [default: "stdin"]
  -f, --file             Input file. Required when --input=csv          [string]
  -p, --provider         Provider to use
                          [string] [choices: "byteplant"] [default: "byteplant"]
  -l, --log-level        Log level
         [string] [choices: "trace", "debug", "info", "warn", "error"] [default:
                                                                         "warn"]
  -k, --api-key-env-var  Environment variable holding the provider's API key
                                                             [string] [required]
  -h, --help             Show help                                     [boolean]

Missing required argument: api-key-env-var
```

To supply an API key into the program, the `--api-key-env-var` (alias `-k`) is utilized.

Some of the tests expect this environment variable to be `BYTEPLANT_KEY` (see [Testing -> Requirements](#requirements-1)), but for non-test usage you may utilize any valid environment variable.

Here are some example methods by which you can choose to run the utility:

```bash
# CSV file example usage
node ./index.js --api-key-env-var BYTEPLANT_KEY --input csv --file ./sample.csv

# stdin example usage, verbose
cat sample.csv | node ./index.js -k BYTEPLANT_KEY -i stdin

# stdin example usage, simplified
#   The "--input" argument defaults to "stdin" so it can be skipped if stdin input is supplied.
cat sample.csv | node ./index.js -k BYTEPLANT_KEY
```

# Testing

## Requirements

Through your preferred method of establishing an environment variable, ensure that `BYTEPLANT_KEY` exists and has a valid API key.

- One option (for Mac or Linux), is to run the following command in a terminal:

  ```bash
  export BYTEPLANT_KEY=<your key>
  ```

  **Note**: This will persist your API key into your terminal's `history`, which may be undesirable.

There are a variety of ways to establish an environment variable depending on your OS, needs, and preferences, but I will leave deciding upon a method as an exercise for the reader.

## Run Tests Once

Execute the command `yarn test` in a terminal.

The output will resemble:

```
yarn run v1.22.10
$ mocha ./*.spec.js **/*.spec.js


  CLI
    ✔ should display help (141ms)
    ✔ should display error if no API key is supplied (124ms)
    ✔ should display error if supplied --api-key-env-var is undefined (122ms)
    ✔ should display error if attempt to use "--input csv" without specifying "--file" (128ms)
    ✔ should display error if attempt to use "--input stdin" while also specifying "--file" (128ms)
    ✔ should accept file input if supplied with valid arguments (738ms)
    ✔ should accept std input if supplied with valid arguments (122ms)

  Byteplant
    ✔ should return a corrected address, when possible
    ✔ should return "Invalid Address" when address cannot be located
    ✔ should fail to look up an address without an API key (288ms)
    ✔ should return an address when used with valid API key and valid inputs (262ms)
    ✔ should return "Invalid Address" when address cannot be located (251ms)
    ✔ should wait to retry if rate limit is exceeded (102ms)

  Provider
    ✔ should throw an error if abstract class is instantiated
    ✔ should throw an error if abstract method is not implemented in subclass


  15 passing (2s)

✨  Done in 2.84s.
```

## Watch Tests

If desired, the tests can be "watched" (continuously re-run when files are saved).

Execute the command `yarn watch` in a terminal.

The output will resemble:

```
yarn run v1.22.10
$ mocha ./*.spec.js **/*.spec.js --watch


  CLI
    ✔ should display help (100ms)
    ✔ should display error if no API key is supplied (107ms)
    ✔ should display error if supplied --api-key-env-var is undefined (103ms)
    ✔ should display error if attempt to use "--input csv" without specifying "--file" (106ms)
    ✔ should display error if attempt to use "--input stdin" while also specifying "--file" (102ms)
    ✔ should accept file input if supplied with valid arguments (651ms)
    ✔ should accept std input if supplied with valid arguments (118ms)

  Byteplant
    ✔ should return a corrected address, when possible
    ✔ should return "Invalid Address" when address cannot be located
    ✔ should fail to look up an address without an API key (296ms)
    ✔ should return an address when used with valid API key and valid inputs (264ms)
    ✔ should return "Invalid Address" when address cannot be located (263ms)
    ✔ should wait to retry if rate limit is exceeded (103ms)

  Provider
    ✔ should throw an error if abstract class is instantiated
    ✔ should throw an error if abstract method is not implemented in subclass


  15 passing (2s)

ℹ [mocha] waiting for changes...
```

## Coverage Report

To obtain a test coverage report, execute the command `yarn coverage` in a terminal.

The output will resemble:

```
yarn run v1.22.10
$ nyc mocha ./*.spec.js **/*.spec.js


  CLI
    ✔ should display help (216ms)
    ✔ should display error if no API key is supplied (207ms)
    ✔ should display error if supplied --api-key-env-var is undefined (224ms)
    ✔ should display error if attempt to use "--input csv" without specifying "--file" (215ms)
    ✔ should display error if attempt to use "--input stdin" while also specifying "--file" (219ms)
    ✔ should accept file input if supplied with valid arguments (790ms)
    ✔ should accept std input if supplied with valid arguments (225ms)

  Byteplant
    ✔ should return a corrected address, when possible
    ✔ should return "Invalid Address" when address cannot be located
    ✔ should fail to look up an address without an API key (297ms)
    ✔ should return an address when used with valid API key and valid inputs (244ms)
    ✔ should return "Invalid Address" when address cannot be located (247ms)
    ✔ should wait to retry if rate limit is exceeded (104ms)

  Provider
    ✔ should throw an error if abstract class is instantiated
    ✔ should throw an error if abstract method is not implemented in subclass


  15 passing (3s)

--------------------------------|---------|----------|---------|---------|-------------------
File                            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------------------|---------|----------|---------|---------|-------------------
All files                       |   98.87 |    95.12 |     100 |   98.83 |                   
 et-address-validation          |     100 |      100 |     100 |     100 |                   
  index.js                      |     100 |      100 |     100 |     100 |                   
  index.spec.js                 |     100 |      100 |     100 |     100 |                   
 et-address-validation/provider |    98.3 |    91.66 |     100 |   98.23 |                   
  byteplant.js                  |     100 |      100 |     100 |     100 |                   
  byteplant.spec.js             |     100 |      100 |     100 |     100 |                   
  provider.js                   |   94.73 |    84.61 |     100 |   94.59 | 69,81             
  provider.spec.js              |     100 |      100 |     100 |     100 |                   
--------------------------------|---------|----------|---------|---------|-------------------
✨  Done in 4.18s.
```

# Design Decisions

As a toy problem, it was rather quick and easy to write some functional code returning the expected output in a single `index.js`.

Once I had a very basic example working, I gave some thought to finding some plausible use cases. Either as to how the program might be tested/evaluated or how it could be expanded upon in the future. 

## Use Case 1 - Support the ability to add other API providers in the future

I created and structured the `Provider` class as an Abstract class. As part of this effort, there are some expected methods that implementations of `Provider` must implement. Failure to do so will result in errors.

Using this approach, shared methods can be written once in the `Provider` class rather than needing to be rewritten for each new API provider. Since I have not attempted to add a 2nd provider at this time, I will not be surprised if limited refactoring is necessary to be successful at adding a second provider, but it should be minimal.

## Use Case 2 - Use streams to keep memory footprint small

It occurred to me that it might be useful to show the ability to handle "large" CSV inputs. I doubt that a file large enough to trigger memory issues would be supplied, so this is more about showcasing ability/thought process than providing real utility.

The free Byteplant API key has modest rate limits that realistically prohibit more than 100 lines every 5 minutes, but there is no reason to assume the solution won't be tested against a larger input CSV file and a paid API key with different limits. 

In any event, I decided to use streams for the input and to process the file synchronously line-by-line. It's a tradeoff, but this approach also allows me to easily handle the next use case regarding API limits.

## Use Case 4 - Handle API rate limit

In furtherance of supporting large files, I decided to leverage the information returned by the Byteplant API to ensure that my code would wait when its API usage was exhausted.

I did not want to assume that other possible API providers in the future would provide their rate limit waiting periods in the API responses, so there is also a recursive, expontential backoff functionality as a fallback time delay.

## Use Case 4 - Tidy CLI interface

I wanted to make sure the program's CLI itself was easy to interact with. Luckily, `yargs` is available where the logic of CLI argument parsing is done on my behalf, leaving me free to concentrate on other things.

## Use Case 5 - Caching (Not implemented)

It seems reasonable to me that a CLI utility might implement caching so that multiple attempts to verify the same address result in only a single API call. I have not added this logic, but I thought it was worth mentioning.

## General methodology

Throughout all of the above, I established `*.spec.js` files for any new `*.js` file. 

In tandem with, or prior to, adding/changing/deleting code I would also update the tests. 

Frequently, but not always, this took the form of TDD where I would fail a new test until I wrote code to handle that use case. I typically keep `yarn watch` running at all times so I can spot mis-steps or mistakes quickly.

Towards the end of the process, I began to rely more upon `yarn coverage` to spot any uncovered code. I don't have 100% coverage, but it's close. In the current state, I feel like I've demonstrated the ability to write tests and don't necessarily want to spend additional free time on the assignment.