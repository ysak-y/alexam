import { SkillContext } from "./SkillContext";
import { Handler } from "./Handler";
import { RequestEnvelope, ResponseEnvelope } from "ask-sdk-model";
import { SkillRequestFactory } from ".";
import { Session } from "./skillRequest/Session";

/**
 * Interacts to handler and manage session until session close.
 */
export class Alexam {
  handler: Handler;
  requestFactory: SkillRequestFactory;
  skillContext: SkillContext;

  /**
   * Generates new Alexam object. Basically recommend to use AlexamBuilder to generate Alexam instead of generating manually.
   *
   * @param handler Handler object to handle skill request
   * @param requestFactory SkillRequestFactory object to generate request from Alexam
   * @param skillContext SkillContext object to retain session attributes while interaction
   *
   * @returns Alexam object
   */
  constructor(
    handler: Handler,
    requestFactory: SkillRequestFactory,
    skillContext: SkillContext,
  ) {
    this.handler = handler;
    this.requestFactory = requestFactory;
    this.skillContext = skillContext;
  }

  /**
   * Sends request to the Handler you set. Would send SessionEndedRequest type request automatically if response includes `shouldEndSession: true`.
   *
   * @param request RequestEnvelope object that is same as it from alexa-skills-kit-sdk-for-nodejs. You can create it with `SkillRequestFactory`.
   * @returns ResponseEnvelope object that is same as it from alexa-skills-kit-sdk-for-nodejs. You would check it by matcher method when testing.
   */
  async send(request: RequestEnvelope): Promise<ResponseEnvelope> {
    const resp = await this.handler.handle(request);
    this.updateSession(resp);
    if (resp.response.shouldEndSession === true) {
      await this.send(this.requestFactory.sessionEndedRequest());
    }
    return resp;
  }

  /**
   * Resets session of Alexam object. You would use it if you have some test cases with the Alexam object.
   */
  resetSession() {
    this.skillContext.setSession(
      new Session({ applicationId: this.skillContext.applicationId }),
    );
  }

  /**
   * @internal
   */
  private updateSession(response: ResponseEnvelope) {
    this.skillContext.session.new = false;
    const attributes = response.sessionAttributes;
    if (attributes) {
      this.skillContext.session.attributes = attributes;
    }
  }
}
