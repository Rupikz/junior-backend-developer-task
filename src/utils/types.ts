import { ObjectID } from 'typeorm';

export class AccessTokenPayload {
  user_id: ObjectID;
  payload?: string;
  type: string;
}

export class RefreshTokenPayload {
  id: ObjectID;
  type: string;
}

export class AccessTokenDto {
  token: string;
}

export class RefreshTokenDto {
  id: string;
  token: string;
}

export class GetTokenDto {
  accessToken: string;
  refreshToken: RefreshTokenDto;
}
