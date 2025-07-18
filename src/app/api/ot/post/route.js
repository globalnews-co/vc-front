import { NextResponse } from 'next/server';
import { getConnection, querys } from '../../../../models/index.js';

export async function POST(req) {
    try {
        const pool = await getConnection();
        const body = await req.json();
        console.log('📤 Received body for OT creation:', body);

        const {
            NombreCliente,
            Cliente_ID,
            Nombre_Anunciante,
            Tipo_Ot,
            Cobertura,
            COBERTURA,
            Observaciones_Cobertura,
            OBSERVACIONES_COBERTURA,
            ObservacionesCobertura,
            DETALLE_COBERTURA_INTER,
            NACIONAL,
            Correos_Alertas,
            Correos_Boletines,
            CONTACTOS_ALERTAS,
            CONTACTOS_BOLETINES,
            Numeros_Whatsapp,
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

        // ✨ PROCESAR COBERTURA
        const coberturaFinal = Cobertura || COBERTURA || '';
        const esNacional = coberturaFinal === 'Nacional' || NACIONAL === 'X';
        const esInternacional = coberturaFinal === 'Internacional' || body['COBERTURA INTERNACIONAL'] === 'X';

        // ✨ PROCESAR OBSERVACIONES DE COBERTURA
        const observacionesCobertura = (() => {
            const observaciones = Observaciones_Cobertura || 
                                OBSERVACIONES_COBERTURA || 
                                ObservacionesCobertura || 
                                body['Observaciones_Cobertura'] || 
                                body['OBSERVACIONES_COBERTURA'] || 
                                '';
            
            if (!observaciones) return '';
            
            const cleaned = String(observaciones).trim();
            
            if (cleaned.length > 500) {
                console.warn('⚠️ Observaciones de cobertura exceden 500 caracteres, truncando...');
                return cleaned.substring(0, 500);
            }
            
            return cleaned;
        })();

        // ✨ PROCESAR DETALLE DE COBERTURA INTERNACIONAL
        const detalleCobertura = DETALLE_COBERTURA_INTER || '';

        console.log('🌍 Procesando cobertura:', {
            cobertura: coberturaFinal,
            esNacional,
            esInternacional,
            observaciones: observacionesCobertura,
            detalleInternacional: detalleCobertura
        });

        // 🔧 PROCESAR CORREOS Y CONTACTOS DE ALERTAS
        const procesarContactosAlertas = () => {
            // Separar correos y números WhatsApp
            let correos = [];
            let numerosWhatsApp = [];
            
            // Si hay contactos estructurados, procesarlos
            if (CONTACTOS_ALERTAS) {
                try {
                    const contactos = typeof CONTACTOS_ALERTAS === 'string' 
                        ? JSON.parse(CONTACTOS_ALERTAS) 
                        : CONTACTOS_ALERTAS;
                    
                    contactos.forEach(contacto => {
                        if (contacto.correo && contacto.correo.trim()) {
                            const valor = contacto.correo.trim();
                            // Detectar si es email o número WhatsApp
                            if (valor.includes('@')) {
                                correos.push(valor);
                            } else {
                                numerosWhatsApp.push(valor);
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error parsing CONTACTOS_ALERTAS:', error);
                }
            }
            
            // Si hay string de correos, usarlo como fallback
            if (Correos_Alertas && (!correos.length && !numerosWhatsApp.length)) {
                const items = Correos_Alertas.split(',').map(item => item.trim());
                items.forEach(item => {
                    if (item.includes('@')) {
                        correos.push(item);
                    } else {
                        numerosWhatsApp.push(item);
                    }
                });
            }
            
            return {
                correos: correos.join(', '),
                whatsapp: numerosWhatsApp.join(', ')
            };
        };

        // 🔧 PROCESAR CORREOS DE BOLETINES
        const procesarCorreosBoletines = () => {
            let correos = [];
            
            // Si hay contactos estructurados, procesarlos
            if (CONTACTOS_BOLETINES) {
                try {
                    const contactos = typeof CONTACTOS_BOLETINES === 'string' 
                        ? JSON.parse(CONTACTOS_BOLETINES) 
                        : CONTACTOS_BOLETINES;
                    
                    contactos.forEach(contacto => {
                        if (contacto.correo && contacto.correo.trim()) {
                            correos.push(contacto.correo.trim());
                        }
                    });
                } catch (error) {
                    console.error('Error parsing CONTACTOS_BOLETINES:', error);
                }
            }
            
            // Si hay string de correos, usarlo como fallback
            if (Correos_Boletines && !correos.length) {
                correos = Correos_Boletines.split(',').map(item => item.trim());
            }
            
            return correos.join(', ');
        };

        const alertasData = procesarContactosAlertas();
        const boletinesData = procesarCorreosBoletines();

        console.log('📧 Datos de contactos procesados:', {
            alertas: alertasData,
            boletines: boletinesData
        });

        // Limpiar valores numéricos
        const Valor_Impresos = cleanNumericValue(body.Valor_Impresos || body['VALOR IMPRESOS'] || 0);
        const Valor_Radio = cleanNumericValue(body.Valor_Radio || body['VALOR RADIO'] || 0);
        const Valor_Television = cleanNumericValue(body.Valor_Television || body['VALOR TELEVISION'] || 0);
        const Valor_Internet = cleanNumericValue(body.Valor_Internet || body['VALOR INTERNET'] || 0);
        const Valor_Analisis = cleanNumericValue(body.Valor_Analisis || body['VALOR ANALISIS'] || 0);
        const Valor_Social = cleanNumericValue(body.Valor_Social || body['VALOR SOCIAL'] || 0);
        const TotalValorFinal = cleanNumericValue(Total_Valor || 0);
        const TotalValorDiasFinal = cleanNumericValue(Total_Valor_Dias || 0);

        console.log('💰 Processed Values:', {
            Valor_Impresos,
            Valor_Radio,
            Valor_Television,
            Valor_Internet,
            Valor_Analisis,
            Valor_Social,
        });

        // Validación de campos requeridos
        if (!NombreCliente || !Nombre_Anunciante || !Tipo_Ot || !coberturaFinal) {
            console.log('❌ Missing required fields:', {
                NombreCliente,
                Nombre_Anunciante,
                Tipo_Ot,
                Cobertura: coberturaFinal,
            });
            return new NextResponse(JSON.stringify({ error: 'Required fields are missing' }), { status: 400 });
        }

        // 🔧 VALIDAR CORREOS REQUERIDOS
        if (!alertasData.correos && !alertasData.whatsapp) {
            console.log('❌ Missing alertas contacts');
            return new NextResponse(JSON.stringify({ error: 'Se requieren correos o números WhatsApp para alertas' }), { status: 400 });
        }

        if (!boletinesData) {
            console.log('❌ Missing boletines emails');
            return new NextResponse(JSON.stringify({ error: 'Se requieren correos para boletines' }), { status: 400 });
        }

        // ✨ PREPARAR REQUEST CON CAMPOS CORRECTOS DE LA BASE DE DATOS
        const request = pool.request()
            .input('NIT_Cliente', Cliente_ID)
            .input('NombreCliente', NombreCliente)
            .input('Nombre_Anunciante', Nombre_Anunciante)
            .input('Tipo_Ot', Tipo_Ot)
            .input('Cobertura', coberturaFinal)
            .input('NACIONAL', esNacional ? 1 : 0)
            .input('COBERTURA_INTERNACIONAL', esInternacional ? 1 : 0)
            .input('DETALLE_COBERTURA_INTER', detalleCobertura)
            .input('Observaciones_Cobertura', observacionesCobertura)
            // 🔧 CAMPOS CORRECTOS SEGÚN LA TABLA
            .input('ALERTAS_CORREOS', alertasData.correos)
            .input('WHATSAPP', alertasData.whatsapp)
            .input('NEWSLETERS_CORREOS', boletinesData)
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
            .input('Analisis', Analisis || '')
            .query(querys.insertOrder);

        const result = await request;
        const insertedId = result.recordset[0]['orden de trabajo'];

        console.log('✅ OT creada exitosamente:', {
            id: insertedId,
            cliente: NombreCliente,
            cobertura: coberturaFinal,
            esNacional,
            esInternacional,
            tieneObservacionesCobertura: !!observacionesCobertura,
            longitudObservaciones: observacionesCobertura.length,
            detalleInternacional: detalleCobertura,
            alertasCorreos: alertasData.correos,
            whatsapp: alertasData.whatsapp,
            boletines: boletinesData
        });

        const responseData = {
            message: 'Data inserted successfully',
            insertedId,
            summary: {
                cliente: NombreCliente,
                cobertura: coberturaFinal,
                esNacional,
                esInternacional,
                observacionesCobertura: {
                    incluidas: !!observacionesCobertura,
                    longitud: observacionesCobertura.length
                },
                detalleInternacional: {
                    incluido: !!detalleCobertura,
                    longitud: detalleCobertura.length
                },
                contactos: {
                    alertasCorreos: alertasData.correos,
                    whatsapp: alertasData.whatsapp,
                    boletines: boletinesData
                },
                valorTotal: TotalValorFinal
            }
        };

        return new NextResponse(JSON.stringify(responseData), { status: 200 });

    } catch (error) {
        console.error('❌ Error al insertar los datos:', error);
        
        const errorResponse = {
            error: 'Error al insertar los datos',
            details: error.message,
            timestamp: new Date().toISOString()
        };
        
        return new NextResponse(JSON.stringify(errorResponse), { status: 500 });
    }
}

// Función para limpiar valores numéricos
const cleanNumericValue = (value) => {
    if (typeof value === 'string') {
        return Number(value.replace(/\./g, ''));
    }
    return value;
};

// Función para validar observaciones de cobertura
const validateCoverageObservations = (observations) => {
    if (!observations) return { valid: true, cleaned: '' };
    
    const cleaned = String(observations).trim();
    
    if (cleaned.length > 500) {
        return {
            valid: false,
            cleaned: cleaned.substring(0, 500),
            warning: `Observaciones truncadas de ${cleaned.length} a 500 caracteres`
        };
    }
    
    return { valid: true, cleaned };
};