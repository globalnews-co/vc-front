'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import Bar from '../../components/Bar';
import { getOTForCheking, getSearchOTChecking, logOrderSignature, updateSignature } from 'src/Utilities/Conexion';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './OrderTable.module.css';
import Swal from 'sweetalert2';

const OrderTable = () => {
    const [ordenesTrabajo, setOrdenesTrabajo] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [observacionesCierre, setObservacionesCierre] = useState('');
    const [rol, setRol] = useState(null);
    const tableRef = useRef(null);
    const panelRef = useRef(null);

    useEffect(() => {
        const storedRol = localStorage.getItem('vc_role_id');
        if (storedRol) {
            setRol(storedRol);
        }
    }, []);

    useEffect(() => {
        if (selectedOrder) {
            setObservacionesCierre(selectedOrder['Observaciones de cierre'] || ''); 
        }
    }, [selectedOrder]);
    

    const fetchData = async () => {
        try {
            const ordenes = await getOTForCheking();
            setOrdenesTrabajo(Array.isArray(ordenes) ? ordenes : []);
            console.log(ordenes);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            setOrdenesTrabajo([]);
        }
    };

    const fetchOrdersByDate = async () => {
        if (startDate && endDate) {
            // Verificar si la fecha de fin es menor que la fecha de inicio
            if (new Date(endDate) < new Date(startDate)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'La fecha de fin no puede ser menor que la fecha de inicio.',
                });
                return;
            }

            try {
                const ordenes = await getSearchOTChecking(startDate, endDate);
                setOrdenesTrabajo(Array.isArray(ordenes) ? ordenes : []);
                console.log("Ordenes por rango de fechas:", ordenes);
            } catch (error) {
                console.error("Error al filtrar las órdenes:", error);
                setOrdenesTrabajo([]);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (tableRef.current && panelRef.current) {
            const tableHeight = tableRef.current.clientHeight;
            panelRef.current.style.height = `${tableHeight}px`;
        }
    }, [ordenesTrabajo, selectedOrder]);

    const firmaComercialTemplate = (rowData) => {
        const firmado = ['52265870', '1'].includes(rowData['FIRMA COMERCIAL']);
        return (
            <span style={{ color: firmado ? '#98FB98' : '#FF5454', fontWeight: 'bold' }}>
                {firmado ? 'FIRMADO' : 'FALTA FIRMA'}
            </span>
        );
    };

    const firmaServicioTemplate = (rowData) => {
        const firmado = ['coordinacionservicios', '1'].includes(rowData['FIRMA SERVICIO AL CLIENTE']);
        return (
            <span style={{ color: firmado ? '#98FB98' : '#FF5454', fontWeight: 'bold' }}>
                {firmado ? 'FIRMADO' : 'FALTA FIRMA'}
            </span>
        );
    };

    const firmaOperacionesTemplate = (rowData) => {
        const firmado = ['1487', '1'].includes(rowData['FIRMA OPERACIONES']);
        return (
            <span style={{ color: firmado ? '#98FB98' : '#FF5454', fontWeight: 'bold' }}>
                {firmado ? 'FIRMADO' : 'FALTA FIRMA'}
            </span>
        );
    };

    const orderIDTemplate = (rowData) => {
        return (
            <a onClick={() => setSelectedOrder(rowData)} style={{ cursor: 'pointer', color: '#1E90FF' }}>
                {rowData['orden de trabajo']}
            </a>
        );
    };

    const getRowClassName = (rowData) => {
        const isSelected = selectedOrder && selectedOrder['orden de trabajo'] === rowData['orden de trabajo'];

        // Cambiar el color de fondo a gris si está seleccionada
        if (isSelected) {
            return 'bg-gray-200'; // Cambia a gris pastel
        }
        return ''; // Sin color si no está seleccionada
    };

    const handleFirmarOrden = async () => {
        if (selectedOrder) {
            if (!rol) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Rol no válido. No se puede firmar la orden.',
                });
                return;
            }

            // Verificar si la firma ya existe antes de firmar
            if ((rol === '1' && selectedOrder['FIRMA COMERCIAL']) ||
                (rol === '2' && selectedOrder['FIRMA SERVICIO AL CLIENTE']) ||
                (rol === '3' && selectedOrder['FIRMA OPERACIONES'])) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'La orden ya ha sido firmada para este rol.',
                });
                return;
            }

            try {
                const data = await updateSignature(selectedOrder, rol, observacionesCierre);
                // Datos para el log
                const logData = {
                    ordenDeTrabajo: selectedOrder['orden de trabajo'],
                    nombreCliente: selectedOrder['NOMBRE CLIENTE'],
                    nitCliente: selectedOrder['NIT CLIENTE'],
                    fechaOT: selectedOrder['FECHA OT'],
                    fechaFirma: new Date().toISOString(),
                    usuario: localStorage.getItem('vc_username'), // Obtener el nombre de usuario del localStorage
                    rol: rol
                };

                await logOrderSignature(logData);

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    html: `La orden número <span style="color: purple;">${selectedOrder['orden de trabajo']}</span> ha sido firmada correctamente.`, // Usa HTML para estilizar el número
                });
                
                fetchData();
                setSelectedOrder(null);
                setObservacionesCierre('');
            } catch (error) {
                console.error('Error:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al firmar la orden. Por favor, intenta nuevamente.',
                });
            }
        }
    };

    return (
        <main className="flex min-h-screen">
            <Bar />
            <div className="flex-1 flex justify-center items-start p-10 w-full">
                <div className="border p-6 rounded-lg shadow-lg w-full max-w-10xl flex flex-col overflow-hidden">
                    <div className="flex gap-6 overflow-hidden">
                        <div className="flex-1 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                            <div className="flex flex-col space-y-1.5 p-6 px-7">
                                <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Órdenes de Trabajo</h3>
                                <p className="text-sm text-muted-foreground">Estas son las órdenes de trabajo a firmar.</p>
                            </div>
                            <div className="p-6 overflow-auto custom-table-wrapper" ref={tableRef}>
                                <div className="flex items-center mb-4 gap-4 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
                                    <div className="flex items-center gap-2">
                                        <span className="p-input-icon-left">
                                            <i className="pi pi-search" style={{ color: '#6b7280', fontSize: '1.2rem', paddingLeft: '1.2rem' }}></i>
                                            <InputText
                                                value={globalFilter}
                                                onChange={(e) => setGlobalFilter(e.target.value)}
                                                placeholder="Buscar por ID"
                                                className="p-inputtext-lg border border-gray-300 rounded-lg shadow-sm"
                                                style={{ width: '200px', padding: '10px 45px' }}
                                            />
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <Calendar
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.value)}
                                            placeholder="Fecha Inicio"
                                            dateFormat="yy-mm-dd"
                                            className="p-inputtext-lg border border-gray-300 rounded-lg shadow-sm"
                                            style={{ width: '180px', padding: '10px 15px' }}
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <Calendar
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.value)}
                                            placeholder="Fecha Fin"
                                            dateFormat="yy-mm-dd"
                                            className="p-inputtext-lg border border-gray-300 rounded-lg shadow-sm"
                                            style={{ width: '180px', padding: '10px 15px' }}
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <button
                                            onClick={fetchOrdersByDate}
                                            className="bg-brightBlue m-2 text-white py-3 px-5 rounded-lg font-semibold"
                                        >
                                            Buscar por Fecha
                                        </button>
                                    </div>
                                </div>

                                <DataTable
                                    value={ordenesTrabajo}
                                    paginator
                                    rows={10}
                                    responsiveLayout="scroll"
                                    className="p-datatable-gridlines custom-table"
                                    globalFilterFields={['orden de trabajo']}
                                    filters={{ global: { value: globalFilter, matchMode: 'contains' } }}
                                    rowClassName={getRowClassName} // Asegúrate de que esto esté presente
                                >
                                    <Column field="orden de trabajo" header="Orden ID" sortable body={orderIDTemplate} />
                                    <Column field="NIT CLIENTE" header="NIT Cliente" sortable />
                                    <Column
                                        field="FECHA OT"
                                        header="Fecha OT"
                                        sortable
                                        body={(data) => new Date(data['FECHA OT']).toLocaleDateString()}
                                    />
                                    <Column field="FIRMA COMERCIAL" header="Firma Comercial" sortable body={firmaComercialTemplate} />
                                    <Column field="FIRMA SERVICIO AL CLIENTE" header="Firma Servicio Al Cliente" sortable body={firmaServicioTemplate} />
                                    <Column field="FIRMA OPERACIONES" header="Firma Operaciones" sortable body={firmaOperacionesTemplate} />
                                </DataTable>
                            </div>
                        </div>
                        {selectedOrder && (
                            <div className="w-[600px] bg-background border-l shadow-lg flex flex-col overflow-auto" ref={panelRef}>
                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1 overflow-auto">
                                    <div className="flex flex-col space-y-1.5 p-6">
                                        <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Detalles Orden</h3>
                                    </div>
                                    <div className="p-6 overflow-auto details-content grid grid-cols-2 gap-4">
                                        <div><div className="text-muted-foreground">NIT CLIENTE:</div><div>{selectedOrder['NIT CLIENTE']}</div></div>
                                        <div><div className="text-muted-foreground">NOMBRE CLIENTE:</div><div>{selectedOrder['NOMBRE CLIENTE']}</div></div>
                                        <div><div className="text-muted-foreground">NOMBRE ANUNCIANTE:</div><div>{selectedOrder['NOMBRE ANUNCIANTE']}</div></div>
                                        <div><div className="text-muted-foreground">TIPO OT:</div><div>{selectedOrder['TIPO OT']}</div></div>
                                        <div><div className="text-muted-foreground">COBERTURA:</div><div>{selectedOrder['COBERTURA']}</div></div>
                                        <div><div className="text-muted-foreground">ALERTAS CORREOS:</div><div>{selectedOrder['ALERTAS CORREOS']}</div></div>
                                        <div><div className="text-muted-foreground">WHATSAPP:</div><div>{selectedOrder['WHATSAPP']}</div></div>
                                        <div><div className="text-muted-foreground">NEWSLETERS CORREOS:</div><div>{selectedOrder['NEWSLETERS CORREOS']}</div></div>
                                        <div><div className="text-muted-foreground">PERSONA COMERCIAL:</div><div>{selectedOrder['PERSONA COMERCIAL']}</div></div>
                                        <div><div className="text-muted-foreground">PERSONA SERVICIO AL CLIENTE:</div><div>{selectedOrder['PERSONA SERVICIO AL CLIENTE']}</div></div>
                                        <div><div className="text-muted-foreground">Observaciones:</div><div>{selectedOrder['Observaciones']}</div></div>
                                        <div><div className="text-muted-foreground">VALOR IMPRESOS:</div><div>{selectedOrder['VALOR IMPRESOS']}</div></div>
                                        <div><div className="text-muted-foreground">VALOR RADIO:</div><div>{selectedOrder['VALOR RADIO']}</div></div>
                                        <div><div className="text-muted-foreground">VALOR TELEVISION:</div><div>{selectedOrder['VALOR TELEVISION']}</div></div>
                                        <div><div className="text-muted-foreground">VALOR INTERNET:</div><div>{selectedOrder['VALOR INTERNET']}</div></div>
                                        <div><div className="text-muted-foreground">VALOR ANALISIS:</div><div>{selectedOrder['VALOR ANALISIS']}</div></div>
                                        <div><div className="text-muted-foreground">VALOR SOCIAL:</div><div>{selectedOrder['VALOR SOCIAL']}</div></div>
                                        <div><div className="text-muted-foreground">VALOR PACTADO:</div><div>{selectedOrder['VALOR PACTADO']}</div></div>
                                        <div><div className="text-muted-foreground">VIGENCIA DESDE:</div><div>{selectedOrder['VIGENCIA DESDE']}</div></div>
                                        <div><div className="text-muted-foreground">VIGENCIA HASTA:</div><div>{selectedOrder['VIGENCIA HASTA']}</div></div>
                                        <div><div className="text-muted-foreground">TOTAL DIAS:</div><div>{selectedOrder['TOTAL DIAS']}</div></div>
                                        <div><div className="text-muted-foreground">TOTAL VALOR DIAS:</div><div>{selectedOrder['TOTAL VALOR DIAS']}</div></div>
                                        <div><div className="text-muted-foreground">NUMERO FACTURA:</div><div>{selectedOrder['NUMERO FACTURA']}</div></div>
                                        <div><div className="text-muted-foreground">USUARIOS:</div><div>{selectedOrder['USUARIOS']}</div></div>
                                        <div><div className="text-muted-foreground">CORRECCION:</div><div>{selectedOrder['CORRECCION']}</div></div>
                                        {rol === '3' && (
                                            <div className="col-span-2">
                                                <div className="text-muted-foreground">Observaciones de Cierre:</div>
                                                <textarea
                                                    value={observacionesCierre || selectedOrder['Observaciones de cierre'] || ''} // Muestra el valor de observaciones de cierre
                                                    onChange={(e) => setObservacionesCierre(e.target.value)} // Permite cambiar el valor
                                                    className="w-full border border-gray-300 rounded-lg p-2 mt-2"
                                                    placeholder="Escribe tus observaciones de cierre aquí"
                                                    readOnly={selectedOrder['Observaciones de cierre'] && !observacionesCierre} // Solo readonly si hay observaciones previas y no hay nuevo texto
                                                />
                                            </div>
                                        )}

                                        <div className="static mb-10 transform col-span-2">
                                            <button className="bg-brightBlue m-2 text-white py-2 px-4 rounded" onClick={handleFirmarOrden}>Firmar Orden</button>
                                            <button className="bg-red-500 m-2 text-white py-2 px-4 rounded" onClick={() => setSelectedOrder(null)}>Cerrar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderTable;
