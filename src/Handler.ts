import { RequestEnvelope, ResponseEnvelope } from "ask-sdk-model";
export type LambdaFunction = (event: any, context: any, callback: any) => any;
export type Function = (request: RequestEnvelope) => any;

/**
 * Simulates environment of AWS Lambda.
 * You can exeute your handler function by calling `handle()` with request object.
 */
export class LambdaHandler implements Handler {
  handlerFunction: LambdaFunction;

  /**
   * @param handlerFunction handler funciton you want to execute.
   */
  constructor(handlerFunction: LambdaFunction) {
    this.handlerFunction = handlerFunction;
  }

  /**
   * Simulates AWS Lambda environment and handle request by handlerFunction.
   *
   * @param request RequestEnvelope object you want to handle by handlerFunction you set.
   *
   * @returns Results to handle request.
   */
  async handle(request: RequestEnvelope): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const callback = (error: Error, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      };

      try {
        const response = await this.handlerFunction(request, {}, callback);
        if (response) {
          resolve(response);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}

/**
 * @internal
 */
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
