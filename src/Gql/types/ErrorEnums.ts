"use strict"

import {registerEnumType} from "type-graphql"

export enum RegisterTtsErrorCode {
  UNKNOWN,
  CHANNEL_DOES_NOT_EXIST,
  CHANNEL_NOT_AFFILIATE_OR_PARTNER
}

registerEnumType(RegisterTtsErrorCode, {
  name: "RegisterTtsErrorCode"
})
