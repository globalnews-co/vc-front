import { NextResponse } from 'next/server';
import { getConnection, querys } from '../../../../models/index.js';
export async function POST(req) {
    try {
        const pool = await getConnection();
        const body = await req.json();
        console.log('Received body:', body);

        const {
            NombreCliente,
            Cliente_ID,
            Nombre_Anunciante,
            Tipo_Ot,
            Cobertura,
            Correos_Alertas,
            Numeros_Whatsapp,
            Correos_Boletines,
            Director_Comercial,
            Servicio_Al_Cliente,
            Comentarios_Detalle,
            Total_Valor,
            Vigencia_Desde,
            Vigencia_Hasta,
            Total_Dias,
            Total_Valor_Dias,
            Numero_Ot,
            Usuarios,
            Correccion,
            Analisis,
            Marca,
            Competencias,
            Entorno,
            Sectores,
            Categoria,
            Servicios_Contratados,
            Actividad,
            Facturacion,
        } = body;

        // Limpiar valores numéricos
        const Valor_Impresos = cleanNumericValue(body.Valor_Impresos || body['VALOR IMPRESOS'] || 0);
        const Valor_Radio = cleanNumericValue(body.Valor_Radio || body['VALOR RADIO'] || 0);
        const Valor_Television = cleanNumericValue(body.Valor_Television || body['VALOR TELEVISION'] || 0);
        const Valor_Internet = cleanNumericValue(body.Valor_Internet || body['VALOR INTERNET'] || 0);
        const Valor_Analisis = cleanNumericValue(body.Valor_Analisis || body['VALOR ANALISIS'] || 0);
        const Valor_Social = cleanNumericValue(body.Valor_Social || body['VALOR SOCIAL'] || 0);
        const TotalValorFinal = cleanNumericValue(Total_Valor || 0);
        const TotalValorDiasFinal = cleanNumericValue(Total_Valor_Dias || 0);

        console.log('Processed Values:', {
            Valor_Impresos,
            Valor_Radio,
            Valor_Television,
            Valor_Internet,
            Valor_Analisis,
            Valor_Social,
        });

        if (!NombreCliente || !Nombre_Anunciante || !Tipo_Ot || !Cobertura) {
            console.log('Missing required fields:', {
                NombreCliente,
                Nombre_Anunciante,
                Tipo_Ot,
                Cobertura,
            });
            return new NextResponse(JSON.stringify({ error: 'Required fields are missing' }), { status: 400 });
        }

        const request = pool.request()
            .input('NIT_Cliente', Cliente_ID)
            .input('NombreCliente', NombreCliente)
            .input('Nombre_Anunciante', Nombre_Anunciante)
            .input('Tipo_Ot', Tipo_Ot)
            .input('Cobertura', Cobertura)
            .input('Correos_Alertas', Correos_Alertas || '')
            .input('Numeros_Whatsapp', Numeros_Whatsapp || '')
            .input('Correos_Boletines', Correos_Boletines || '')
            .input('Director_Comercial', Director_Comercial || '')
            .input('Servicio_Al_Cliente', Servicio_Al_Cliente || '')
            .input('Comentarios_Detalle', Comentarios_Detalle || '')
            .input('Valor_Impresos', Valor_Impresos)
            .input('Valor_Radio', Valor_Radio)
            .input('Valor_Television', Valor_Television)
            .input('Valor_Internet', Valor_Internet)
            .input('Valor_Analisis', Valor_Analisis)
            .input('Valor_Social', Valor_Social)
            .input('Total_Valor', TotalValorFinal)
            .input('Vigencia_Desde', Vigencia_Desde || null)
            .input('Vigencia_Hasta', Vigencia_Hasta || null)
            .input('Total_Dias', Total_Dias || 0)
            .input('Total_Valor_Dias', TotalValorDiasFinal)
            .input('Numero_Ot', Numero_Ot || '')
            .input('Usuarios', Usuarios || '')
            .input('Correccion', Correccion || '')
            .input('Marca', Marca || '')
            .input('Competencias', Competencias || '')
            .input('Entorno', Entorno || '')
            .input('Sectores', Sectores || '')
            .input('Categoria', Categoria || '')
            .input('Servicios_Contratados', Servicios_Contratados || '')
            .input('Actividad', Actividad || '')
            .input('Facturacion', Facturacion || '')
            .input('Analisis', Analisis)
            .query(querys.insertOrder);

        const result = await request;
        const insertedId = result.recordset[0]['orden de trabajo'];

        return new NextResponse(JSON.stringify({ message: 'Data inserted successfully', insertedId }), { status: 200 });
    } catch (error) {
        console.error('Error al insertar los datos:', error);
        return new NextResponse(JSON.stringify({ error: 'Error al insertar los datos' }), { status: 500 });
    }
}

const cleanNumericValue = (value) => {
    if (typeof value === 'string') {
        // Remueve los puntos y convierte a número
        return Number(value.replace(/\./g, ''));
    }
    return value;
};
