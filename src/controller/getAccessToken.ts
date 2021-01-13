import * as Koa from 'koa';

export default async function getAccessToken(context: Koa.Context): Promise<void> {
  console.log('getAccessToken');
}
