import { SkillContext } from "./SkillContext";
import { Handler } from "./Handler";
import { RequestEnvelope, ResponseEnvelope } from "ask-sdk-model";
import { SkillRequestFactory } from ".";
import { Session } from "./skillRequest/Session";

export class Alexam {
  handler: Handler;
  requestFactory: SkillRequestFactory;
  skillContext: SkillContext;

  constructor(
    handler: Handler,
    requestFactory: SkillRequestFactory,
    skillContext: SkillContext,
  ) {
    this.handler = handler;
    this.requestFactory = requestFactory;
    this.skillContext = skillContext;
  }

  async send(request: RequestEnvelope) {
    const resp = await this.handler.handle(request);
    this.updateSession(resp);
    if (resp.response.shouldEndSession === true) {
      await this.send(this.requestFactory.sessionEndedRequest());
    }
    return resp;
  }

  resetSession() {
    this.skillContext.setSession(
      new Session({ applicationId: this.skillContext.applicationId }),
    );
  }

  private updateSession(response: ResponseEnvelope) {
    this.skillContext.session.new = false;
    const attributes = response.sessionAttributes;
    if (attributes) {
      this.skillContext.session.attributes = attributes;
    }
  }
}
