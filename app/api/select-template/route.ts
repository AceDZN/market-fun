import { NextResponse } from 'next/server';
import { selectBestTemplates } from '@/lib/ai/template-selector';

export async function POST(req: Request) {
  try {
    const funnelData = await req.json();
    const templates = await selectBestTemplates(funnelData);
    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error selecting templates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}