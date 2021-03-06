import { AlexamBuilder, LambdaHandler } from "../lib";
import { SkillBuilders, HandlerInput, RequestHandler } from "ask-sdk";

const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput: HandlerInput) {
    const speechText = "Welcome to the Alexa Skills Kit, you can say hello!";

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  },
};

const handler = async (event: any, context: any) => {
  const skill = SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler)
    .create();

  return skill.invoke(event, context);
};

test("Update new property of session to false", async () => {
  const alexam = new AlexamBuilder()
    .setHandler(new LambdaHandler(handler))
    .build();
  expect(alexam.skillContext.session.new).toBe(true);
  const launchRequest = alexam.requestFactory.launchRequest();
  await alexam.send(launchRequest);
  expect(alexam.skillContext.session.new).toBe(false);
});

test("Reset session", async () => {
  const alexam = new AlexamBuilder()
    .setHandler(new LambdaHandler(handler))
    .build();
  const launchRequest = alexam.requestFactory.launchRequest();
  await alexam.send(launchRequest);
  expect(alexam.skillContext.session.new).toBe(false);
  alexam.resetSession();
  expect(alexam.skillContext.session.new).toBe(true);
});
