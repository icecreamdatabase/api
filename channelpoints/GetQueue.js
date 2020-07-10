'use strict'
const util = require('util')
const axios = require('axios')

const queryGetQueueById = `
query userInfo($id: ID)                    
{
  all:user(id:$id lookupType:ALL){
    displayName,
    login,
    id
  },
  channel(id:$id){
    communityPointsRedemptionQueue(options:{status: UNFULFILLED}) {
      edges {
        cursor,
        node {
          id,
          input,
          rewardID,
          rewardTitle,
          status,
          timestamp,
          user {
            displayName,
            login,
            id
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
}
`
const configDefault = {
  method: 'post',
  url: 'https://gql.twitch.tv/gql',
  headers: {
    'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
    'Content-Type': 'application/json'
  }
};

class GetQueue {
  constructor() {
  }

  /**
   *
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {string[]} path
   * @param {Object.<string, string>} query
   * @return {any}
   */
  async handle(req, res, path, query) {
    let data
    if (query.id && query.Authorization) {
      data = await this.gqlGetById(query.id, query.Authorization)
    } else {
      data = this.getDefaultResponse()
      res.statusCode = 400
      return data
    }
    if (!data) {
      res.statusCode = 500
      return
    }

    //TODO: do stuff with GQL response
    return data
  }

  async gqlGetById(id, auth) {
    let config = {...configDefault}
    config.data = {
      query: queryGetQueueById,
      variables: {id: id}
    }
    config.headers["Authorization"] = auth
    try {
      let response = await axios(config)
      return response.data
    } catch (e) {
      console.log(e);
      return undefined
    }
  }

  getDefaultResponse() {
    return {
      "requireParameter": ["id", "Authorization"],
      "optimalParameter": ["cursor"]
    }
  }
}

module.exports = GetQueue
