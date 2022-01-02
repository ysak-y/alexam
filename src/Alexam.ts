import { Handler } from "./Handler";
import { RequestEnvelope, ResponseEnvelope } from "ask-sdk-model";
import { SkillRequestFactory } from ".";

export class Alexam {
  handler: Handler;
  requestFactory: SkillRequestFactory;

  constructor(handler: Handler, requestFactory: SkillRequestFactory) {
    this.handler = handler;
    this.requestFactory = requestFactory;
  }

  async send(request: RequestEnvelope) {
    const resp = await this.handler.handle(request);
    this.updateSession(resp);
    return resp;
  }

  updateSession(response: ResponseEnvelope) {
    this.requestFactory.session.new = false;
    const attributes = response.sessionAttributes;
    if (attributes) {
      this.requestFactory.session.attributes = attributes;
    }
  }
}
