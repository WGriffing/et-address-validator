# Overview

Thank you for considering a software engineering position at \<redacted\>.

### Questions

We consider the software coding problem extremely important, since it is our way of seeing how you will perform in some very critical ways on a daily basis.  We don't want any confusion you may have to stop you from doing your best work, so please do not hesitate to contact us if you have any questions.

### Timing and Size

This problem was designed to be not too big, and not too small, but hopefully "just right".  There is no due date. We understand you are doing this in your spare time.  Keeping it reasonably sized and giving you the time needed are done in hopes that you allow us to see your best work.

### Delivery

Please send us a compressed file through a file-sharing site (Google Drive, iCloud, Dropbox, etc.) or through a public github repository.

### Documentation

Please add documentation in the form of a README that gives instructions on how to run your code and tests as well as the thought process that went into the decisions you made.  Explaining your thought process gives us the background we need to make the best evaluation.

# Code Requirements

### Description

Create a command-line program that validates a US address against the following API and outputs the corrected address or `Invalid Address`

https://www.address-validator.net/free-trial-registration.html

1. The tool must run in a console window/terminal.
2. The input should be piped in or read from a file: `cat file.csv | node program.js` or `ruby program.rb file.csv`
3. The input format is CSV with the following fields: `Street Address`, `City`, and `Postal Code`
4. The output line should include the original address and the corrected output values joined with `, ` and seperated by a ` -> ` (see below).
5. You are not permitted to pay for more API results (100 free address checks) which a testing suite could quickly exhaust.  A testing strategy we like to help prevent this would be a [stub or mock](https://martinfowler.com/articles/mocksArentStubs.html).

### Example IO

Given the file with the contents:

```
Street Address, City, Postal Code
123 e Maine Street, Columbus, 43215
1 Empora St, Title, 11111
```

Your output should be:

```
123 e Maine Street, Columbus, 43215 -> 123 E Main St, Columbus, 43215-5207
1 Empora St, Title, 11111 -> Invalid Address
```

# Considerations

### Programming Language

Use the programming language you are most comfortable with.  We are not interested in your familiarity with the idioms of any specific language, but rather your familiarity with the idioms of the language with which you are most comfortable.  Ensure any language specific instructions make few assumptions about the runtime environment needed to execute the sample.

### Size

This is a simple integration and could be accomplished in one file as a script, but that would not give us much insight into your abilities as a software engineer.

We are looking for code that has the opportunity to demonstate good design and modeling, so make this submission larger than strictly necessary.

### API Keys

We have our own set of api keys we use to evaluate code samples, consider an easy way to manage using different secrets

### Evaluation

We are going to be looking for the right amount of high-quality code.  The factors that will be used:

1. All of the tests run with the given instructions.
2. How well the code is designed.
    * Low coupling of logically different components
    * Simplicity of the testing interface
    * Code language mirrors the problem domain
3. How well the code is exercised through the test suite.
4. How readable or explained the code is.
5. How easily the sample could be extended with new functionality.
