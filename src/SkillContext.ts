import { interfaces } from "ask-sdk-model";
import { Context } from "./skillRequest/Context";
import { Session } from "./skillRequest/Session";
import * as uuid from "uuid";

/**
 * Manages `Session`, `Context` and both related objects.
 */
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

  /**
   * Sets new `Session` object.
   *
   * @param session Session object you want to set.
   */
  setSession(session: Session) {
    this.session = session;
  }

  /**
   * Sets new `Context` object.
   *
   * @param context Context object you want to set.
   */
  setContext(context: Context) {
    this.context = context;
  }

  /**
   * Utility method for setting display information to context property.
   * This method sets `Alexa.Presentation.APL` as supported interface and `viewport` to viewport in `Context`.
   *
   * @param viewport Viewport object you want to set.
   */
  setDisplay(viewport: interfaces.viewport.ViewportState = {}) {
    this.context.device.aplSupported();
    this.context.viewport = viewport;
  }
}
