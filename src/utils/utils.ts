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

const getTokens = (userId: ObjectID): GetTokenDto => {
  const accessToken = generateAccessToken({ user_id: userId, type: 'access' });
  const refreshToken = generateRefreshToken();

  return {
    accessToken,
    refreshToken
  };
};

const addRefreshTokenDb = async (token: string, userId: ObjectID): Promise<void> => {
  const tokenInstance = new Token();
  tokenInstance['user_id'] = userId;
  tokenInstance['token'] = token;
  await tokenInstance.save();
};

const updateTokenDb = async (tokenId: ObjectID, userId: ObjectID): Promise<GetTokenDto> => {
  const tokens = getTokens(userId);
  await Token.delete(tokenId);
  await addRefreshTokenDb(tokens.refreshToken, userId);

  return tokens;
};

const findTokenDb = async (userId): Promise<Token> => {
  return await Token.findOne({
    where: {
      user_id: userId
    }
  });
};

export const addNewTokensDb = async (userId: ObjectID): Promise<GetTokenDto> => {
  const oldToken = await findTokenDb(userId);

  if (oldToken) {
    return await updateTokenDb(oldToken._id, userId);
  }

  const tokens = getTokens(userId);
  await addRefreshTokenDb(tokens.refreshToken, userId);

  return tokens;
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

  const oldToken = await findTokenDb(userId);

  if (!oldToken) {
    ctx.status = 400;
    ctx.body = {
      error: 'Old refresh token not find'
    };
    return;
  }

  // const checkedToken = await bcrypt.compare(refreshToken, btoken);

  console.log(refreshToken, oldToken.token, refreshToken === oldToken.token);

  if (refreshToken !== oldToken.token) {
    ctx.status = 400;
    ctx.body = {
      error: 'Invalid refresh token'
    };
    return;
  }

  const newTokens = await updateTokenDb(oldToken._id, userId);

  return newTokens;
};
