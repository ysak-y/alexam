import {
  Alexam,
  AlexamBuilder,
  LambdaHandler,
  SkillRequestFactory,
  Session,
} from "../../../lib/";
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

test("Simulate request from display device", async () => {
  expect.assertions(1);
  const handlerObj = new LambdaHandler(handler);
  const alexam: Alexam = new AlexamBuilder()
    .setHandler(handlerObj)
    .setDisplay()
    .build();
  const requestFactory = alexam.requestFactory;
  const displayDeviceIntent = requestFactory.intentRequest(
    "DisplayDeviceIntent",
  );

  return alexam.send(displayDeviceIntent).then(res => {
    expect((res.response.outputSpeech as ui.SsmlOutputSpeech).ssml).toMatch(
      "Request from display device",
    );
  });
});

test("Simulate request of Alexa.Presentation.APL.UserEvent", async () => {
  expect.assertions(1);
  const handlerObj = new LambdaHandler(handler);
  const alexam: Alexam = new AlexamBuilder()
    .setHandler(handlerObj)
    .setDisplay()
    .build();
  const requestFactory = alexam.requestFactory;
  const aplUserEventRequest = requestFactory.aplUserEventRequest({});

  return alexam.send(aplUserEventRequest).then(res => {
    expect((res.response.outputSpeech as ui.SsmlOutputSpeech).ssml).toMatch(
      "Request from UserEvent",
    );
  });
});

test("Use pre defined session attributes", async () => {
  const handlerObj = new LambdaHandler(handler);
  const skillRequestFactory = new SkillRequestFactory(
    "en-US",
    new Session("my-application-id", { count: 10 }),
  );
  const alexam: Alexam = new AlexamBuilder()
    .setHandler(handlerObj)
    .setSkillRequestFactory(skillRequestFactory)
    .build();
  const requestFactory = alexam.requestFactory;
  const countUpIntent = requestFactory.intentRequest("CountUpIntent");

  const resp = await alexam.send(countUpIntent);
  expect(resp.sessionAttributes?.count).toBe(11);
});
