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

const HelloWorldIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "HelloWorldIntent"
    );
  },
  handle(handlerInput: HandlerInput) {
    const speechText = "Hello world!!";

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  },
};

const CountUpIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "CountUpIntent"
    );
  },
  handle(handlerInput: HandlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.count = attributes.count ? attributes.count + 1 : 1;

    handlerInput.attributesManager.setSessionAttributes(attributes);

    return handlerInput.responseBuilder.getResponse();
  },
};

const DisplayDeviceIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return !!(
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name ===
        "DisplayDeviceIntent" &&
      handlerInput.requestEnvelope.context.System.device.supportedInterfaces[
        "Alexa.Presentation.APL"
      ]
    );
  },
  handle(handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
      .speak("Request from display device")
      .getResponse();
  },
};

export const handler = async (event, context) => {
  const skill = SkillBuilders.custom()
    .addRequestHandlers(
      LaunchRequestHandler,
      HelloWorldIntentHandler,
      CountUpIntentHandler,
      DisplayDeviceIntent,
    )
    .create();

  return skill.invoke(event, context);
};
