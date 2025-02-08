import { MatchersV3 } from '@pact-foundation/pact'
import { Permission } from '@neko/permissions'

import { LoginDto, LoginResponseDto, RegisterDto } from '@core/dto'
import { PactMatcher } from 'contract-tests/types'

const { extractPayload, eachLike, string, uuid } = MatchersV3

export const loginDto: PactMatcher<LoginDto> = {
  email: string('test@test.com'),
  password: string('password'),
}

export const loginSuccessResponseBody: PactMatcher<LoginResponseDto> = {
  user: {
    id: uuid('e2490de5-5bd3-43d5-b7c4-526e33f71304'),
    username: string('test'),
  },
  permissions: eachLike(string(), 1) as unknown as Permission[],
}

export const loginSuccess = extractPayload(loginSuccessResponseBody)

export const registerDto: PactMatcher<RegisterDto> = {
  username: string('username'),
  email: string('test@test.com'),
  password: string('password'),
}

export const registerSuccessResponseBody = loginSuccessResponseBody
export const registerSuccess = extractPayload(registerSuccessResponseBody)
