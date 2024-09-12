import dotenv from 'dotenv';
import path from 'path';
import payload from 'payload';
import { InitOptions } from 'payload/config';

dotenv.config({
  path: path.resolve(__dirname, ' ../.env'),
})
console.log(process.env)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).payload

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).payload = {
    client: null,
    promise: null,
  }
}

interface Args {
  initoptions?: Partial<InitOptions>
}


export const getpayloadClient = async ({
  initoptions,
}: Args = {}) => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is missing')
  }

  if (cached.client) {
    return cached.client

  }

  if (!cached.promise) {
    cached.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initoptions?.express ? false : true,
      ... (initoptions || {}),

    })
  }

  try {
    cached.client = await cached.promise
  } catch (e: unknown) {
    cached.promise = null
    throw e

  }

  return cached.client
}
