'use client';

import { useEffect, useContext, useState } from "react";
import Bar from "../../components/Bar.js";
import ClientInfoForm from "src/app/components/order/ClientInfoForm.js";
import OrderTypeSelector from "src/app/components/order/OrderTypeSelector";
import ConfigSection from "src/app/components/order/ConfigSection";
import DetailsSection from "src/app/components/order/DetailsSection";
import CoverageSection from "src/app/components/order/CoverageSection";
import InformationSendSection from "src/app/components/order/InformationSendSection";
import MonitoringMediaSection from "src/app/components/order/MonitoringMediaSection";
import ContractedServicesSection from "src/app/components/order/ContractedServicesSection";
import CustomerManagementSection from "src/app/components/order/CustomerManagementSection";
import Modal from "../../components/Modal.js";
import FooterBar from "src/app/components/order/SignFooter.js";
import { DataContext } from "src/app/pages/context/DataContext";
import { fetchClientes, fetchOptions, getOT } from "src/Utilities/Conexion.js";

export default function QueryOrderEdit() {
  const {
    queryOrderDetails, setQueryOrderDetails,
    isModalOpen, setIsModalOpen,
    isReadOnly, setIsReadOnly,
    setQueryOrderNumber,
    setTipoOt,
    setValuesCobertura,
    setCheckedValuesCobertura,
    setCorreosAlertas,
    setCorreosBoletines,
    setDirectorComercial,
    setServicioAlCliente,
    setComentariosDetalle,
    setValues,
    setTotalFee,
    setStartDate,
    setEndDate,
    setDays,
    setTotalContractedValue,
    setActividad,
    setNumeroOt,
    setUsuarios,
    setCorreccion,
    setAnalisis,
    setMarca,
    setCompetencias,
    setEntorno,
    setSectores,
    setCategoria,
    setCheckedValuesServicios,
    setValuesServicio,
    setClientName,
    setNombreAnunciante,
  } = useContext(DataContext);

  const [options, setOptions] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataOrden, setDataOrden] = useState([]);
  const [currentSection, setCurrentSection] = useState("cliente");

  // Definición de las secciones
  const sections = [
    { id: "cliente", name: "Información del Cliente", icon: "user" },
    { id: "tipo", name: "Tipo de Orden", icon: "file-text" },
    { id: "config", name: "Configuración", icon: "settings" },
    { id: "detalles", name: "Detalles", icon: "list" },
    { id: "cobertura", name: "Cobertura", icon: "map-pin" },
    { id: "envio", name: "Envío de Información", icon: "mail" },
    { id: "medios", name: "Monitoreo de Medios", icon: "monitor" },
    { id: "servicios", name: "Servicios Contratados", icon: "package" },
    { id: "gestion", name: "Gestión de Clientes", icon: "users" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [optionsResponse, clientsResponse] = await Promise.all([fetchOptions(), fetchClientes()]);
      setOptions(optionsResponse);
      setClients(clientsResponse);
      setIsLoading(false);

      // Limpiar localStorage al iniciar
      localStorage.removeItem('queryOrderDetails');

      // Inicializar state con valores vacíos
      setQueryOrderDetails([]);
      setDataOrden([]);
      setIsReadOnly(false);
    };

    fetchData();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleQuerySubmit = (response) => {
    if (response) {
      const data = response;
      setIsReadOnly(true);
      setClientName(data.NombreCliente);
      setNombreAnunciante(data.Nombre_Anunciante);
      setTipoOt(data.Tipo_Ot);
      setValuesCobertura(data.Cobertura);
      setCheckedValuesCobertura({
        Nacional: data.Cobertura === "Nacional",
        Cartagena: data.Cobertura === "Cartagena",
        Palmira: data.Cobertura === "Palmira",
        Tulua: data.Cobertura === "Tulua",
        Buga: data.Cobertura === "Buga",
        Internacional: data.Cobertura === "Internacional",
      });
      setCorreosAlertas(data.Correos_Alertas);
      setCorreosBoletines(data.Correos_Boletines);
      setDirectorComercial(data.Director_Comercial);
      setServicioAlCliente(data.Servicio_Al_Cliente);
      setComentariosDetalle(data.Comentarios_Detalle);
      setValues({
        impresos: parseFloat(data.Valor_Impresos) || 0,
        radio: parseFloat(data.Valor_Radio) || 0,
        television: parseFloat(data.Valor_Television) || 0,
        internet: parseFloat(data.Valor_Internet) || 0,
        analisis: parseFloat(data.Valor_Analisis) || 0,
        social: parseFloat(data.Valor_Social) || 0,
      });
      setTotalFee(parseFloat(data.Total_Valor) || 0);
      setStartDate(data.Vigencia_Desde);
      setEndDate(data.Vigencia_Hasta);
      setDays(parseInt(data.Total_Dias) || 0);
      setTotalContractedValue(parseFloat(data.Total_Valor_Dias) || 0);
      setActividad(data.Actividad);
      setNumeroOt(data.Numero_Ot);
      setUsuarios(data.Usuarios);
      setCorreccion(data.Correccion);
      setAnalisis(data.Analisis);
      setMarca(data.Marca);
      setCompetencias(data.Competencias);
      setEntorno(data.Entorno);
      setSectores(data.Sectores);
      setCategoria(data.Categoria);
      setCheckedValuesServicios({
        Alertas: data.Servicios_Contratados === "Alertas",
        Clippin: data.Servicios_Contratados === "Clippin",
        Catalogo: data.Servicios_Contratados === "Catalogo",
        Análisis: data.Servicios_Contratados === "Análisis",
      });
      setValuesServicio(data.Servicios_Contratados);
      setQueryOrderDetails(data);
      setIsModalOpen(false);
      setDataOrden(data);
      // Ya no guardamos en localStorage
    } else {
      alert("No se encontraron detalles de la orden.");
    }
  };

  // Renderizar el icono para cada sección
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'user':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      case 'file-text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'settings':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        );
      case 'list':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'map-pin':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        );
      case 'mail':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        );
      case 'monitor':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
          </svg>
        );
      case 'package':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Contenido para cada sección del formulario
  const renderSectionContent = () => {
    // Si no hay datos seleccionados, mostrar mensaje de selección
    if (!dataOrden || (Array.isArray(dataOrden) && dataOrden.length === 0) || Object.keys(dataOrden).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No hay orden seleccionada</h3>
          <p className="text-gray-500 mb-4">Haz clic en "Consultar OT" para buscar y seleccionar una orden de trabajo.</p>
          {/* <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Consultar OT
          </button> */}
        </div>
      );
    }

    switch (currentSection) {
      case "cliente":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <ClientInfoForm data={dataOrden} isReadOnly={isReadOnly} />
          </section>
        );
      case "tipo":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <OrderTypeSelector data={dataOrden} options={options} isReadOnly={isReadOnly} />
          </section>
        );
      case "config":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <ConfigSection data={dataOrden} isReadOnly={isReadOnly} />
          </section>
        );
      case "detalles":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <DetailsSection data={dataOrden} isReadOnly={isReadOnly} />
          </section>
        );
      case "cobertura":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <CoverageSection data={dataOrden} isReadOnly={isReadOnly} />
          </section>
        );
      case "envio":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <InformationSendSection data={dataOrden} isReadOnly={isReadOnly} />
          </section>
        );
      case "medios":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <MonitoringMediaSection data={dataOrden} isReadOnly={isReadOnly} />
          </section>
        );
      case "servicios":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <ContractedServicesSection data={dataOrden} isReadOnly={isReadOnly} />
          </section>
        );
      case "gestion":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <CustomerManagementSection data={dataOrden} options={options} isReadOnly={isReadOnly} />
          </section>
        );
      default:
        return <div>Seleccione una sección</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  const exportarExcel = async () => {
    // Importa ExcelJS dinámicamente para evitar problemas SSR
    const ExcelJS = (await import('exceljs')).default;

    // Crea un nuevo libro y hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orden de Trabajo');

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

    // dataOrden puede ser un objeto o un array, lo normalizamos a array
    const ordenes = Array.isArray(dataOrden) ? dataOrden : [dataOrden];

    ordenes.forEach(order => {
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

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);

    // Fecha y hora actual para el nombre del archivo
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const fechaHora = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    const a = document.createElement('a');
    a.href = url;
    a.download = `orden_trabajo_${fechaHora}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/actualizarOT', { // Cambia por tu URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryOrderDetails)

      });

      if (response.ok) {
        alert('Orden actualizada correctamente');
        setIsReadOnly(true);
        // Opcional: Actualiza el localStorage y el estado global
        localStorage.setItem('queryOrderDetails', JSON.stringify({
          ...queryOrderDetails,
          ...createOrderDetails
        }));
      } else {
        alert('Error al actualizar la orden');
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Error al guardar los cambios');
    }
  };


  return (
    <main className="flex min-h-screen">
      <Bar className="w-1/6 min-h-screen" />
      <div className="flex-1 p-6">
        {isModalOpen && <Modal onClose={handleModalClose} queryType="OT" onSubmit={handleQuerySubmit} />}

        {/* Header */}
        <div className="p-5 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl tracking-wide">CONSULTA ORDEN DE TRABAJO</h3>
            <div className="flex gap-2 ml-auto">
              <button
                className="bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
                onClick={() => setIsModalOpen(true)}
              >
                Consultar y Editar
              </button>

          

              <button
                className="bg-green-500 text-white py-2 px-5 rounded-md transition-colors duration-200 font-medium"
                onClick={handleSaveChanges}
              >
                Guardar Cambios
              </button>

         
            </div>

          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-b-lg">
          {/* Navegación de secciones */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id)}
                  className={`p-2 flex flex-col items-center justify-center rounded-md transition-all ${section.id === currentSection
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <div className={`p-1.5 rounded-full mb-1 ${section.id === currentSection ? 'bg-blue-200' : 'bg-gray-200'}`}>
                    {renderIcon(section.icon)}
                  </div>
                  <span className="text-xs text-center">{section.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navegación responsive para móviles */}
          <div className="p-4 block md:hidden">
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={currentSection}
              onChange={(e) => setCurrentSection(e.target.value)}
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* Contenido de la sección */}
          <div className="p-6 h-[350px] overflow-y-auto">
            {renderSectionContent()}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <FooterBar data={queryOrderDetails} />
          </div>
        </div>
      </div>
    </main>
  );
}