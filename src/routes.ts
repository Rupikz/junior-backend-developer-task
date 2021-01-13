import getAccessToken from './controller/getAccessToken';
import refreshAccessToken from './controller/refreshAccessToken';

export default [
  {
    path: '/access',
    method: 'get',
    action: getAccessToken
  },
  {
    path: '/refresh-access',
    method: 'get',
    action: refreshAccessToken
  }
];
