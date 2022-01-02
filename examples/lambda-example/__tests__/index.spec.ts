import { Alexam, AlexamBuilder, LambdaHandler } from "../../../lib/";
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

test("IntentRequest", async () => {
  expect.assertions(1);
  const handlerObj = new LambdaHandler(handler);
  const alexam: Alexam = new AlexamBuilder().setHandler(handlerObj).build();
  const helloWorldIntent =
    alexam.requestFactory.intentRequest("HelloWorldIntent");

  return alexam.send(helloWorldIntent).then(res => {
    expect((res.response.outputSpeech as ui.SsmlOutputSpeech).ssml).toMatch(
      "Hello world!!",
    );
  });
});

test("Retain session attributes", async () => {
  expect.assertions(1);
  const handlerObj = new LambdaHandler(handler);
  const alexam: Alexam = new AlexamBuilder().setHandler(handlerObj).build();
  const requestFactory = alexam.requestFactory;
  const countUpIntent = requestFactory.intentRequest("CountUpIntent");

  return alexam
    .send(countUpIntent)
    .then(() => {
      const countUpIntent2 = requestFactory.intentRequest("CountUpIntent");
      return alexam.send(countUpIntent2);
    })
    .then(res => {
      expect(res.sessionAttributes?.count).toBe(2);
    });
});
