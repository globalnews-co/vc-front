import { NextResponse } from 'next/server';
import { getConnection, querys } from '../../../../models/index.js';

export async function GET(req) {
  try {
    const pool = await getConnection();

    const clienteEncontrado = await pool.request()
    .query(querys.getClientsView);
   
    console.log('CLIENTE ENCONTRADO ',clienteEncontrado)
    return new NextResponse(JSON.stringify(clienteEncontrado.recordset), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return new NextResponse(JSON.stringify({ error: 'Error al obtener los datos' }), { status: 500 });
  }
}
