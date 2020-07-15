'use strict'
const util = require('util')
const axios = require('axios')

const queryListRewardsById = `
query userInfo($id: ID)                    
{
  all:user(id:$id lookupType:ALL){
    displayName,
    login,
    id
  },
  channel(id:$id){
    communityPointsSettings{
      name,
      image {
        url,
        url2x,
        url4x
      },
      customRewards{
        id,
        cost,
        title,
        prompt,
        defaultImage {
          url,
          url2x,
          url4x
        },
        backgroundColor,
        isEnabled,
        isPaused,
        isSubOnly,
        isUserInputRequired,
        shouldRedemptionsSkipRequestQueue,
        maxPerStreamSetting {
          isEnabled,
          maxPerStream
        },
        templateID,
        updatedForIndicatorAt
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

class ListRewards {
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
    if (query.id) {
      data = await this.gqlGetById(query.id)
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

  async gqlGetById(id) {
    let config = {...configDefault}
    config.data = {
      query: queryListRewardsById,
      variables: {id: id}
    }
    try {
      let response = await axios(config)
      return response.data.data
    } catch (e) {
      console.log(e);
      return undefined
    }
  }

  getDefaultResponse() {
    return {
      "requireParameter": ["id"],
      "optimalParameter": []
    }
  }
}

module.exports = ListRewards
