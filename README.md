# alexam
Simulate Alexa interaction for testing and debugging (beta).
It is highly inspired by [virtual-alexa](https://github.com/bespoken/virtual-alexa).

## Features

### Send mock request to your handler and get resopnse

alexam can mock sevaral types of request in alexa-skill-kit like `LaunchRequest`, `IntentRequest` and `Alexa.Presentation.APL.UserEvent`.
And can send it to your handler. So you can test your handler easily.

### Retain session attributes

alexam can retain session attributes until end session. So you can test multi-turn interaciton.

## Why alexam?

### Configure easily

You can configure Alexam easily. `new AlexamBuilder().setHandler(handlerObj).build()` is the minimum configuration.
And if you want to set pre-defined `context` or `session` object, you can build and set these easily.

### Simulate several type of request easily

You can build `LaunchRequest`, `IntentRequest`, `SessionEndedRequest` and `Alexa.Presentation.APL.UserEvent` type request easily. And you can build your own custom request.

### Request and response objects are same as official ask-sdk type

Type of mock request built by Alexam is same as [RequestEnvelope](https://github.com/alexa/alexa-apis-for-nodejs/blob/master/ask-sdk-model/index.ts#L605-L622) which is the general request interface in [official sdk](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs). And response from Alexam is [ResponseEnvelope](https://github.com/alexa/alexa-apis-for-nodejs/blob/master/ask-sdk-model/index.ts#L645-L650) which is the general response interface in official sdk also.
It means you can simulate actual execution environment with Alexam.

## Install

### yarn
`$ yarn add -D alexam`

### npm
`$ npm install --save-dev alexam`

## Getting Started

Following is the minimum example that simulate skill interaction with alexam.
If you want to know more actual usage of alexam, please see [example test cases](./examples/lambda-example/__tests__/index.spec.ts).

```typescript
import { AlexamBuilder, LambdaHandler } from "alexam";
import { SkillBuilders, HandlerInput, RequestHandler } from "ask-sdk";

// Configure handler
const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput: HandlerInput) {
    const speechText = "Welcome to the Alexa Skills Kit, you can say hello!";

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  },
};

const handler = SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler)
  .lambda();

// Configure alexam
const alexam = new AlexamBuilder()
  .setHandler(new LambdaHandler(handler))
  .build();

// Build mock LaunchRequest
const launchRequest = alexam.requestFactory.launchRequest();

// Send mock LaunchRequest to hadndler by using alexam.
Promise.resolve(alexam.send(launchRequest)).then(response => {
  console.log(`response is ${JSON.stringify(response)}`); -> // response is {"version":"1.0","response":{"outputSpeech":{"type":"SSML","ssml":"<speak>Welcome to the Alexa Skills Kit, you can say hello!</speak>"}},"userAgent":"ask-node/2.11.0 Node/v17.3.0","sessionAttributes":{}}
});
```

To send request to your handler from alexam, you need to
1. Configure alexam with your handler
2. Build mock request by SkillRequestFactory
3. Call `send()` with mock request

### 1. Configure alexam with your handler

At first, you should build new alexam object from `AlexamBuilder`. You can build it just calling `setHandler()` then `build()` method as minimum configuration.
You can add more settings if you want. Please see Reference section.

### 2. Build mock request by SkillRequestFactory

You can build mock request by using `SkillRequestFactory`. Please see Reference section how to build these.

### 3. Call `send()` with mock requestConfigure alexam with your handler

So then, you can send mock request to your handler by `alexam.send()` method. Response object is same as [ResponseEnvelope](https://github.com/alexa/alexa-apis-for-nodejs/blob/master/ask-sdk-model/index.ts#L645-L650) which is the general response interface in official sdk.

### For testing

Following code is the test example with [jest](https://jestjs.io/) framework.
If you want to know more actual usage of alexam, please see [example test cases](./examples/lambda-example/__tests__/index.spec.ts).

``` typescript
import {
  Alexam,
  AlexamBuilder,
  LambdaHandler,
  SkillRequestFactory,
  Session,
} from "alexam";
import { handler } from "../src";
import { ui } from "ask-sdk-model";

test("LaunchRequest", async () => {
  expect.assertions(1);
  const handlerObj = new LambdaHandler(handler);
  const alexam: Alexam = new AlexamBuilder().setHandler(handlerObj).build();
  const launchRequest = alexam.requestFactory.launchRequest();

  await alexam.send(launchRequest).then(res => {
    expect((res.response.outputSpeech as ui.SsmlOutputSpeech).ssml).toMatch(
      "Welcome to the Alexa Skills Kit, you can say hello!",
    );
  });
});
```

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
