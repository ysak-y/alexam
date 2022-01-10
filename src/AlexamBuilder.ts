import { SkillContext } from "./SkillContext";
import { SkillRequestFactory } from "./SkillRequestFactory";
import { Alexam } from "./Alexam";
import { Handler } from "./Handler";

export class AlexamBuilder {
  skillContext: SkillContext = new SkillContext();
  skillRequestFactory: SkillRequestFactory = new SkillRequestFactory(
    this.skillContext,
  );
  private _handler?: Handler;

  setSkillContext(skillContext: SkillContext) {
    this.skillContext = skillContext;
    return this;
  }

  setHandler(handler: Handler) {
    this._handler = handler;
    return this;
  }

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
