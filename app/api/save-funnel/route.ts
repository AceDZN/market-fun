import { NextResponse } from 'next/server';
import { FunnelData } from '@/lib/types/funnel';

export async function POST(req: Request) {
  try {
    const funnelData: FunnelData = await req.json();
    
    // Here, you would typically save the data to a database
    // For now, we'll just log it and return a success response
    console.log('Received funnel data:', funnelData);

    // TODO: Add database logic here

    return NextResponse.json({ success: true, message: 'Funnel saved successfully' });
  } catch (error) {
    console.error('Error saving funnel:', error);
    return NextResponse.json({ success: false, message: 'Error saving funnel' }, { status: 500 });
  }
}