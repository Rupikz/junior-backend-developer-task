import { ObjectID } from 'typeorm';

export class AccessTokenPayload {
  user_id: ObjectID;
  payload?: string;
  type: string;
}

export class RefreshTokenPayload {
  type: string;
}

export class AccessTokenDto {
  token: string;
}

export class RefreshTokenDto {
  token: string;
}

export class GetTokenDto {
  accessToken: string;
  refreshToken: string;
}
