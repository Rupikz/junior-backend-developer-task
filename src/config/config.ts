import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret';
export const JWT_TIME_AT = process.env.JWT_TIME || '1h';
export const JWT_TIME_RT = process.env.JWT_TIME || '1d';
export const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS512';
