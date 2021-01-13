import { getManager } from 'typeorm';
import { Token } from '../entity/token.entity';
import { Context } from 'koa';

export default async function getAccessToken(ctx: Context): Promise<void> {
  const token = new Token();
  token.token = 'test';
  token.createdAt = new Date();
  await token.save();

  const result = await getManager().find(Token);
  console.log(result);
}
