import * as uuid from "uuid";

/**
 * Data class that represents device property of the request
 * See https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html#system-object
 */
export class Device {
  id: string = "deviceID." + uuid.v4();
  private _supportedInterfaces: any = {};

  constructor() {
    this.audioPlayerSupported();
  }

  /**
   * Configures device to support AudioPlayer.
   *
   * @param obj See https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html#audioplayer-object
   */
  audioPlayerSupported(obj: { [name: string]: any } = {}) {
    this.supportedInterface("AudioPlayer", obj);
  }

  /**
   * Configures device to support APL.
   * You should call it if you want to simulate request from APL supported device.
   *
   * @param maxVersion Max APL version you want to support. Default is 1.9.
   */
  aplSupported(maxVersion?: string) {
    this.supportedInterface("Alexa.Presentation.APL", {
      runtime: {
        maxVersion: maxVersion ? maxVersion : "1.9",
      },
    });
  }

  /**
   * Configures device to support VideoApp.
   * @param obj See https://developer.amazon.com/en-US/docs/alexa/custom-skills/videoapp-interface-reference.html#supported-video-formats-and-resolutions
   */
  videoAppSupported(obj: { [name: string]: any } = {}) {
    this.supportedInterface("VideoApp", obj);
  }

  /**
   * Returns internal _supportedInterfaces property
   *
   * @returns _supportedInterfaces object.
   */
  supportedInterfaces(): any {
    return this._supportedInterfaces;
  }

  /**
   * @internal
   */
  private supportedInterface(name: string, obj: { [name: string]: any }) {
    this._supportedInterfaces[name] = obj;
  }
}
