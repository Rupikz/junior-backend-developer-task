import { ObjectID } from 'typeorm';
import { Context } from 'koa';
import { getTokens, addRefreshTokenDb } from '../utils/utils';

export default async function getAccessToken(ctx: Context): Promise<void> {
  const userId: ObjectID = ctx.request.query.guid;

  if (typeof userId !== 'string') {
    ctx.status = 400;
    ctx.body = {
      error: 'GUID not found'
    };
    return;
  }

  const tokens = getTokens(userId);
  await addRefreshTokenDb(tokens.refreshToken, userId);

  ctx.status = 200;
  ctx.body = tokens;
}
