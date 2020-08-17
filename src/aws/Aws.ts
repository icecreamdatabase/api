"use strict"

import AWS, {Polly} from "aws-sdk"

export class Aws {
  private readonly _polly: Polly

  constructor () {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'channelpoints_tts'})
    this._polly = new AWS.Polly({region: "eu-west-1"})
  }

  /**
   *
   * @throws stuff TODO
   */
  public async synthesize (voiceId: Polly.VoiceId, text: string, engine: Polly.Engine = "standard"): Promise<Polly.SynthesizeSpeechOutput> {
    const params: Polly.SynthesizeSpeechInput = {
      Engine: engine,
      OutputFormat: "mp3",
      Text: text,
      VoiceId: voiceId
    }
    return await this._polly.synthesizeSpeech(params).promise()
  }
}
