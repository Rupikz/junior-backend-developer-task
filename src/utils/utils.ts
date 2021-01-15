import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { getMongoRepository, ObjectID } from 'typeorm';

import { Token } from '../entity/token.entity';
import { AccessTokenPayload, RefreshTokenDto, GetTokenDto } from '../utils/types';
import { JWT_SECRET_KEY, JWT_TIME_AT, JWT_TIME_RT, JWT_ALGORITHM, SALT_ROUNDS } from '../config/config';

const generateAccessToken = (data: AccessTokenPayload): string => {
  const options = { algorithm: JWT_ALGORITHM, expiresIn: JWT_TIME_AT };
  return jwt.sign(data, JWT_SECRET_KEY, options);
};

const generateRefreshToken = (): RefreshTokenDto => {
  const data = {
    id: uuidv4(),
    type: 'refresh'
  };

  const options = { algorithm: JWT_ALGORITHM, expiresIn: JWT_TIME_RT };

  return {
    id: data.id,
    token: jwt.sign(data, JWT_SECRET_KEY, options)
  };
};

export const replaceRefreshTokenDb = async (tokenId: string, userId: ObjectID): Promise<void> => {
  await getMongoRepository(Token)
    .findOneAndDelete({
      where: {
        user_id: userId
      }
    })
    .then(() => Token.create({ token_id: tokenId, user_id: userId }));
};

export const addRefreshTokenDb = async (token: RefreshTokenDto, userId: ObjectID): Promise<void> => {
  const btoken = await bcrypt.hash(token.token, SALT_ROUNDS);

  const tokenInstance = new Token();
  tokenInstance['user_id'] = userId;
  tokenInstance['token_id'] = token.id;
  tokenInstance['token'] = btoken;
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

export const updateTokens = async (userId: ObjectID): Promise<GetTokenDto> => {
  const tokens = getTokens(userId);
  await replaceRefreshTokenDb(tokens.refreshToken.id, userId);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  };
};
