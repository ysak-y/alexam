import {
  Alexam,
  AlexamBuilder,
  LambdaHandler,
  Session,
  Context,
  User,
  SkillContext,
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
  const skillContext = new SkillContext();
  skillContext.setDisplay();

  const alexam: Alexam = new AlexamBuilder()
    .setHandler(handlerObj)
    .setSkillContext(skillContext)
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
  const skillContext = new SkillContext();
  skillContext.setDisplay();

  const alexam: Alexam = new AlexamBuilder()
    .setHandler(handlerObj)
    .setSkillContext(skillContext)
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
  const skillContext = new SkillContext();
  skillContext.setSession(
    new Session({
      applicationId: skillContext.applicationId,
      attributes: { count: 10 },
    }),
  );
  const alexam: Alexam = new AlexamBuilder()
    .setHandler(handlerObj)
    .setSkillContext(skillContext)
    .build();
  const countUpIntent = alexam.requestFactory.intentRequest("CountUpIntent");

  const resp = await alexam.send(countUpIntent);
  expect(resp.sessionAttributes?.count).toBe(11);
});

test("Test with account linked user", async () => {
  const handlerObj = new LambdaHandler(handler);
  const user = new User();
  user.linkAccount();
  const skillContext = new SkillContext();
  skillContext.setContext(new Context({ user }));

  const alexam: Alexam = new AlexamBuilder()
    .setHandler(handlerObj)
    .setSkillContext(skillContext)
    .build();
  const requestFactory = alexam.requestFactory;
  const launchRequest = requestFactory.launchRequest();

  const resp = await alexam.send(launchRequest);
  expect((resp.response.outputSpeech as ui.SsmlOutputSpeech).ssml).toMatch(
    "Request from account linked user",
  );
});

describe("Multiple test cases with one alexam object for demonstrating resetSession", () => {
  const alexam = new AlexamBuilder()
    .setHandler(new LambdaHandler(handler))
    .build();

  afterEach(() => {
    alexam.resetSession();
  });

  test("Retain session attributes", async () => {
    expect.assertions(1);
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

  test("Use pre defined session attributes", async () => {
    alexam.skillContext.setSession(
      new Session({
        applicationId: alexam.skillContext.applicationId,
        attributes: { count: 10 },
      }),
    );
    const countUpIntent = alexam.requestFactory.intentRequest("CountUpIntent");

    const resp = await alexam.send(countUpIntent);
    expect(resp.sessionAttributes?.count).toBe(11);
  });
});
