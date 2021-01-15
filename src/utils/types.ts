import { ObjectID } from 'typeorm';

export class AccessTokenPayload {
  user_id: ObjectID;
  payload?: string;
  type: string;
}

export class GetTokenDto {
  accessToken: string;
  refreshToken: string;
}
