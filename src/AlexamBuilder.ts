import { SkillRequestFactory } from "./SkillRequestFactory";
import { Alexam } from "./Alexam";
import { Handler } from "./Handler";

export class AlexamBuilder {
  skillRequestFactory?: SkillRequestFactory;
  private _handler?: Handler;

  setSkillRequestFactory(skillRequestFactory: SkillRequestFactory) {
    this.skillRequestFactory = skillRequestFactory;
  }

  setHandler(handler: Handler) {
    this._handler = handler;
    return this;
  }

  setInteractionModel() {}

  build(): Alexam {
    if (!this._handler)
      throw new Error("You must set handler with setHandler!");

    const skillRequestFactory = this.skillRequestFactory
      ? this.skillRequestFactory
      : new SkillRequestFactory("en-US");

    return new Alexam(this._handler, skillRequestFactory);
  }
}
