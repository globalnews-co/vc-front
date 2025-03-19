import { NextResponse } from 'next/server';
import { getConnection, querys } from '../../../../models/index.js';

export async function GET(req) {
  try {
    const pool = await getConnection();
    
    const result = await pool.request().query(querys.getClients);

    return new NextResponse(JSON.stringify(result.recordset), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return new NextResponse(JSON.stringify({ error: 'Error al obtener los datos' }), { status: 500 });
  }
}
