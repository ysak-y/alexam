import * as uuid from "uuid";

/**
 * Data class that represents user property used in session and context property of the request
 * See https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html#session-object
 */
export class User {
  id: string = "amzn1.ask.account." + uuid.v4();
  accessToken?: string;

  /**
   * Sets randomized value to `accessToken`. It is useful when you want to simulate request from account linked user.
   *
   * ```typescript
   * const user = new User();
   * user.linkAccount();
   * const skillContext = new SkillContext();
   * skillContext.setContext(new Context({ user }));
   * const alexam: Alexam = new AlexamBuilder()
   *   .setHandler(handlerObj)
   *   .setSkillContext(skillContext)
   *   .build();
   * ```
   */
  linkAccount() {
    this.accessToken = uuid.v4();
  }
}
