import { NextResponse } from 'next/server';
import { getConnection, querys } from '../../../../models/index.js';

export async function POST(req) {
  try {
    const pool = await getConnection();
    const body = await req.json();


    const ordenEncontrada = await pool.request()
      .input("ordenid", body.ot)  
      .query(querys.getOrdenT);

    return new NextResponse(JSON.stringify(ordenEncontrada.recordset), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return new NextResponse(JSON.stringify({ error: 'Error al obtener los datos' }), { status: 500 });
  }
}
