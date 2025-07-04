import OpenAI from 'openai';

export async function callOpenAI(messages, apiKey, model = 'gpt-4o') {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  const chat = await openai.chat.completions.create({
    model,
    messages
  });
  return chat.choices[0].message.content;
}
