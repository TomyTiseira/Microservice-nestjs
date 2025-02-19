import 'dotenv/config';
import * as joi from 'joi';

interface envsVars {
  PORT: number;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  NATS_SERVERS: string[];
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  STRIPE_SECRET_KEY: joi.string().required(),
  STRIPE_WEBHOOK_SECRET: joi.string().required(),
  STRIPE_SUCCESS_URL: joi.string().required(),
  STRIPE_CANCEL_URL: joi.string().required(),
  NATS_SERVERS: joi.array().items(joi.string()).required(),
}).unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envsVars: envsVars = value;

export const envs = {
  port: envsVars.PORT,
  stripeSecretKey: envsVars.STRIPE_SECRET_KEY,
  stripeWebhookSecret: envsVars.STRIPE_WEBHOOK_SECRET,
  stripeSuccessUrl: envsVars.STRIPE_SUCCESS_URL,
  stripeCancelUrl: envsVars.STRIPE_CANCEL_URL,
  natsServers: envsVars.NATS_SERVERS,
};