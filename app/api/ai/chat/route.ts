import { NextResponse } from 'next/server';
import { aiService } from '@/modules/ai/rag.service';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    
    if (!question) {
      return NextResponse.json({ error: 'Falta la pregunta' }, { status: 400 });
    }

    const { answer, modelId } = await aiService.askInventoryQuestion(question);
    
    return NextResponse.json({ answer, modelId });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
