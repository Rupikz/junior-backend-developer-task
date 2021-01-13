import * as Koa from 'koa';

export default async function refreshAccessToken(context: Koa.Context): Promise<void> {
  console.log('refreshAccessToken');
}
