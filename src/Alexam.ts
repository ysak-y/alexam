import { Handler } from "./Handler";
import { RequestEnvelope } from "ask-sdk-model";
import { SkillRequestFactory } from ".";

export class Alexam {
  handler: Handler;
  requestFactory: SkillRequestFactory;

  constructor(handler: Handler, requestFactory: SkillRequestFactory) {
    this.handler = handler;
    this.requestFactory = requestFactory;
  }

  //async utter(text: string) {}

  async send(request: RequestEnvelope) {
    const resp = await this.handler.handle(request);
    const attributes = resp.sessionAttributes;
    if (attributes) {
      this.requestFactory.session.attributes = attributes;
    }
    return resp;
  }
}
