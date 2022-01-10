import { SkillContext } from "./SkillContext";
import * as uuid from "uuid";
import { RequestEnvelope } from "ask-sdk-model";
import { IntentRequest } from "./SkillRequest";
import { interfaces } from "ask-sdk-model";

export class SkillRequestFactory {
  skillContext: SkillContext;
  private _request: any;

  constructor(skillContext: SkillContext) {
    this.skillContext = skillContext;
    this._request = this.requestEnvelopeBase();
  }

  launchRequest(): RequestEnvelope {
    return this.withSession()
      .withRequest({
        type: "LaunchRequest",
        ...this.requestBase(),
      })
      .getRequest();
  }

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

  withSession() {
    this._request.session = this.skillContext.session.toJson();
    return this;
  }

  withRequest(request: any) {
    this._request.request = request;
    return this;
  }

  getRequest() {
    return this._request;
  }

  private requestBase() {
    return {
      locale: this.skillContext.locale,
      requestId: "amzn1.echo-api.request." + uuid.v4(),
      timestamp: new Date().toISOString().substring(0, 19) + "Z",
    };
  }

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
