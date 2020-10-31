"use strict"

import {SqlVoices} from "../../sql/tts/SqlVoices"

export interface ITtsArrayItem {
  voice: string
  message: string
  playbackRate: number
}

export class MessageSplitter {
  private static regExpTtsArray: RegExp = new RegExp(/(\w+)(?:\(x?(\d*\.?\d*)\))?:/)
  private static minPlaybackRate = 0.1
  private static maxPlaybackRate = 10.0
  private static randomVoiceKeywordName = "random"

  constructor () {
  }

  /**
   * Get voice ID by voice name.
   * Voice ID can be the same as voice name.
   */
  static async getVoiceID (lookupKey: string): Promise<string | undefined> {
    lookupKey = lookupKey.trim().toLowerCase()

    let voice = (await SqlVoices.getVoiceVoicesName()).get(lookupKey)
    if (!voice) voice = (await SqlVoices.getVoiceVoicesId()).get(lookupKey)

    if (!voice) return undefined
    return voice.voicesId
  }


  /**
   * Split the message like the forsen TTS syntax:
   * Brian: message 1 Justin: message 2 Brian: message 3
   */
  static async createTTSArray (message: string,
                               useCase = false,
                               defaultVoice = "",
                               allowCustomPlaybackRate = false,
                               defaultPlaybackRate = 1.0
  ): Promise<ITtsArrayItem[]> {
    let output: ITtsArrayItem[] = [{voice: defaultVoice, message: "", playbackRate: defaultPlaybackRate}]
    let outputIndex = 0
    for (let word of message.split(" ")) {
      let newVoiceStart = false
      if (word.endsWith(":")) {
        let match: RegExpMatchArray | null = word.match(MessageSplitter.regExpTtsArray)
        if (match && match[1]) {
          let voice: string | undefined
          if (match[1].toLowerCase() === this.randomVoiceKeywordName)
            voice = (await SqlVoices.getRandomVoice()).voicesId
          if (!voice)
            voice = await this.getVoiceID(match[1])
          if (voice) {
            let playbackRate = parseFloat(match[2]) || defaultPlaybackRate
            playbackRate = Math.min(MessageSplitter.maxPlaybackRate, Math.max(MessageSplitter.minPlaybackRate, playbackRate))
            output[++outputIndex] = {
              voice: voice,
              message: "",
              playbackRate: allowCustomPlaybackRate ? playbackRate : defaultPlaybackRate
            }
            newVoiceStart = true
          }
        }
      }
      if (!newVoiceStart) {
        output[outputIndex]["message"] += " " + word
      }
    }
    output.map(x => {
      x.message = x.message.trim()
    })
    return output.filter(x => x.message)
  }
}
