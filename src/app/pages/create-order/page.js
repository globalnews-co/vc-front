'use client';

import { useEffect, useContext, useState } from "react";
import Bar from "../../components/Bar";
import ClientInfoForm from "../../components/order/ClientInfoForm";
import OrderTypeSelector from "../../components/order/OrderTypeSelector";
import ConfigSection from "../../components/order/ConfigSection";
import DetailsSection from "../../components/order/DetailsSection";
import CoverageSection from "../../components/order/CoverageSection";
import InformationSendSection from "../../components/order/InformationSendSection";
import MonitoringMediaSection from "../../components/order/MonitoringMediaSection";
import ContractedServicesSection from "../../components/order/ContractedServicesSection";
import CustomerManagementSection from "../../components/order/CustomerManagementSection";
import { DataContext } from "src/app/pages/context/DataContext";
import { fetchClientes, fetchOptions, sendData } from "src/Utilities/Conexion";
import Swal from 'sweetalert2';

export default function CreateOrder() {
  // Estado para controlar la paginación
  const [currentStep, setCurrentStep] = useState(1);

  // Definición de los pasos
  const steps = [
    { id: 1, name: "Información del Cliente", icon: "user" },
    { id: 2, name: "Tipo de Orden", icon: "file-text" },
    { id: 3, name: "Configuración", icon: "settings" },
    { id: 4, name: "Detalles", icon: "list" },
    { id: 5, name: "Cobertura e Información", icon: "map-pin" },
    { id: 6, name: "Medios de Monitoreo", icon: "monitor" },
    { id: 7, name: "Servicios Contratados", icon: "package" },
    { id: 8, name: "Gestión de Cliente", icon: "users" }
  ];

  // Contexto de datos
  const {
    createOrderDetails,
    setCreateOrderDetails,
    setClients,
    options,
    setOptions,
    setClientName,
    setNombreAnunciante,
    nombreAnunciante,
    setNitCliente,
    setSuggestions,
    setActiveSuggestionIndex,
    setUsuarios,
    setCorreccion,
    setAnalisis,
    setCheckedValuesServicios,
    setCheckedValuesCobertura,
    setValuesCobertura,
    setDirectorComercial,
    setServicioAlCliente,
    setComentariosDetalle,
    setMarca,
    setCompetencias,
    setEntorno,
    setSectores,
    setCategoria,
    setCorreosAlertas,
    setCorreosBoletines,
    setCheckedValues,
    setValues,
    setStartDate,
    setEndDate,
    setDays,
    setTotalFee,
    setTotalContractedValue,
    setTipoOt,
    setActividad,
    setFacturacion
  } = useContext(DataContext);

  // Efecto para obtener datos de clientes y opciones cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const optionsResponse = await fetchOptions();
        setOptions(optionsResponse);

        const clientsResponse = await fetchClientes();
        setClients(clientsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setOptions, setClients]);

  // Efecto para almacenar los detalles de la orden en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('createOrderDetails', JSON.stringify(createOrderDetails));
    }
  }, [createOrderDetails]);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // 🔧 FUNCIÓN DE VALIDACIÓN MEJORADA
  const isFormValid = () => {
    console.log('🔍 Validando formulario con createOrderDetails:', createOrderDetails);
    
    const requiredFields = [
      "NombreCliente",
      "Nombre_Anunciante",
      "Tipo_Ot",
      "Cobertura",
      "Correos_Alertas",
      "Correos_Boletines",
      "Usuarios",
      "Correccion",
      "Analisis",
      "Marca",
      "Competencias",
      "Entorno",
      "Sectores",
      "Categoria",
      "Servicios_Contratados",
      "Director_Comercial",
      "Servicio_Al_Cliente",
      "Total_Valor",
      "Vigencia_Desde",
      "Vigencia_Hasta",
      "Total_Dias",
      "Total_Valor_Dias",
      "Actividad"
    ];

    const missingFields = requiredFields.filter(field => {
      const value = createOrderDetails[field];
      
      // Para campos específicos de correos, validación más específica
      if (field === "Correos_Alertas" || field === "Correos_Boletines") {
        const isEmpty = !value || value === null || value === "" || value === undefined || value.trim() === "";
        
        console.log(`🔍 Validando ${field}:`, {
          value,
          type: typeof value,
          isEmpty,
          trimmed: value?.trim?.() || 'N/A'
        });
        
        return isEmpty;
      }

      // Validación general para otros campos
      const isEmpty = !value || value === null || value === "" || value === undefined;
      return isEmpty;
    });

    console.log('🔍 Campos faltantes:', missingFields);
    return missingFields;
  };

  const handleReset = () => {
    const resetDetails = {
      NombreCliente: '',
      nombreAnunciante: '',
      Tipo_Ot: '',
      Cobertura: '',
      COBERTURA: '',
      Observaciones_Cobertura: '',
      OBSERVACIONES_COBERTURA: '',
      Correos_Alertas: '',
      Correos_Boletines: '',
      CONTACTOS_ALERTAS: '',
      CONTACTOS_BOLETINES: '',
      Usuarios: '',
      Correccion: '',
      Analisis: '',
      Marca: '',
      Competencias: '',
      Entorno: '',
      Sectores: '',
      Categoria: '',
      Servicios_Contratados: '',
      Director_Comercial: '',
      Servicio_Al_Cliente: '',
      Comentarios_Detalle: '',
      Valor_Impresos: 0,
      Valor_Radio: 0,
      Valor_Television: 0,
      Valor_Internet: 0,
      Valor_Analisis: 0,
      Valor_Social: 0,
      Total_Valor: 0,
      Vigencia_Desde: '',
      Vigencia_Hasta: '',
      Total_Dias: 0,
      Total_Valor_Dias: 0,
      Creacion_fecha_Ot: '',
      Actividad: '',
      Orden_ID: '',
      NombreAnunciante: '',
      MEDIOS_INTERNACIONALES: ''
    };

    console.log('🔄 Reseteando createOrderDetails:', resetDetails);
    setCreateOrderDetails(resetDetails);

    // Reset específico de estados del contexto
    setNombreAnunciante('');
    setClientName('');
    setNitCliente('');
    setSuggestions([]);
    setActiveSuggestionIndex(0);
    setUsuarios('');
    setCorreccion('');
    setAnalisis('');
    setCheckedValuesServicios({
      Alertas: false,
      Clippin: false,
      Catalogo: false,
      Análisis: false,
      'Social Media': false,
      'Correción': false
    });
    setCheckedValuesCobertura({
      Nacional: false,
      Cartagena: false,
      Palmira: false,
      Tulua: false,
      Buga: false,
      Internacional: false
    });
    setValuesCobertura('');
    setDirectorComercial('');
    setServicioAlCliente('');
    setComentariosDetalle('');
    setMarca('');
    setCompetencias('');
    setEntorno('');
    setSectores('');
    setCategoria('');
    setCorreosAlertas('');
    setCorreosBoletines('');
    setCheckedValues({
      IMPRESOS: true,
      RADIO: true,
      TELEVISION: true,
      INTERNET: true,
      ANALISIS: true,
      SOCIAL: true
    });
    setValues({
      IMPRESOS: 0,
      RADIO: 0,
      TELEVISION: 0,
      INTERNET: 0,
      ANALISIS: 0,
      SOCIAL: 0
    });
    setDays(0);
    setTotalFee(0);
    setTotalContractedValue(0);
    setTipoOt('');
    setActividad('');
    setFacturacion('');

    setCurrentStep(1);
  };

  // 🔧 FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO (MEJORADA)
  const handleSubmit = async () => {
    console.log('🚀 Iniciando envío del formulario');
    console.log('📋 Estado actual createOrderDetails:', createOrderDetails);
    
    const missingFields = isFormValid();

    // Verificación específica para 'Total_Dias' o 'Total_Valor_Dias'
    if (missingFields.includes('Total_Dias') || missingFields.includes('Total_Valor_Dias')) {
      if (createOrderDetails.Total_Dias != 0) {
        Swal.fire({
          title: 'Datos incompletos',
          text: `Verifique los días de contrato o el valor total por días.`,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }
    }

    // Verificación general de campos faltantes
    if (missingFields.length > 0) {
      console.log('❌ Campos faltantes encontrados:', missingFields);
      Swal.fire({
        title: 'Datos incompletos',
        text: `Por favor complete los siguientes campos requeridos: ${missingFields.join(', ')}`,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (createOrderDetails.Total_Dias < 0) {
      Swal.fire({
        title: 'Datos Erróneos',
        text: `Por favor revise los datos de Vigencia de Contrato. Valor de días: ${createOrderDetails.Total_Dias}`,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Si no hay campos faltantes, intentar enviar los datos
    try {
      console.log('📝 Enviando OT con observaciones de cobertura:', {
        observaciones: createOrderDetails.Observaciones_Cobertura,
        longitud: createOrderDetails.Observaciones_Cobertura?.length || 0,
        tieneObservaciones: !!createOrderDetails.Observaciones_Cobertura
      });

      // Guardar en el localStorage
      localStorage.setItem('createOrderDetails', JSON.stringify(createOrderDetails));

      // Preparar datos para envío
      const dataToSend = {
        ...createOrderDetails,
        'OBSERVACIONES_COBERTURA': createOrderDetails.Observaciones_Cobertura || '',
        'Observaciones_Cobertura': createOrderDetails.Observaciones_Cobertura || ''
      };

      console.log('📧 Datos de correos a enviar:', {
        'Correos_Alertas': dataToSend.Correos_Alertas,
        'Correos_Boletines': dataToSend.Correos_Boletines,
        'CONTACTOS_ALERTAS': dataToSend.CONTACTOS_ALERTAS,
        'CONTACTOS_BOLETINES': dataToSend.CONTACTOS_BOLETINES
      });

      // Enviar datos
      const response = await sendData(dataToSend);

      if (response.insertedId) {
        const successMessage = createOrderDetails.Observaciones_Cobertura
          ? `Orden de trabajo creada con observaciones de cobertura incluidas.\nID: ${response.insertedId}`
          : `Orden de trabajo creada exitosamente.\nID: ${response.insertedId}`;

        Swal.fire({
          title: 'Orden de trabajo creada',
          text: successMessage,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.reload();
        });

        handleReset();
      }
    } catch (err) {
      console.error('❌ Error al crear OT:', err);
      Swal.fire({
        title: 'Error',
        text: 'Error al insertar datos',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Función para ir a un paso específico
  const goToStep = (step) => {
    setCurrentStep(step);
  };

  // Función para ir al siguiente paso
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  // Función para ir al paso anterior
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Renderizar icono para cada paso
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

  // 🔧 FUNCIÓN MEJORADA PARA MANEJAR CAMBIOS DE COMPONENTES
  const handleComponentChange = (field, value) => {
    console.log(`📝 Cambio en ${field}:`, value);
    
    setCreateOrderDetails((prevDetails) => {
      const newDetails = {
        ...prevDetails,
        [field]: value,
      };
      
      console.log('📋 Nuevo estado createOrderDetails:', newDetails);
      return newDetails;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ClientInfoForm clientData={createOrderDetails} handleChange={handleChange} isReadOnly={false} />;
      case 2:
        return <OrderTypeSelector data={createOrderDetails} options={options} isReadOnly={false} />;
      case 3:
        return <ConfigSection data={createOrderDetails} handleChange={handleChange} isReadOnly={false} />;
      case 4:
        return <DetailsSection data={createOrderDetails} handleChange={handleChange} isReadOnly={false} />;
      case 5:
        return (
          <>
            <CoverageSection
              data={createOrderDetails}
              handleChange={handleChange}
              onChange={handleComponentChange}
              isReadOnly={false}
            />
            <InformationSendSection
              data={createOrderDetails}
              handleChange={handleChange}
              onChange={handleComponentChange}
              isReadOnly={false}
            />
          </>
        );
      case 6:
        return <MonitoringMediaSection data={createOrderDetails} handleChange={handleChange} isReadOnly={false} />;
      case 7:
        return (
          <ContractedServicesSection
            data={createOrderDetails}
            handleChange={handleChange}
            onChange={handleComponentChange}
            isReadOnly={false}
          />
        );
      case 8:
        return <CustomerManagementSection data={createOrderDetails} options={options} isReadOnly={false} />;
      default:
        return null;
    }
  };

  // 🔧 EFECTO PARA DEBUGGING
  useEffect(() => {
    console.log('🔄 createOrderDetails actualizado:', createOrderDetails);
    console.log('📧 Correos_Alertas actual:', createOrderDetails.Correos_Alertas);
    console.log('📧 Correos_Boletines actual:', createOrderDetails.Correos_Boletines);
  }, [createOrderDetails]);

  // Calcular el porcentaje de progreso
  const progressPercent = ((currentStep) / steps.length) * 100;

  return (
    <main className="flex">
      <Bar />
      <div className="flex-1 m-6">
        <div className="max-w-10xl mx-auto">
          <div className="bg-white rounded-lg overflow-hidden border-gray-100">
            {/* Cabecera */}
            <div className="px-6 py-5 border-b flex justify-between items-center">
              <h1 className="text-2xl flex items-center">
                CREAR ORDEN DE TRABAJO
              </h1>
              <button
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 px-4 rounded-md flex items-center transition-all"
                onClick={handleReset}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Resetear OT
              </button>
            </div>

            {/* Indicador de progreso y step pills */}
            <div className="px-6 pt-5 bg-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex items-center mb-4 md:mb-0">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-semibold mr-3">
                    {currentStep}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {steps[currentStep - 1].name}
                  </span>
                </div>
                <div className="flex my-4">
                  <div className="inline-flex px-4 py-2.5 bg-white border-l-4 border-blue-600 rounded border-gray-200 shadow-sm text-sm font-medium text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-gray-700">
                      Seleccione los campos de la OT a utilizar
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 mr-3">
                    Paso {currentStep} de {steps.length}
                  </div>
                  <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    {Math.round(progressPercent)}% Completado
                  </div>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Navegación por pasos (versión escritorio) */}
            <div className="hidden md:block px-6 py-1">
              <div className="flex space-x-1 overflow-x-auto">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    className={`py-3 px-4 flex items-center rounded-md transition-all ${step.id === currentStep
                      ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`p-1.5 rounded-full mr-2 ${step.id === currentStep ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {renderIcon(step.icon)}
                    </div>
                    <span className="text-sm whitespace-nowrap">{step.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navegación por pasos (versión móvil) */}
            <div className="block md:hidden px-6 py-2">
              <div className="relative">
                <select
                  className="block w-full mt-1 pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                  value={currentStep}
                  onChange={(e) => goToStep(Number(e.target.value))}
                >
                  {steps.map((step) => (
                    <option key={step.id} value={step.id}>
                      {step.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-1"></div>

            {/* Contenido del formulario */}
            <div className="p-6 h-[600px] overflow-y-auto">
              <div className="bg-white rounded-lg">
                {renderStepContent()}
              </div>
            </div>

            {/* Controles de navegación */}
            <div className="px-6 py-5 bg-gray-50 border-t flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`py-2.5 px-6 rounded-md flex items-center transition-all ${currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Anterior
              </button>

              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-md flex items-center transition-all shadow-sm"
                >
                  Siguiente
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white py-2.5 px-6 rounded-md flex items-center transition-all shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Enviar OT
                </button>
              )}
            </div>

            {/* Información de paso actual (móvil) */}
            <div className="md:hidden px-6 py-3 bg-gray-50 border-t">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Paso {currentStep} de {steps.length}</span>
                <span>{Math.round(progressPercent)}% Completado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}