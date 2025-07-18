'use client';

import React, { useState, useEffect } from 'react';
import { FaSignature, FaSearch, FaCalendarAlt, FaTimes, FaCheck, FaQuestionCircle } from 'react-icons/fa';
import Bar from '../../components/Bar';
import { getOTForCheking, getSearchOTChecking, logOrderSignature, updateSignature } from 'src/Utilities/Conexion';
import Swal from 'sweetalert2';

const OrderTable = () => {
    const [ordenesTrabajo, setOrdenesTrabajo] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [observacionesCierre, setObservacionesCierre] = useState('');
    const [rol, setRol] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const rowsPerPage = 10;

    // Efecto para cargar el rol del localStorage y configurar el sidebar
    useEffect(() => {
        const storedRol = localStorage.getItem('vc_role_id');
        if (storedRol) {
            setRol(storedRol);
        }

        // Detectar tamaño de pantalla para ajustar sidebar
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize(); // Ejecutar al inicio
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Actualizar observaciones cuando cambia la orden seleccionada
    useEffect(() => {
        if (selectedOrder) {
            setObservacionesCierre(selectedOrder['Observaciones de cierre'] || '');
        }
    }, [selectedOrder]);

    // Función para cargar las órdenes de trabajo
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

    // Función para filtrar órdenes por fecha
    const fetchOrdersByDate = async () => {
        if (startDate && endDate) {
            // Ajustar fechas para evitar desfase por zona horaria
            const start = new Date(`${startDate}T00:00:00`);
            const end = new Date(`${endDate}T23:59:59`);

            if (end < start) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                    text: 'La fecha de fin no puede ser menor que la fecha de inicio.',
                });
                return;
            }

            try {
                const ordenes = await getSearchOTChecking(start, end);
                setOrdenesTrabajo(Array.isArray(ordenes) ? ordenes : []);
            } catch (error) {
                console.error("Error al filtrar las órdenes:", error);
                setOrdenesTrabajo([]);
            }
        } else {
            console.log("Faltan fechas para filtrar", { startDate, endDate });
        }
    };

    const exportarExcel = async () => {
        // Importa ExcelJS dinámicamente para evitar problemas SSR
        const ExcelJS = (await import('exceljs')).default;

        // Crea un nuevo libro y hoja
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Órdenes de Trabajo');

        // Define las columnas con todos los campos relevantes
        worksheet.columns = [
            { header: 'Orden ID', key: 'orden de trabajo', width: 15 },
            { header: 'NIT Cliente', key: 'NIT CLIENTE', width: 20 },
            { header: 'Nombre Cliente', key: 'NOMBRE CLIENTE', width: 30 },
            { header: 'Nombre Anunciante', key: 'NOMBRE ANUNCIANTE', width: 30 },
            { header: 'Tipo OT', key: 'TIPO OT', width: 15 },
            { header: 'Fecha OT', key: 'FECHA OT', width: 15 },
            { header: 'Cobertura', key: 'COBERTURA', width: 15 },
            { header: 'Alertas Correos', key: 'ALERTAS CORREOS', width: 20 },
            { header: 'WhatsApp', key: 'WHATSAPP', width: 15 },
            { header: 'Newsletters', key: 'NEWSLETERS CORREOS', width: 20 },
            { header: 'Persona Comercial', key: 'PERSONA COMERCIAL', width: 20 },
            { header: 'Persona SAC', key: 'PERSONA SERVICIO AL CLIENTE', width: 20 },
            { header: 'Valor Impresos', key: 'VALOR IMPRESOS', width: 15 },
            { header: 'Valor Radio', key: 'VALOR RADIO', width: 15 },
            { header: 'Valor TV', key: 'VALOR TELEVISION', width: 15 },
            { header: 'Valor Internet', key: 'VALOR INTERNET', width: 15 },
            { header: 'Valor Análisis', key: 'VALOR ANALISIS', width: 15 },
            { header: 'Valor Social', key: 'VALOR SOCIAL', width: 15 },
            { header: 'Valor Pactado', key: 'VALOR PACTADO', width: 15 },
            { header: 'Vigencia Desde', key: 'VIGENCIA DESDE', width: 15 },
            { header: 'Vigencia Hasta', key: 'VIGENCIA HASTA', width: 15 },
            { header: 'Total Días', key: 'TOTAL DIAS', width: 12 },
            { header: 'Total Valor Días', key: 'TOTAL VALOR DIAS', width: 15 },
            { header: 'Número Factura', key: 'NUMERO FACTURA', width: 15 },
            { header: 'Usuarios', key: 'USUARIOS', width: 12 },
            { header: 'Observaciones', key: 'Observaciones', width: 40 },
            { header: 'Observaciones de Cierre', key: 'Observaciones de cierre', width: 40 },
            { header: 'Comercial', key: 'FIRMA COMERCIAL', width: 15 },
            { header: 'Servicio', key: 'FIRMA SERVICIO AL CLIENTE', width: 15 },
            { header: 'Operaciones', key: 'FIRMA OPERACIONES', width: 15 }
        ];

        // Agrega todas las filas - usando filteredOrders en lugar de currentItems para obtener todas las órdenes filtradas
        filteredOrders.forEach(order => {
            // Formatear valores monetarios para el Excel
            const formatMonetaryValue = (value) => {
                return value ? parseFloat(value) : 0;
            };

            worksheet.addRow({
                'orden de trabajo': order['orden de trabajo'],
                'NIT CLIENTE': order['NIT CLIENTE'],
                'NOMBRE CLIENTE': order['NOMBRE CLIENTE'],
                'NOMBRE ANUNCIANTE': order['NOMBRE ANUNCIANTE'],
                'TIPO OT': order['TIPO OT'],
                'FECHA OT': order['FECHA OT'] ? new Date(order['FECHA OT']) : '',
                'COBERTURA': order['COBERTURA'] || 'Internacional',
                'ALERTAS CORREOS': order['ALERTAS CORREOS'] || '',
                'WHATSAPP': order['WHATSAPP'] || '',
                'NEWSLETERS CORREOS': order['NEWSLETERS CORREOS'] || '',
                'PERSONA COMERCIAL': order['PERSONA COMERCIAL'] || '',
                'PERSONA SERVICIO AL CLIENTE': order['PERSONA SERVICIO AL CLIENTE'] || '',
                'VALOR IMPRESOS': formatMonetaryValue(order['VALOR IMPRESOS']),
                'VALOR RADIO': formatMonetaryValue(order['VALOR RADIO']),
                'VALOR TELEVISION': formatMonetaryValue(order['VALOR TELEVISION']),
                'VALOR INTERNET': formatMonetaryValue(order['VALOR INTERNET']),
                'VALOR ANALISIS': formatMonetaryValue(order['VALOR ANALISIS']),
                'VALOR SOCIAL': formatMonetaryValue(order['VALOR SOCIAL']),
                'VALOR PACTADO': formatMonetaryValue(order['VALOR PACTADO']),
                'VIGENCIA DESDE': order['VIGENCIA DESDE'] ? new Date(order['VIGENCIA DESDE']) : '',
                'VIGENCIA HASTA': order['VIGENCIA HASTA'] ? new Date(order['VIGENCIA HASTA']) : '',
                'TOTAL DIAS': order['TOTAL DIAS'] || '0',
                'TOTAL VALOR DIAS': formatMonetaryValue(order['TOTAL VALOR DIAS']),
                'NUMERO FACTURA': order['NUMERO FACTURA'] || '',
                'USUARIOS': order['USUARIOS'] || '0',
                'Observaciones': order['Observaciones'] || '',
                'Observaciones de cierre': order['Observaciones de cierre'] || '',
                'FIRMA COMERCIAL': ['52265870', '1'].includes(order['FIRMA COMERCIAL']) ? 'Firmado' : 'Pendiente',
                'FIRMA SERVICIO AL CLIENTE': ['coordinacionservicios', '1'].includes(order['FIRMA SERVICIO AL CLIENTE']) ? 'Firmado' : 'Pendiente',
                'FIRMA OPERACIONES': ['1487', '1'].includes(order['FIRMA OPERACIONES']) ? 'Firmado' : 'Pendiente'
            });
        });

        // Aplicar estilos a las celdas
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Formatear columnas monetarias
        ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'W'].forEach(col => {
            worksheet.getColumn(col).numFmt = '"$"#,##0.00';
        });

        // Formatear columnas de fechas
        ['F', 'T', 'U'].forEach(col => {
            worksheet.getColumn(col).numFmt = 'dd/mm/yyyy';
        });

        // Genera el archivo y lo descarga
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        // Fecha y hora actual para el nombre del archivo
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const fechaHora = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

        const a = document.createElement('a');
        a.href = url;
        a.download = `ordenes_trabajo_gestion_${fechaHora}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchData();
    }, []);

    // Función para firmar la orden seleccionada
    const handleFirmarOrden = async () => {
        if (selectedOrder) {
            if (!rol) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
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
                    usuario: localStorage.getItem('vc_username'),
                    rol: rol
                };

                await logOrderSignature(logData);

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    html: `La orden número <span style="color: purple;">${selectedOrder['orden de trabajo']}</span> ha sido firmada correctamente.`,
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

    // Componente para mostrar el estado de firma con icono
    const SignatureStatus = ({ isSigned }) => (
        <div className={`pl-5 ${isSigned ? 'text-green-500' : 'text-red-500'}`}>
            {isSigned ? (
                <div className="flex items-center">
                    <FaCheck className="mr-1" />
                </div>
            ) : (
                <div className="flex items-center">
                    <FaTimes className="mr-1" />
                </div>
            )}
        </div>
    );

    // Filtrar órdenes por el filtro global
    const filteredOrders = ordenesTrabajo.filter(order =>
        order['orden de trabajo']?.toString().toLowerCase().includes(globalFilter.toLowerCase()) ||
        order['NIT CLIENTE']?.toString().toLowerCase().includes(globalFilter.toLowerCase()) ||
        order['NOMBRE CLIENTE']?.toString().toLowerCase().includes(globalFilter.toLowerCase()) ||
        order['TIPO OT']?.toString().toLowerCase().includes(globalFilter.toLowerCase())
    );

    // Paginación
    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    // Formato para valores monetarios
    const formatCurrency = (value) => {
        if (!value) return '$ 0,00';
        return `$ ${parseFloat(value).toLocaleString('es-CO')}`;
    };

    return (
        <main className="flex min-h-screen relative">
            {sidebarOpen && (
                <div className="fixed lg:static z-10 h-screen">
                    <Bar />
                </div>
            )}
            <div className={`flex-1 transition-all duration-300 p-4 lg:p-6 ${sidebarOpen ? 'ml-64 lg:ml-0' : 'ml-0'}`}>
                {/* Botón toggle sidebar para pantallas pequeñas */}
                <button
                    className="lg:hidden fixed top-4 left-4 z-20 bg-blue-600 text-white p-2 rounded-md shadow-md"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? '«' : '»'}
                </button>

                {/* Cabecera */}
                <div className="m-6">
                    <h1 className="text-2xl text-gray-800">ÓRDENES DE TRABAJO</h1>
                </div>

                {/* Contenedor principal con flex */}
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Sección izquierda: tabla y filtros */}
                    <div className="flex-1 xl:w-2/3">
                        <div className="bg-white rounded-lg overflow-hidden">
                            {/* Filtros */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                                    <div className="relative w-full md:w-64">
                                        <label className="block text-sm  text-gray-700 mb-1">Buscar</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                <FaSearch />
                                            </span>
                                            <input
                                                value={globalFilter}
                                                onChange={(e) => setGlobalFilter(e.target.value)}
                                                placeholder="Buscar"
                                                className="pl-10 pr-4 py-2 text-sm w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Filtros por fecha */}
                                    <div className="flex flex-col md:flex-row gap-4 w-full">
                                        <div className="w-full md:w-auto">
                                            <label className="block text-sm  text-gray-700 mb-1">Fecha Inicio</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                    <FaCalendarAlt />
                                                </span>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="pl-10 text-sm pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full md:w-auto">
                                            <label className="block text-sm  text-gray-700 mb-1">Fecha Fin</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                    <FaCalendarAlt />
                                                </span>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="pl-10 text-sm pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="self-end">
                                            <button
                                                onClick={fetchOrdersByDate}
                                                className="bg-blue-600 text-sm hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition w-full md:w-auto"
                                            >
                                                Buscar por Fecha
                                            </button>
                                        </div>

                                        <div className="self-end">
                                            <button
                                                onClick={exportarExcel}
                                                className="bg-green-600 text-sm hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition w-full md:w-auto"
                                            >
                                                Exportar a Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Orden ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                NIT Cliente
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nombre Cliente
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo OT
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha OT
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Comercial
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Servicio
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Operaciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentItems.length > 0 ? (
                                            currentItems.map((order, index) => (
                                                <tr
                                                    key={index}
                                                    className={`${selectedOrder && selectedOrder['orden de trabajo'] === order['orden de trabajo'] ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer transition-colors`}
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium pl-5 text-blue-600">{order['orden de trabajo']}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-900">{order['NIT CLIENTE']}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-900">{order['NOMBRE CLIENTE']}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-900">{order['TIPO OT']}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(order['FECHA OT']).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <SignatureStatus isSigned={['52265870', '1'].includes(order['FIRMA COMERCIAL'])} />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <SignatureStatus isSigned={['coordinacionservicios', '1'].includes(order['FIRMA SERVICIO AL CLIENTE'])} />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <SignatureStatus isSigned={['1487', '1'].includes(order['FIRMA OPERACIONES'])} />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                                                    No se encontraron órdenes de trabajo
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, filteredOrders.length)}</span> de <span className="font-medium">{filteredOrders.length}</span> resultados
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                                >
                                                    &laquo;
                                                </button>
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === i + 1 ? 'bg-blue-50 border-blue-500 text-blue-600 z-10' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                                >
                                                    &raquo;
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sección derecha: panel de detalles */}
                    <div className="xl:w-1/3 flex-shrink-0">
                        {selectedOrder ? (
                            <div className="bg-white rounded-lg  border border-gray-200 overflow-hidden max-h-screen">
                                {/* Cabecera del panel de detalles */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                    <div className="flex items-center">
                                        <h3 className="text-xl text-gray-800">
                                            DETALLES DE LA ORDEN #{selectedOrder['orden de trabajo']}
                                        </h3>

                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Contenido del panel con scroll */}
                                <div className="px-6 pt-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                                    {/* Datos principales */}
                                    <div className="mb-6">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">NIT Cliente</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['NIT CLIENTE']}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Nombre Cliente</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['NOMBRE CLIENTE']}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Nombre Anunciante</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['NOMBRE ANUNCIANTE']}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Tipo OT</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['TIPO OT']}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Cobertura</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['COBERTURA'] || 'Internacional'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Alertas Correos</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['ALERTAS CORREOS'] || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información de contacto */}
                                    <div className="mb-6">
                                        <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Información de Contacto</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">WhatsApp</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['WHATSAPP'] || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Newsletters</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['NEWSLETERS CORREOS'] || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Persona Comercial</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['PERSONA COMERCIAL'] || 'pruebaaa'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Persona SAC</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['PERSONA SERVICIO AL CLIENTE'] || 'pruebaaa'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Observaciones */}
                                    <div className="mb-6">
                                        <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Observaciones</h3>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                            {selectedOrder['Observaciones'] || 'Sin observaciones'}
                                        </p>
                                    </div>

                                    {/* Valores */}
                                    <div className="mb-6">
                                        <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Valores</h3>
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Impresos</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(selectedOrder['VALOR IMPRESOS'])}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Radio</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(selectedOrder['VALOR RADIO'])}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">TV</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(selectedOrder['VALOR TELEVISION'])}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Internet</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(selectedOrder['VALOR INTERNET'])}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Análisis</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(selectedOrder['VALOR ANALISIS'])}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Social</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(selectedOrder['VALOR SOCIAL'])}</p>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-3 rounded border border-blue-100">
                                            <h4 className="text-sm font-medium text-blue-700">Valor Pactado</h4>
                                            <p className="mt-1 text-lg font-bold text-blue-800">{formatCurrency(selectedOrder['VALOR PACTADO'])}</p>
                                        </div>
                                    </div>

                                    {/* Vigencia */}
                                    <div className="mb-6">
                                        <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Vigencia</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Desde</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {selectedOrder['VIGENCIA DESDE'] ? new Date(selectedOrder['VIGENCIA DESDE']).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Hasta</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {selectedOrder['VIGENCIA HASTA'] ? new Date(selectedOrder['VIGENCIA HASTA']).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Total Días</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['TOTAL DIAS'] || '0'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Total Valor Días</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(selectedOrder['TOTAL VALOR DIAS'])}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Facturación */}
                                    <div className="mb-6">
                                        <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Facturación</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Número Factura</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['NUMERO FACTURA'] || 'Sin asignar'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Usuarios</h4>
                                                <p className="mt-1 text-sm font-medium text-gray-900">{selectedOrder['USUARIOS'] || '0'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Campo de Observaciones de Cierre (solo para rol 3) */}
                                    {rol === '3' && (
                                        <div className="mb-6">
                                            <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Observaciones de Cierre</h3>
                                            <textarea
                                                value={observacionesCierre}
                                                onChange={(e) => setObservacionesCierre(e.target.value)}
                                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Escribe tus observaciones de cierre aquí"
                                                rows="3"
                                            />
                                        </div>
                                    )}

                                    {/* Botones de acción */}
                                    <div className="flex justify-center border-t border-gray-200 p-4 bg-white sticky bottom-0 z-10">

                                        <button
                                            type="button"
                                            onClick={handleFirmarOrden}
                                            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <FaSignature className="mr-2" /> Firmar Orden
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                <div className="flex flex-col items-center justify-center h-64">
                                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">Ninguna orden seleccionada</h3>
                                    <p className="text-sm text-gray-500">Selecciona una orden de la tabla para ver sus detalles</p>
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