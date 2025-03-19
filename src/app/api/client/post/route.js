import { NextResponse } from 'next/server';
import { getConnection, querys } from '../../../../models/index.js';

export async function POST(req) {
    try {
        const pool = await getConnection();
        const body = await req.json();
        const {
            NombreCliente,
            Cliente_ID, 
            Nit_Cliente,
            FechaCreacionCliente,
            Direccion,
            Telefono,
            Correo_Electronico,
            Persona_de_Contacto,
            Detalle_Especiales,
            Celular,
            Actividad,
            Pagador, 
            Ciudad,
            Tipo,
            Birthday,
        } = body;

        console.log('Request body:', body);

        const request = pool.request()
            .input('NombreCliente', NombreCliente)
            .input('Nit_Cliente', Nit_Cliente)
            .input('Direccion', Direccion)
            .input('Telefono', Telefono)
            .input('Correo_Electronico', Correo_Electronico)
            .input('Persona_de_Contacto', Persona_de_Contacto)
            .input('Detalle_Especiales', Detalle_Especiales)
            .input('Celular', Celular)
            .input('Pagador', Pagador)  
            .input('Ciudad', Ciudad)
            .input('Tipo', Tipo)
            .input('Cumpleaños', Birthday) 
            .query(querys.insertClient);

        const result = await request;

        return new NextResponse(JSON.stringify({ message: 'Data inserted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error inserting client data:', error);
        return new NextResponse(JSON.stringify({ error: 'Error inserting client data' }), { status: 500 });
    }
}
