import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  NODE_ENV: string;
  JWT_SECRET: string;
}

const envSchema = joi.object({
  PORT: joi.number().required(),
  NATS_SERVERS: joi.array().items(joi.string()).required(),
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  JWT_SECRET: joi.string().required(),
})
.unknown(true);

const {error, value} = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  nodeEnv: envVars.NODE_ENV,
  jwtSecret: envVars.JWT_SECRET,
}
