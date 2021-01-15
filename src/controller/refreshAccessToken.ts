import { ObjectID } from 'typeorm';
import { Context } from 'koa';

import { updateTokens } from '../utils/utils';

export default async function refreshAccessToken(ctx: Context): Promise<void> {
  const userId: ObjectID = ctx.request.query.guid;
  const refreshToken: string = ctx.request.query.rt;

  if (typeof userId !== 'string' && typeof refreshToken !== 'string') {
    ctx.status = 400;
    ctx.body = {
      error: 'Refresh token not found'
    };
    return;
  }

  const newTokens = await updateTokens(ctx, userId, refreshToken);

  if (!newTokens) {
    ctx.status = 400;
    ctx.body = {
      error: 'Invalid refresh token'
    };
    return;
  }

  ctx.status = 200;
  ctx.body = newTokens;
}
