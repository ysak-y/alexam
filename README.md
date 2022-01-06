# alexam
Simulate Alexa interaction for testing and debugging (beta).
It is highly inspired by virtual-alexa.

## Why alexam

WIP

## Install

### yarn
`$ yarn add -D alexam`

### npm
`$ npm install --save-dev alexam`

## Usage

WIP

## Anything else

### Doesn't support remote debugging

virtual-alexa supports remote debugging but alexam doesn't.
I recommend you to debug actual code by using [ask-cli](https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html) or simulator on ask developer console.
alexam is for testing or debugging local code while implementing.

### Doesn't support test by actual utterance (for now)

[virtual-alexa](https://github.com/bespoken/virtual-alexa) supports `utter` command which can test by actual utterance.
It sounds some benefits but doesn't support alexam (for now) because

- Complecate for multilingual skill

If your alexa skill would be multilingual, what language will you choose for actual test?
If you think it's important to check whether work correctly by actual utterance, will you prepare whole supporting language for each test case?
It sounds complecate for me. Sometimes it would be noisy for designing test suite.
You would think test case with actual utterance would be easy to understand the purpose of the case, but I think it would be same if intent name is proper. 

- Fail test unexpectedly if sample utterance is modified

If using actual utterance, you should run whole tests if just modifing sample utterances because some test cases includes utterance you removed.
I think those kind of tests are basically for checking logics, shouldn't check detail interfaces. At least, alexam is designed for it.

btw, actually I agree with important to test by actual utterance. But I want you to use [dialog](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-command-reference.html#dialog-command) command of ask-cli. It is similar as actual environment, you can also use built-in intetns and slots. I just mean alexam isn't suitable for it.
