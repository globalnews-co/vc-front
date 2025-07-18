// src/api/test/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  return new NextResponse(JSON.stringify({ message: 'Ruta de prueba funcionando' }), { status: 200 });
}
