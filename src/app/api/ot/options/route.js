import { NextResponse } from 'next/server';
import { getConnection, querys } from '../../../../models/index.js';

export async function GET(req) {
  try {
    const pool = await getConnection();
    
    const tipootResult = await pool.request().query(querys.getTipoOTS);
    const actividadResult = await pool.request().query(querys.getActivity);
    const facturacionResult = await pool.request().query(querys.getFacturacion);

    const resultData = {
      tipoot: tipootResult.recordset,
      actividad: actividadResult.recordset,
      facturacion: facturacionResult.recordset,
    };

    return new NextResponse(JSON.stringify(resultData), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return new NextResponse(JSON.stringify({ error: 'Error al obtener los datos' }), { status: 500 });
  }
}
