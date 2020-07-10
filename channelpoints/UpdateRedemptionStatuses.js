'use strict'
const util = require('util')
const axios = require('axios')

const queryGetQueueById = `
mutation userInfo($id: ID!, $newStatus: CommunityPointsCustomRewardRedemptionStatus!, $redemptionIDs: [ID!]!)       
{
  updateCommunityPointsCustomRewardRedemptionStatusesByRedemptions(input:{channelID:$id, newStatus: $newStatus, oldStatus: UNFULFILLED, redemptionIDs: $redemptionIDs}) {
    error {
      code
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
    if (query.id && query.redemptionIDs && query.Authorization) {
      // noinspection JSUnresolvedVariable
      data = await this.gqlGetById(query.id, query.redemptionIDs, query.Authorization, query.oldStatus, query.newStatus)
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

  async gqlGetById(id, redemptionIDs, auth, oldStatus = "UNFULFILLED", newStatus = "FULFILLED") {
    let config = {...configDefault}
    config.data = {
      query: queryGetQueueById,
      variables: {id, redemptionIDs: redemptionIDs.split(','), oldStatus, newStatus}
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
      "requireParameter": ["id", "redemptionIDs", "Authorization"],
      "optimalParameter": ["oldStatus", "newStatus"]
    }
  }

}

module.exports = GetQueue
