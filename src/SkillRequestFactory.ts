import { SkillContext } from "./SkillContext";
import * as uuid from "uuid";
import { RequestEnvelope } from "ask-sdk-model";
import { IntentRequest } from "./SkillRequest";
import { interfaces } from "ask-sdk-model";

/**
 * Builder class for generating mock skill request.
 */
export class SkillRequestFactory {
  skillContext: SkillContext;
  private _request: any;

  constructor(skillContext: SkillContext) {
    this.skillContext = skillContext;
    this._request = this.requestEnvelopeBase();
  }

  /**
   * Builds mock `LaunchRequest` type request.
   *
   * @returns RequestEnvelope object that represents `LaunchRequest` type request
   */
  launchRequest(): RequestEnvelope {
    return this.withSession()
      .withRequest({
        type: "LaunchRequest",
        ...this.requestBase(),
      })
      .getRequest();
  }

  /**
   * Builds mock `IntentRequest` type request.
   *
   * @param intentName intent name
   * @param slots slot values
   *
   * @returns RequestEnvelope object that represents `IntentRequest` type request with intentName and slots
   */
  // Does not support Dialog interface
  intentRequest(
    intentName: string,
    slots?: { [slotName: string]: any },
  ): RequestEnvelope {
    const intentRequestPayload: IntentRequest = {
      type: "IntentRequest",
      intent: {
        name: intentName,
      },
      ...this.requestBase,
    };

    if (slots) {
      const slotsPayload: { [slotName: string]: any } = {};
      Object.keys(slots).forEach(slotName => {
        slotsPayload[slotName] = {
          name: slotName,
          value: slots[slotName],
          slotValue: {
            value: slots[slotName],
          },
        };
      });

      intentRequestPayload.slots = slotsPayload;
    }

    return this.withSession().withRequest(intentRequestPayload).getRequest();
  }

  /**
   * Builds mock `Alexa.Presentation.APL.UserEvent` type request.
   *
   * @param param0 See https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-interface.html#userevent-properties
   *
   * @returns RequestEnvelope object that represents `Alexa.Presentation.APL.UserEvent` type request with arguments
   */
  aplUserEventRequest({
    token,
    // 'arguments' is reserved by JavaScript...
    eventArguments,
    source,
    components,
  }: {
    token?: string;
    eventArguments?: [any];
    source?: any;
    components?: any;
  }): RequestEnvelope {
    return this.withSession()
      .withRequest({
        type: "Alexa.Presentation.APL.UserEvent",
        token,
        arguments: eventArguments,
        source,
        components,
        ...this.requestBase(),
      })
      .getRequest();
  }

  /**
   * Builds mock `Connections.Response` type request.
   *
   * @param param0 See https://developer.amazon.com/en-US/docs/alexa/in-skill-purchase/add-isps-to-a-skill.html#handle-results
   *
   * @returns RequestEnvelope object that represents `Connections.Response` type request with arguments
   */
  connectionsResponse({
    name,
    payload,
    status,
    token,
  }: {
    name?: string;
    payload?: { [key: string]: any };
    status?: interfaces.connections.ConnectionsStatus;
    token?: string;
  }): RequestEnvelope {
    return this.withRequest({
      type: "Connections.Response",
      name,
      status,
      payload,
      token,
      ...this.requestBase(),
    }).getRequest();
  }

  /**
   * Builds mock `SessionEndedRequest` type request.
   * See https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-types-reference.html#sessionendedrequest-parameters
   *
   * @param reason Reason to end session.
   * @param error Error object if session is ended by error.
   *
   * @returns RequestEnvelope object that represents `SessionEndedRequest` type request with arguments
   */
  sessionEndedRequest(
    reason: string = "USER_INITIATED",
    error?: { type: string; message: string },
  ): RequestEnvelope {
    const payload = this.withRequest({
      type: "SessionEndedRequest",
      reason,
      ...this.requestBase(),
    }).getRequest();

    if (error) {
      payload.error = error;
    }

    return payload;
  }

  /**
   * Adds json object of `Session` to internal request object. You can take it by using `getRequest()`.
   * Use this method if you want to build your own custom request like following.
   * ```typescript
   * const mockRequest = skillRequestFactory
   *   .withSession()
   *   .withRequest(someRequestJson)
   *   .getRequest();
   * ```
   *
   * If you want to customize `Session`, you should it throught `SkillContext` object.
   * ```typescript
   * skillRequestFactory.skillContext = newSkillContext;
   * const mockRequest = skillRequestFactory
   *   .withSession() // <- This includes session in newSkillContext
   *   .withRequest(someRequestJson)
   *   .getRequest();
   * ```
   *
   * @returns SkillRequestFacotry object that has the session object to internal request property.
   */
  withSession() {
    this._request.session = this.skillContext.session.toJson();
    return this;
  }

  /**
   * Adds `request` to `_request` internal property. You can take it by using `getRequest()`.
   * Use this method if you want to build your own custom request like following.
   * This method would be helpful if SkillRequestFactory doens't support to generate the request you want.
   *
   * ```typescript
   * const mockRequest = skillRequestFactory
   *   .withRequest(someRequestJson)
   *   .getRequest();
   * ```
   *
   * @param request Request object you want to generate by SkillRequestFacotry
   *
   * @returns SkillRequestFacotry object that has the request object to internal request property.
   */
  withRequest(request: any) {
    this._request.request = request;
    return this;
  }

  /**
   * Returns internal request object of `SkillRequestFactory`.
   * This method would be useful if you want to generate custom request object with `withSession()` and `withRequest()` methods
   *
   * @returns request object with values set by `withSession()` and `withRequest()` methods
   */
  getRequest() {
    return this._request;
  }

  /**
   * @internal
   */
  private requestBase() {
    return {
      locale: this.skillContext.locale,
      requestId: "amzn1.echo-api.request." + uuid.v4(),
      timestamp: new Date().toISOString().substring(0, 19) + "Z",
    };
  }

  /**
   * @internal
   */
  private requestEnvelopeBase() {
    return {
      version: "1.0",
      context: this.skillContext.context.toJson(),
      request: null,
      session: null,
      //// TODO implement AudioPlayer
      //AudioPlayer: {},
    };
  }
}
