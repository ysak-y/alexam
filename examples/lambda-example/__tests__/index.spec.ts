import {
  Alexam,
  AlexamBuilder,
  SkillRequestFactory,
  LambdaHandler,
} from "../../../lib/";
import { handler } from "../src";
import { ui } from "ask-sdk-model";

const requestFactory = new SkillRequestFactory("en-US");

describe("Launch", () => {
  test("LaunchRequest", async () => {
    expect.assertions(1);
    const handlerObj = new LambdaHandler(handler);
    const alexam: Alexam = new AlexamBuilder().setHandler(handlerObj).build();
    const launchRequest = requestFactory.launchRequest();

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
    const launchRequest = requestFactory.intentRequest("HelloWorldIntent");

    await alexam.send(launchRequest).then(res => {
      expect((res.response.outputSpeech as ui.SsmlOutputSpeech).ssml).toMatch(
        "Hello world!!",
      );
    });
  });
});
