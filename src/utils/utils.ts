import { Context } from 'koa';
import * as jwt from 'jsonwebtoken';
import { ObjectID } from 'typeorm';

import { Token } from '../entity/token.entity';
import { AccessTokenPayload, GetTokenDto } from '../utils/types';
import { JWT_SECRET_KEY, JWT_TIME_AT, JWT_TIME_RT, JWT_ALGORITHM } from '../config/config';

const generateAccessToken = (data: AccessTokenPayload): string => {
  const options = { algorithm: JWT_ALGORITHM, expiresIn: JWT_TIME_AT };
  return jwt.sign(data, JWT_SECRET_KEY, options);
};

const generateRefreshToken = (): string => {
  const data = {
    type: 'refresh'
  };
  const options = { algorithm: JWT_ALGORITHM, expiresIn: JWT_TIME_RT };

  return jwt.sign(data, JWT_SECRET_KEY, options);
};

export const addRefreshTokenDb = async (token: string, userId: ObjectID): Promise<void> => {
  // const btoken = await bcrypt.hash(token, SALT_ROUNDS);

  const tokenInstance = new Token();
  tokenInstance['user_id'] = userId;
  tokenInstance['token'] = token;
  await tokenInstance.save();
};

export const getTokens = (userId: ObjectID): GetTokenDto => {
  const accessToken = generateAccessToken({ user_id: userId, type: 'access' });
  const refreshToken = generateRefreshToken();

  return {
    accessToken,
    refreshToken
  };
};

export const updateTokens = async (ctx: Context, userId: ObjectID, refreshToken: string): Promise<GetTokenDto> => {
  const parseRefreshToken = await jwt.verify(refreshToken, JWT_SECRET_KEY);

  if (parseRefreshToken.type !== 'refresh') {
    ctx.status = 400;
    ctx.body = {
      error: 'Wrong type token'
    };
    return;
  }

  const { token: btoken, _id: oldTokenId } = await Token.findOne({
    where: {
      user_id: userId
    }
  });

  if (!btoken) {
    ctx.status = 400;
    ctx.body = {
      error: 'Old refresh token not find'
    };
    return;
  }

  // const checkedToken = await bcrypt.compare(refreshToken, btoken);

  const checkedToken = refreshToken === btoken;

  if (!checkedToken) {
    ctx.status = 400;
    ctx.body = {
      error: 'Invalid refresh token'
    };
    return;
  }

  const newTokens = getTokens(userId);

  await Token.delete(oldTokenId);
  await addRefreshTokenDb(newTokens.refreshToken, userId);

  return newTokens;
};
