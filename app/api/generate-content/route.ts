import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { pageType, marketingDetails } = await req.json();

    const prompt = `Generate content for a ${pageType} page in a marketing funnel. 
    Target audience: ${marketingDetails.targetAudience}
    Product description: ${marketingDetails.productDescription}
    Goals: ${marketingDetails.goals.join(', ')}
    
    Provide a JSON object with the following structure:
    {
      "title": "Page title",
      "description": "Main content or description",
      "cta": "Call to action text"
    }`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = JSON.parse(completion.data.choices[0].message?.content || '{}');

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}