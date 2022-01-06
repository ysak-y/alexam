import { SkillRequestFactory } from "./SkillRequestFactory";
import { Alexam } from "./Alexam";
import { Handler } from "./Handler";
import { interfaces } from "ask-sdk-model";

export class AlexamBuilder {
  skillRequestFactory: SkillRequestFactory = new SkillRequestFactory("en-US");
  private _handler?: Handler;

  setSkillRequestFactory(skillRequestFactory: SkillRequestFactory) {
    this.skillRequestFactory = skillRequestFactory;
    return this;
  }

  setHandler(handler: Handler) {
    this._handler = handler;
    return this;
  }

  setDisplay(viewport: interfaces.viewport.ViewportState = {}) {
    this.skillRequestFactory.context.device.aplSupported();
    this.skillRequestFactory.context.viewport = viewport;
    return this;
  }

  build(): Alexam {
    if (!this._handler)
      throw new Error("You must set handler with setHandler!");

    return new Alexam(this._handler, this.skillRequestFactory);
  }
}
