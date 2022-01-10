import { interfaces } from "ask-sdk-model";
import { Context } from "./skillRequest/Context";
import { Session } from "./skillRequest/Session";
import * as uuid from "uuid";

export class SkillContext {
  applicationId: string = "amzn1.ask.skill." + uuid.v4();
  locale: string;
  session: Session;
  context: Context;

  constructor({
    applicationId = "amzn1.ask.skill." + uuid.v4(),
    locale = "en-US",
    session,
    context,
  }: {
    applicationId?: string;
    locale?: string;
    session?: Session;
    context?: Context;
  } = {}) {
    this.applicationId = applicationId;
    this.locale = locale;
    this.session = session
      ? session
      : new Session({ applicationId: this.applicationId });
    this.context = context
      ? context
      : new Context({
          applicationId: this.applicationId,
        });
  }

  setSession(session: Session) {
    this.session = session;
  }

  setContext(context: Context) {
    this.context = context;
  }

  setDisplay(viewport: interfaces.viewport.ViewportState = {}) {
    this.context.device.aplSupported();
    this.context.viewport = viewport;
  }
}
