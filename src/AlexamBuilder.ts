import { SkillContext } from "./SkillContext";
import { SkillRequestFactory } from "./SkillRequestFactory";
import { Alexam } from "./Alexam";
import { Handler } from "./Handler";

/**
 * Builder class for Alexam.
 */
export class AlexamBuilder {
  skillContext: SkillContext = new SkillContext();
  skillRequestFactory: SkillRequestFactory = new SkillRequestFactory(
    this.skillContext,
  );
  private _handler?: Handler;

  /**
   * Sets your cumstom `SkillContext` object to `AlexamBuilder`.
   * You would want to use it if you need to customize session or context property of mock request.
   *
   * @param skillContext SkillContext object you want to set to Alexam
   * @returns AlexamBuilder object
   */
  setSkillContext(skillContext: SkillContext) {
    this.skillContext = skillContext;
    return this;
  }

  /**
   * Sets Handler object you want to send mock request.
   * Alexam would throw error if build without handler.
   *
   * @param handler Handler object you want to set to Alexam
   * @returns AlexamBuilder object
   */
  setHandler(handler: Handler) {
    this._handler = handler;
    return this;
  }

  /**
   * Builds new Alexam object with configurations you set or default.
   *
   * @returns AlexamBuilder object
   */
  build(): Alexam {
    if (!this._handler)
      throw new Error("You must set handler with setHandler!");

    this.skillRequestFactory = new SkillRequestFactory(this.skillContext);

    return new Alexam(
      this._handler,
      this.skillRequestFactory,
      this.skillContext,
    );
  }
}
