import {Channel} from "./Channel"
import {NewChannelInput} from "./NewChannelInput"

export class ChannelService {
  async findById (id: string) {
    const ch = new Channel()
    ch.id = id
    ch.name = `${id}xD`
    return ch
  }

  async addNew (param: { data: NewChannelInput }) {
    const ch = new Channel()
    ch.id = param.data.id
    ch.name = `${param.data.id}xd`
    return ch
  }

  async removeById (id: string) {
    if (Math.random() > 0.5) {
      throw new Error("")
    }
  }
}
