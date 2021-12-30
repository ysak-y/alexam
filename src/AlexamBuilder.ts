import { Alexam } from "./Alexam";
import { Handler } from "./Handler";

export class AlexamBuilder {
  private _handler?: Handler;

  setHandler(handler: Handler) {
    this._handler = handler;
    return this;
  }

  setInteractionModel() {}

  build(): Alexam {
    if (!this._handler)
      throw new Error("You must set handler with setHandler!");

    return new Alexam(this._handler);
  }
}
