import { RequestEnvelope, ResponseEnvelope } from "ask-sdk-model";
export type LambdaFunction = (event: any, context: any, callback: any) => any;
export type Function = (request: RequestEnvelope) => any;

export class LambdaHandler implements Handler {
  handlerFunction: LambdaFunction;

  constructor(handlerFunction: LambdaFunction) {
    this.handlerFunction = handlerFunction;
  }

  async handle(request: RequestEnvelope): Promise<any> {
    return this.handlerFunction(request, {}, {});
  }
}

export class BaseHandler implements Handler {
  handlerFunction: Function;

  constructor(handlerFunction: Function) {
    this.handlerFunction = handlerFunction;
  }

  async handle(request: RequestEnvelope): Promise<any> {
    return this.handlerFunction(request);
  }
}

export interface Handler {
  handlerFunction: LambdaFunction | Function;
  handle(request: RequestEnvelope): Promise<ResponseEnvelope>;
}
