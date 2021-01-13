import { Context } from 'koa';

export default async function refreshAccessToken(context: Context): Promise<void> {
  console.log('refreshAccessToken');
}
