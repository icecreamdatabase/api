"use strict"
import {NextFunction, Request, Response} from "express"
import {BasicBucket} from "./BasicBucket"
import {HttpException} from "../helper/HttpException"


export class RateLimit {
  //TODO: find good values for that
  private static readonly globalLimit = 1000
  private static readonly globalRefresh = 30
  private static readonly userLimit = 20
  private static readonly userRefresh = 30
  private static readonly retryAfter = 2

  private static readonly _globalBucket: BasicBucket = new BasicBucket(RateLimit.globalLimit, RateLimit.globalRefresh)
  private static readonly _bucketMap: Map<string, BasicBucket> = new Map<string, BasicBucket>()

  private constructor () {
  }

  public static async handle (req: Request, res: Response, next: NextFunction) {
    try {
      await RateLimit.check(req, res)
      next()
    } catch (e) {
      next(e)
    }
  }

  public static async check (req: Request, res: Response): Promise<void> {
    res.setHeader("RateLimit-Limit", `${this._globalBucket.limit} ${this._globalBucket.limit};window=${this._globalBucket.returnTimeoutS}`)
    res.setHeader("RateLimit-Remaining", this._globalBucket.ticketsRemaining)
    if (!this._globalBucket.takeTicket()) {
      res.setHeader("Retry-After", RateLimit.retryAfter)
      throw new HttpException(429, "Global rate limit exceeded")
    }

    if (req.oAuthData) {
      let bucket = this._bucketMap.get(req.oAuthData.user_id)
      if (!bucket) {
        bucket = new BasicBucket(RateLimit.userLimit, RateLimit.userRefresh)
        RateLimit._bucketMap.set(req.oAuthData.user_id, bucket)
      }

      // Display data about the bucket with less tickets remaining
      if (bucket.ticketsRemaining < this._globalBucket.ticketsRemaining) {
        res.setHeader("RateLimit-Limit", `${bucket.limit} ${bucket.limit};window=${bucket.returnTimeoutS}`)
        res.setHeader("RateLimit-Remaining", bucket.ticketsRemaining)
      }
      if (!bucket.takeTicket()) {
        res.setHeader("Retry-After", RateLimit.retryAfter)
        throw new HttpException(429, "User specific rate limit exceeded")
      }
    }
  }
}

