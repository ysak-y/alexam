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

export const handler = async (event, context) => {
  const skill = SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler)
    .create();

  return skill.invoke(event, context);
};
