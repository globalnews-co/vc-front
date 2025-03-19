import { NextResponse } from 'next/server';
import { getConnection, querys } from '../../../../models/index.js';

export async function PUT(req) {
  try {
    const pool = await getConnection();
    const body = await req.json();
    const { id, firmaComercial, firmaServicioCliente, firmaOperaciones } = body;

    if (firmaComercial !== undefined) {
      await pool.request()
        .input('id', id)
        .input('firmaComercial', firmaComercial)
        .query(querys.updateOrdenFirmaComercial);
    } else if (firmaServicioCliente !== undefined) {
      await pool.request()
        .input('id', id)
        .input('firmaServicioCliente', firmaServicioCliente)
        .query(querys.updateOrdenFirmaServicioCliente);
    } else if (firmaOperaciones !== undefined) {
      await pool.request()
        .input('id', id)
        .input('firmaOperaciones', firmaOperaciones)
        .query(querys.updateOrdenFirmaOperaciones);
    }

    return new NextResponse(JSON.stringify({ message: 'Orden actualizada con éxito' }), { status: 200 });
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    return new NextResponse(JSON.stringify({ error: 'Error al actualizar la orden' }), { status: 500 });
  }
}
