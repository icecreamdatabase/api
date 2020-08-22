import {IApiResponse} from "../Gql/Gql"

export class HttpException extends Error implements IApiResponse {
  status: number
  message: string
  data: any

  constructor (status: number, message: string, data?: any) {
    super(message)
    this.status = status
    this.message = message
    this.data = data
  }

  public getJson (): IApiResponse {
    return {status: this.status, message: this.message, data: this.data}
  }
}
