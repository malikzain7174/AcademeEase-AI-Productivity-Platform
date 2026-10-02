import OpenAI from 'openai';

const openaiClientSingleton = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
  });
};

declare const globalThis: {
  openaiGlobal: ReturnType<typeof openaiClientSingleton>;
} & typeof global;

const openai = globalThis.openaiGlobal ?? openaiClientSingleton();

export default openai;

if (process.env.NODE_ENV !== 'production') globalThis.openaiGlobal = openai;
