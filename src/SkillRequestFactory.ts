import * as uuid from "uuid";
import { Context } from "./skillRequest/Context";
import { User } from "./skillRequest/User";
import { Session } from "./skillRequest/Session";
import { RequestEnvelope } from "ask-sdk-model";

export class SkillRequestFactory {
  user: User;
  applicationId: string = "amzn1.ask.skill." + uuid.v4();
  locale: string;
  session: Session = new Session(this.applicationId);
  context: Context;
  private _request: any;

  constructor(locale: string, user?: User) {
    this.locale = locale;
    this.user = user ? user : new User();
    this.context = new Context(this.applicationId, this.user);
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

  withSession() {
    this._request.session = this.session.toJson();
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
      locale: this.locale,
      requestId: "amzn1.echo-api.request." + uuid.v4(),
      timestamp: new Date().toISOString().substring(0, 19) + "Z",
    };
  }

  private requestEnvelopeBase() {
    return {
      version: "1.0",
      context: this.context.toJson(),
      request: null,
      session: null,
      //// TODO implement AudioPlayer
      //AudioPlayer: {},
    };
  }
}
