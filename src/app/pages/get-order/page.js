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
import Swal from 'sweetalert2';
import FooterBar from "src/app/components/order/SignFooter.js";
import { DataContext } from "src/app/pages/context/DataContext";
import { fetchClientes, fetchOptions, updateOT } from "src/Utilities/Conexion.js";

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
    setClients: setContextClients,
    setOptions: setContextOptions,
  } = useContext(DataContext);

  const [options, setOptions] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataOrden, setDataOrden] = useState([]);
  const [currentSection, setCurrentSection] = useState("cliente");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 🆕 NUEVO: Estado para verificar si el usuario tiene permisos de edición
  const [hasEditPermission, setHasEditPermission] = useState(false);

  // 🆕 NUEVO: Estado para controlar si la OT está firmada por operaciones
  const [isOperationsSigned, setIsOperationsSigned] = useState(false);

  // 🆕 NUEVO: Estado para mantener los datos temporales de edición
  const [tempEditData, setTempEditData] = useState({});
  const [originalData, setOriginalData] = useState({});

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

  // 🆕 NUEVO: Función para verificar permisos de usuario
  const checkUserPermissions = () => {
    const userRoleId = localStorage.getItem('vc_role_id');
    console.log('Verificando permisos de usuario - Role ID:', userRoleId);
    
    // Solo el rol con ID 3 puede editar
    const canEdit = userRoleId === '3';
    setHasEditPermission(canEdit);
    
    console.log('Permisos de edición:', canEdit ? 'PERMITIDO' : 'DENEGADO');
    return canEdit;
  };

  const checkOperationsSignature = (data) => {
    // Verificar los valores que indican que está firmada por operaciones
    const operationsSignature = data['FIRMA OPERACIONES'] || data.FIRMA_OPERACIONES || data.firma_operaciones;
    const isSigned = ['1487', '1'].includes(String(operationsSignature));

    console.log('Verificando firma de operaciones:', {
      operationsSignature,
      isSigned,
      dataKeys: Object.keys(data)
    });

    return isSigned;
  };

  useEffect(() => {
    const fetchData = async () => {
      const [optionsResponse, clientsResponse] = await Promise.all([fetchOptions(), fetchClientes()]);

      console.log('QueryOrderEdit - Datos cargados:');
      console.log('- optionsResponse:', optionsResponse);
      console.log('- clientsResponse:', clientsResponse);
      console.log('- clientsResponse.length:', clientsResponse?.length);

      setOptions(optionsResponse);
      setClients(clientsResponse);
      setContextClients(clientsResponse);
      setContextOptions(optionsResponse);
      
      // 🆕 NUEVO: Verificar permisos de usuario al cargar la página
      checkUserPermissions();
      
      setIsLoading(false);

      // Limpiar localStorage al iniciar
      localStorage.removeItem('queryOrderDetails');

      // Inicializar state con valores vacíos
      setQueryOrderDetails([]);
      setDataOrden([]);
      setIsReadOnly(false);
      setIsOperationsSigned(false); // 🆕 Reset del estado de firma
    };

    fetchData();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleQuerySubmit = (response) => {
    if (response) {
      const data = response;

      // 🆕 NUEVO: Verificar firma de operaciones al cargar datos
      const operationsSigned = checkOperationsSignature(data);
      setIsOperationsSigned(operationsSigned);

      // 🆕 NUEVO: Guardar datos originales para referencia
      setOriginalData({ ...data });
      setTempEditData({ ...data });

      // 🆕 NUEVO: Si está firmado por operaciones, forzar modo lectura
      const readOnlyMode = operationsSigned ? true : true; // Por defecto inicia en modo lectura
      setIsReadOnly(readOnlyMode);

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
      setHasUnsavedChanges(false);

      // 🆕 NUEVO: Mostrar alerta si la orden está firmada por operaciones o no tiene permisos
      if (operationsSigned) {
        Swal.fire({
          title: 'Orden de Trabajo Cerrada',
          html: `
            <div style="text-align: left; font-family: system-ui, -apple-system, sans-serif;">
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <svg style="width: 24px; height: 24px; color: #dc2626; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span style="font-weight: 600; color: #dc2626; font-size: 16px;">ORDEN COMPLETADA</span>
                </div>
                <p style="margin-bottom: 8px; color: #374151;">Esta orden de trabajo ya ha sido <strong>firmada por operaciones</strong> y se encuentra cerrada.</p>
              </div>
            </div>
          `,
          icon: 'warning',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#EF4444',
          allowOutsideClick: false,
          customClass: {
            popup: 'swal-wide'
          }
        });
      } else if (!hasEditPermission) {
        // 🆕 NUEVO: Mostrar alerta si no tiene permisos de edición
        Swal.fire({
          title: 'Acceso Solo de Consulta',
          html: `
            <div style="text-align: left; font-family: system-ui, -apple-system, sans-serif;">
              <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <svg style="width: 24px; height: 24px; color: #d97706; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span style="font-weight: 600; color: #d97706; font-size: 16px;">MODO SOLO CONSULTA</span>
                </div>
                <p style="margin-bottom: 8px; color: #374151;">Su rol de usuario <strong>solo permite consultar</strong> órdenes de trabajo.</p>
                <p style="color: #6b7280; font-size: 14px;">Para editar órdenes, contacte al administrador del sistema.</p>
              </div>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#3B82F6',
          allowOutsideClick: false,
          customClass: {
            popup: 'swal-wide'
          }
        });
      }
    } else {
      alert("No se encontraron detalles de la orden.");
    }
  };

  // 🆕 MODIFICADA: Función para alternar entre modo lectura y edición con validación de permisos
  const toggleEditMode = () => {
    // 🆕 NUEVO: Verificar permisos de usuario primero
    if (!hasEditPermission) {
      Swal.fire({
        title: 'Sin Permisos de Edición',
        html: `
          <div style="text-align: left; font-family: system-ui, -apple-system, sans-serif;">
            <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <svg style="width: 24px; height: 24px; color: #d97706; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                </svg>
                <span style="font-weight: 600; color: #d97706; font-size: 16px;">ACCESO DENEGADO</span>
              </div>
              <p style="margin-bottom: 8px; color: #374151;">Su rol de usuario <strong>no tiene permisos</strong> para editar órdenes de trabajo.</p>
              <p style="color: #6b7280; font-size: 14px;">Solo los usuarios con rol de administrador pueden modificar las órdenes.</p>
            </div>  
          </div>
        `,
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#F59E0B',
        customClass: {
          popup: 'swal-wide'
        }
      });
      return;
    }

    // 🆕 NUEVO: Verificar si la orden está firmada por operaciones
    if (isOperationsSigned && isReadOnly) {
      Swal.fire({
        title: 'Edición No Permitida',
        html: `
          <div style="text-align: left; font-family: system-ui, -apple-system, sans-serif;">
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <svg style="width: 24px; height: 24px; color: #dc2626; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                </svg>
                <span style="font-weight: 600; color: #dc2626; font-size: 16px;">ACCESO DENEGADO</span>
              </div>
              <p style="margin-bottom: 8px; color: #374151;">Esta orden de trabajo ya está <strong>firmada por operaciones</strong>.</p>
            </div>  
          </div>
        `,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#EF4444',
        customClass: {
          popup: 'swal-wide'
        }
      });
      return;
    }

    if (!isReadOnly && hasUnsavedChanges) {
      const confirmExit = window.confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres salir del modo edición?");
      if (!confirmExit) {
        return;
      }
      // Si cancela, restaurar datos originales
      setTempEditData({ ...originalData });
      setDataOrden({ ...originalData });
    }

    setIsReadOnly(!isReadOnly);

    // 🆕 NUEVO: Al entrar en modo edición, inicializar tempEditData
    if (isReadOnly) {
      setTempEditData({ ...dataOrden });
    }
  };

  // 🆕 NUEVO: Función mejorada para detectar y manejar cambios
  const handleDataChange = (field, value) => {
    console.log(`Cambio detectado en campo: ${field} = ${value}`);

    // Actualizar los datos temporales
    setTempEditData(prev => ({
      ...prev,
      [field]: value
    }));

    // Actualizar dataOrden para que se refleje inmediatamente en la UI
    setDataOrden(prev => ({
      ...prev,
      [field]: value
    }));

    setHasUnsavedChanges(true);
  };

  // 🆕 NUEVO: Función para obtener los datos actuales (originales o editados)
  const getCurrentData = () => {
    return isReadOnly ? dataOrden : tempEditData;
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
        </div>
      );
    }

    // 🆕 NUEVO: Usar datos actuales (originales o editados)
    const currentData = getCurrentData();

    switch (currentSection) {
      case "cliente":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <ClientInfoForm
              data={currentData}
              isReadOnly={isReadOnly}
              onChange={handleDataChange}
            />
          </section>
        );
      case "tipo":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <OrderTypeSelector
              data={currentData}
              options={options}
              isReadOnly={isReadOnly}
              onChange={handleDataChange}
            />
          </section>
        );
      case "config":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <ConfigSection
              data={currentData}
              isReadOnly={isReadOnly}
              onChange={handleDataChange}
            />
          </section>
        );
      case "detalles":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <DetailsSection
              data={currentData}
              isReadOnly={isReadOnly}
              onChange={handleDataChange}
            />
          </section>
        );
      case "cobertura":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <CoverageSection
              data={currentData}
              isReadOnly={isReadOnly}
              onChange={handleDataChange}
            />
          </section>
        );
      case "envio":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <InformationSendSection
              data={currentData}
              isReadOnly={isReadOnly}
              onChange={handleDataChange}
            />
          </section>
        );
      case "medios":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <MonitoringMediaSection
              data={currentData}
              isReadOnly={isReadOnly}
              onChange={handleDataChange}
            />
          </section>
        );
      case "servicios":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <ContractedServicesSection
              data={currentData}
              isReadOnly={isReadOnly}
              onChange={handleDataChange}
            />
          </section>
        );
      case "gestion":
        return (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <CustomerManagementSection
              data={currentData}
              options={options}
              isReadOnly={isReadOnly}
              onChange={handleDataChange}
            />
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
      { header: 'Observaciones Cobertura', key: 'OBSERVACIONES_COBERTURA', width: 40 },
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

    // 🆕 NUEVO: Usar datos actuales para exportar
    const currentData = getCurrentData();
    const ordenes = Array.isArray(currentData) ? currentData : [currentData];

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
        'OBSERVACIONES_COBERTURA': order['OBSERVACIONES_COBERTURA'] || '',
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

    // Formatear columnas monetarias (ajustadas por la nueva columna)
    ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'X'].forEach(col => {
      worksheet.getColumn(col).numFmt = '"$"#,##0.00';
    });

    // Formatear columnas de fechas (ajustadas por la nueva columna)
    ['F', 'U', 'V'].forEach(col => {
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

  // 🆕 MODIFICADA: Función handleSaveChanges con notificación por email integrada
  const handleSaveChanges = async () => {
    try {
      // 🆕 NUEVO: Verificar permisos antes de guardar
      if (!hasEditPermission) {
        Swal.fire({
          title: 'Sin Permisos',
          text: 'No tiene permisos para guardar cambios en las órdenes de trabajo.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#EF4444'
        });
        return;
      }

      // Mostrar loading durante el guardado
      const loadingAlert = Swal.fire({
        title: 'Guardando cambios...',
        text: 'Por favor espere mientras se actualizan los datos',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // NUEVO: Obtener información del usuario desde localStorage
      const userInfo = {
        userId: localStorage.getItem('vc_user_id') || null,
        userName: localStorage.getItem('vc_nombre') || 'Usuario',
        userRole: localStorage.getItem('vc_role_name') || 'Sin rol',
        userEmail: localStorage.getItem('vc_username') || 'sin-email@globalnews.com.co'
      };

      console.log('Información del usuario desde localStorage:', userInfo);

      // NUEVO: Preparar datos para guardar incluyendo información del usuario
      const dataToSave = {
        ...tempEditData,
        // Incluir información del usuario para el email en el backend
        userId: userInfo.userId,
        userName: userInfo.userName,
        userRole: userInfo.userRole,
        userEmail: userInfo.userEmail
      };

      console.log('Guardando datos con información de usuario:', dataToSave);

      // NUEVO: Detectar campos modificados para mostrar en el mensaje de confirmación
      const changedFields = detectChangedFields(originalData, tempEditData);
      console.log('Campos modificados:', changedFields);

      // Usar la función updateOT del archivo de conexiones
      const response = await updateOT(dataToSave);

      // Cerrar el loading
      loadingAlert.close();
      if (response) {
        // Éxito - Alerta simplificada
        await Swal.fire({
          title: '¡Actualización Exitosa!',
          text: `La orden de trabajo se ha actualizado correctamente${changedFields.length > 0 ? `. Se modificaron ${changedFields.length} campo(s)` : ''
            }${response.emailNotificationSent ? '. Se envió notificación por email.' : ''
            }`,
          icon: 'success',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#10B981',
          timer: 3000,
          timerProgressBar: true
        });

        // NUEVO: Actualizar datos originales después del guardado exitoso
        setOriginalData({ ...tempEditData });
        setDataOrden({ ...tempEditData });
        setQueryOrderDetails({ ...tempEditData });

        // Reset del estado de cambios
        setHasUnsavedChanges(false);

        // Cambiar a modo lectura después de guardar
        setIsReadOnly(true);

      } else {
        throw new Error('No se recibió respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);

      // Error
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || error.message || 'Error al actualizar la orden de trabajo',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const detectChangedFields = (originalData, newData) => {
    const changedFields = [];
    const fieldsToCheck = {
      'NOMBRE CLIENTE': 'Nombre del Cliente',
      'NOMBRE ANUNCIANTE': 'Nombre del Anunciante',
      'TIPO OT': 'Tipo de OT',
      'COBERTURA': 'Cobertura',
      'OBSERVACIONES_COBERTURA': 'Observaciones de Cobertura',
      'ALERTAS CORREOS': 'Correos de Alertas',
      'NEWSLETERS CORREOS': 'Correos de Boletines',
      'PERSONA COMERCIAL': 'Director Comercial',
      'PERSONA SERVICIO AL CLIENTE': 'Servicio al Cliente',
      'VALOR IMPRESOS': 'Valor Impresos',
      'VALOR RADIO': 'Valor Radio',
      'VALOR TELEVISION': 'Valor Televisión',
      'VALOR INTERNET': 'Valor Internet',
      'VALOR ANALISIS': 'Valor Análisis',
      'VALOR SOCIAL': 'Valor Social',
      'VIGENCIA DESDE': 'Vigencia Desde',
      'VIGENCIA HASTA': 'Vigencia Hasta',
      'USUARIOS': 'Usuarios',
      'Observaciones': 'Observaciones',
      'WHATSAPP': 'WhatsApp',
      // Agregar más campos según sea necesario
    };

    for (const [field, displayName] of Object.entries(fieldsToCheck)) {
      // Comparar valores, considerando undefined, null y strings vacías como equivalentes
      const originalValue = originalData[field] || '';
      const newValue = newData[field] || '';

      if (originalValue !== newValue) {
        changedFields.push(displayName);
      }
    }

    return changedFields;
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres cancelar?");
      if (!confirmCancel) {
        return;
      }
    }

    // NUEVO: Restaurar datos originales
    setTempEditData({ ...originalData });
    setDataOrden({ ...originalData });
    setHasUnsavedChanges(false);
    setIsReadOnly(true);
  };

  return (
    <main className="flex min-h-screen">
      <Bar className="w-1/6 min-h-screen" />
      <div className="flex-1 p-6">
        {isModalOpen && <Modal onClose={handleModalClose} queryType="OT" onSubmit={handleQuerySubmit} />}

        {/* Header */}
        <div className="p-5 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl tracking-wide">CONSULTA ORDEN DE TRABAJO</h3>
              {hasUnsavedChanges && (
                <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
                  Cambios sin guardar
                </span>
              )}
              {/* 🆕 NUEVO: Indicador de permisos de usuario */}
              {!hasEditPermission && (
                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Solo Consulta
                </span>
              )}
              {/* 🆕 NUEVO: Indicador de orden firmada por operaciones */}
              {isOperationsSigned && (
                <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  OT Cerrada - Firmada por Operaciones
                </span>
              )}
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                className="bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
                onClick={() => setIsModalOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Consultar OT
              </button>

              {/* 🆕 MODIFICADO: Botón para alternar entre modo lectura y edición con validación de permisos */}
              {dataOrden && Object.keys(dataOrden).length > 0 && (
                <button
                  className={`py-2 px-5 rounded-md transition-colors duration-200 font-medium flex items-center ${!hasEditPermission || isOperationsSigned
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : isReadOnly
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  onClick={toggleEditMode}
                  disabled={!hasEditPermission || isOperationsSigned}
                  title={
                    !hasEditPermission 
                      ? 'No tiene permisos para editar' 
                      : isOperationsSigned 
                        ? 'No se puede editar - Orden firmada por operaciones' 
                        : ''
                  }
                >
                  {isReadOnly ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {!hasEditPermission 
                        ? 'Sin Permisos de Edición' 
                        : isOperationsSigned 
                          ? 'Edición Bloqueada' 
                          : 'Habilitar Edición'
                      }
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Cambiar a Lectura
                    </>
                  )}
                </button>
              )}

              {/* 🆕 MODIFICADO: Botones de acción en modo edición - solo si tiene permisos y no está firmado por operaciones */}
              {!isReadOnly && hasEditPermission && !isOperationsSigned && dataOrden && Object.keys(dataOrden).length > 0 && (
                <>
                  <button
                    className="bg-red-500 text-white py-2 px-5 rounded-md hover:bg-red-600 transition-colors duration-200 font-medium flex items-center"
                    onClick={handleCancelEdit}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancelar
                  </button>
                  <button
                    className={`py-2 px-5 rounded-md transition-colors duration-200 font-medium flex items-center ${hasUnsavedChanges
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-green-400 text-white cursor-not-allowed'
                      }`}
                    onClick={handleSaveChanges}
                    disabled={!hasUnsavedChanges}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Cambios
                  </button>
                </>
              )}

              {/* Botón de exportar */}
              {dataOrden && Object.keys(dataOrden).length > 0 && (
                <button
                  className="bg-emerald-600 text-white py-2 px-5 rounded-md hover:bg-emerald-700 transition-colors duration-200 font-medium flex items-center"
                  onClick={exportarExcel}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar Excel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-b-lg">
          {/* Navegación de secciones */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            {/* 🆕 MODIFICADO: Mostrar indicador del modo actual con información adicional */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-3">
                {isReadOnly ? (
                  <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Modo Lectura
                  </div>
                ) : (
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modo Edición
                  </div>
                )}

                {/* 🆕 NUEVO: Indicador adicional si está firmado por operaciones */}
                {isOperationsSigned && (
                  <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Orden Completada
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {!hasEditPermission
                  ? "Su rol de usuario solo permite consultar órdenes de trabajo"
                  : isOperationsSigned
                    ? "Orden de trabajo completada y cerrada - No se permiten modificaciones"
                    : isReadOnly
                      ? "Los campos están bloqueados para edición"
                      : "Puede modificar los campos del formulario"
                }
              </p>
            </div>

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
            <FooterBar data={getCurrentData()} />
          </div>
        </div>
      </div>
    </main>
  );
}