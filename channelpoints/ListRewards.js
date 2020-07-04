'use strict'
const util = require('util')
const axios = require('axios')

const queryListRewardsById = `
query userInfo($id: ID, $lookupType: UserLookupType)                    
{
  all:user(id:$id lookupType:$lookupType){
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
        isEnabled,
        isPaused,
        isUserInputRequired,
        shouldRedemptionsSkipRequestQueue,
        title,
        prompt
      }
    }
  }
}
`

const queryListRewardsByLogin = `
query userInfo($login: String, $lookupType: UserLookupType)                    
{
  all:user(login:$login lookupType:$lookupType){
    displayName,
    login,
    id
  },
  channel(name:$login){
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
        isEnabled,
        isPaused,
        isUserInputRequired,
        shouldRedemptionsSkipRequestQueue,
        title,
        prompt
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
   */
  async handle(req, res, path, query) {
    let data
    if (query.id) {
      data = await this.gqlGetById(query.id)
    } else if (query.login) {
      data = await this.gqlGetByLogin(query.login)
    } else {
      res.write("Url parameter id or login is required.")
      res.statusCode = 400
      return
    }
    if (!data) {
      res.statusCode = 500
      return
    }

    //TODO: do stuff with GQL response
    res.write(JSON.stringify(data, null, 2))
  }

  async gqlGetById(id) {
    let config = {...configDefault}
    config.data = {
      query: queryListRewardsById,
      variables: {id: id, lookupType: "ALL"}
    }
    try {
      let response = await axios(config)
      return response.data
    } catch (e) {
      console.log(e);
      return undefined
    }
  }

  async gqlGetByLogin(login) {
    let config = {...configDefault}
    config.data = {
      query: queryListRewardsByLogin,
      variables: {login: login, lookupType: "ALL"}
    }
    try {
      let response = await axios(config)
      return response.data
    } catch (e) {
      console.log(e);
      return undefined
    }
  }
}

module.exports = ListRewards
