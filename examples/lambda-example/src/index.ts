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
      handlerInput.requestEnvelope.context.System.device?.supportedInterfaces[
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

const DisplayDeviceSendEventIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return !!(
      handlerInput.requestEnvelope.request.type ===
        "Alexa.Presentation.APL.UserEvent" &&
      handlerInput.requestEnvelope.context.System.device?.supportedInterfaces[
        "Alexa.Presentation.APL"
      ]
    );
  },
  handle(handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
      .speak("Request from UserEvent")
      .getResponse();
  },
};

const AccountLinkedUserLaunchRequest: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return !!(
      handlerInput.requestEnvelope.request.type === "LaunchRequest" &&
      handlerInput.requestEnvelope.context.System.user.accessToken
    );
  },
  handle(handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
      .speak("Request from account linked user")
      .getResponse();
  },
};

export const handler = async (event: any, context: any) => {
  const skill = SkillBuilders.custom()
    .addRequestHandlers(
      AccountLinkedUserLaunchRequest,
      LaunchRequestHandler,
      HelloWorldIntentHandler,
      CountUpIntentHandler,
      DisplayDeviceIntent,
      DisplayDeviceSendEventIntent,
    )
    .create();

  return skill.invoke(event, context);
};
