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

export default function QueryOrder() {
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
  const [dataOrden, setDataOrden] = useState([])

  useEffect(() => {
    let oldOrder = JSON.parse(localStorage.getItem('queryOrderDetails'))
    setIsLoading(false);
    const fetchData = async () => {
      const [optionsResponse, clientsResponse] = await Promise.all([fetchOptions(), fetchClientes()]);
      
      const ordenConsultada = await getOT(oldOrder['orden de trabajo'] ? oldOrder['orden de trabajo'] : oldOrder)
      setDataOrden(ordenConsultada)
      setOptions(optionsResponse);
      setClients(clientsResponse);
     
      setIsReadOnly(true)
    };

    if(oldOrder) {
      fetchData()
    } 
  }, [isModalOpen]);



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
      localStorage.setItem('queryOrderDetails', JSON.stringify(data));
    } else {
      alert("No se encontraron detalles de la orden.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-row min-h-screen bg-gradient-radial-custom">
      <Bar className="w-1/6 fixed top-0 left-0 h-full" />
      <div className="flex flex-col flex-1 items-center ml-1/6">
        {isModalOpen && <Modal onClose={handleModalClose} queryType="OT" onSubmit={handleQuerySubmit} />}
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-6xl p-10 mb-40">
          <div className="border p-6 rounded-lg shadow-lg w-full relative bg-white">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold mb-4">CONSULTA ORDEN DE TRABAJO</h3>
              <button className="bg-brightBlue m-2 text-white py-2 px-4 rounded" onClick={() => setIsModalOpen(true)}>Consultar O.T</button>
            </div>
            <ClientInfoForm data={dataOrden} isReadOnly={isReadOnly} />
            <OrderTypeSelector data={dataOrden} options={options} isReadOnly={isReadOnly} />
            <ConfigSection data={dataOrden} isReadOnly={isReadOnly} />
            <DetailsSection data={dataOrden} isReadOnly={isReadOnly} />
            <CoverageSection data={dataOrden} isReadOnly={isReadOnly} />
            <InformationSendSection data={dataOrden} isReadOnly={isReadOnly} />
            <MonitoringMediaSection data={dataOrden} isReadOnly={isReadOnly} />
            <ContractedServicesSection data={dataOrden} isReadOnly={isReadOnly} />
            <CustomerManagementSection data={dataOrden} options={options} isReadOnly={isReadOnly} />
          </div>
          <FooterBar data={queryOrderDetails} className="w-full max-w-5xl ml-8" />
        </div>
      </div>
    </main>
  );
}
