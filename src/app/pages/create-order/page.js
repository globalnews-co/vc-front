'use client';

import { useEffect, useContext } from "react";
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
  const { createOrderDetails, setCreateOrderDetails, setClients, options, setOptions, setClientName, setNombreAnunciante, nombreAnunciante,
    setNitCliente, setSuggestions, setActiveSuggestionIndex,
    setUsuarios, setCorreccion, setAnalisis,
    setCheckedValuesServicios, setCheckedValuesCobertura, setValuesCobertura,
    setDirectorComercial, setServicioAlCliente, setComentariosDetalle,
    setMarca, setCompetencias, setEntorno, setSectores, setCategoria,
    setCorreosAlertas, setCorreosBoletines,
    setCheckedValues, setValues, setStartDate, setEndDate, setDays,
    setTotalFee, setTotalContractedValue,
    setTipoOt, setActividad, setFacturacion } = useContext(DataContext);

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

  const isFormValid = () => {
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
      return !value || value === null;
    });

    return missingFields;
  };



  // Función para resetear el formulario
  const handleReset = () => {
    // Reset createOrderDetails
    setCreateOrderDetails({
      NombreCliente: '',
      nombreAnunciante: '',
      Tipo_Ot: '',
      Cobertura: '',
      Correos_Alertas: '',
      Correos_Boletines: '',
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
      NombreAnunciante: ''
    });

    // Reset specific states from various components

    // ClientInfoForm states
    setNombreAnunciante('')
    setClientName('');
    setNitCliente('');
    setSuggestions([]);
    setActiveSuggestionIndex(0);

    // ConfigSection states
    setUsuarios('');
    setCorreccion('');
    setAnalisis('');

    // ContractedServicesSection states
    setCheckedValuesServicios({
      Alertas: false,
      Clippin: false,
      Catalogo: false,
      Análisis: false
    });

    // CoverageSection states
    setCheckedValuesCobertura({
      Nacional: false,
      Cartagena: false,
      Palmira: false,
      Tulua: false,
      Buga: false,
      Internacional: false
    });
    setValuesCobertura('');

    // CustomerManagementSection states
    setDirectorComercial('');
    setServicioAlCliente('');
    setComentariosDetalle('');

    // DetailsSection states
    setMarca('');
    setCompetencias('');
    setEntorno('');
    setSectores('');
    setCategoria('');

    // InformationSendSection states
    setCorreosAlertas('');
    setCorreosBoletines('');

    // MonitoringMediaSection states
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

    // OrderTypeSelector states
    setTipoOt('');
    setActividad('');
    setFacturacion('');

  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
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
        title: 'Datos Erroneos',
        text: `Por favor revise los datos de Vigencia de Contrato. Valor de días: ${createOrderDetails.Total_Dias}`,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Si no hay campos faltantes, intentar enviar los datos
    try {
      // Guardar en el localStorage
      localStorage.setItem('createOrderDetails', JSON.stringify(createOrderDetails));

      // Enviar datos
      const response = await sendData(createOrderDetails);

      if (response.insertedId) {
        Swal.fire({
          title: 'Orden de trabajo creada',
          text: 'ID de la orden de trabajo: ' + response.insertedId,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Recargar la página después de que el usuario presione "OK" en el SweetAlert
          window.location.reload();
        });

        // Restablecer el formulario después del éxito
        handleReset();
      }
    } catch (err) {
      // En caso de error al enviar los datos
      Swal.fire({
        title: 'Error',
        text: 'Error al insertar datos',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.log('Error:', err);
    }
  };


  return (
    <main className="flex min-h-screen">
      <Bar />
      <div className="flex-1 flex justify-center items-start p-10">
        <div className="border p-6 rounded-lg shadow-lg w-full max-w-6xl">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold mb-4">CREAR ORDEN DE TRABAJO</h3>
            <div>
              <button className="bg-red-500 m-2 text-white py-2 px-4 rounded" onClick={handleReset}>Resetear OT</button>

            </div>
          </div>
          <ClientInfoForm clientData={createOrderDetails} handleChange={handleChange} isReadOnly={false} />
          <OrderTypeSelector data={createOrderDetails} options={options} isReadOnly={false} />
          <ConfigSection data={createOrderDetails} handleChange={handleChange} isReadOnly={false} />
          <DetailsSection data={createOrderDetails} handleChange={handleChange} isReadOnly={false} />
          <CoverageSection data={createOrderDetails} handleChange={handleChange} isReadOnly={false} />
          <InformationSendSection data={createOrderDetails} handleChange={handleChange} isReadOnly={false} />
          <MonitoringMediaSection data={createOrderDetails} handleChange={handleChange} isReadOnly={false} />
          <ContractedServicesSection data={createOrderDetails} handleChange={handleChange} isReadOnly={false} />
          <CustomerManagementSection data={createOrderDetails} options={options} isReadOnly={false} />
          <button className="bg-brightBlue m-2 text-white py-2 px-4 rounded" onClick={handleSubmit}>Enviar OT</button>
        </div>
      </div>
    </main>
  );
}
