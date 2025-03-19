'use client';

import { createContext, useState, useRef, useEffect } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const isBrowser = typeof window !== "undefined";

  const initialCreateClientData = {
    NombreCliente: "",
    Cliente_ID: "",
    Nit_Cliente: "",
    FechaCreacionCliente: "",
    Direccion: "",
    Telefono: "",
    Correo_Electronico: "",
    Persona_de_Contacto: "",
    Detalle_Especiales: "",
    Celular: "",
    Actividad: "",
    Pagador: "",
    Cumpleaños: "",
    Ciudad: "",
    Tipo: ""
  };

  const [createClientData, setCreateClientData] = useState(() => {
    return isBrowser ? JSON.parse(localStorage.getItem('createClientData')) || initialCreateClientData : initialCreateClientData;
  });

  const [queryClientData, setQueryClientData] = useState(() => {
    return isBrowser ? JSON.parse(localStorage.getItem('queryClientData')) || {} : {};
  });

  const initialCreateOrderDetails = {
    NombreCliente: '',
    Nombre_Anunciante: '',
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
    Valor_Impresos: '',
    Valor_Radio: '',
    Valor_Television: '',
    Valor_Internet: '',
    Valor_Analisis: '',
    Valor_Social: '',
    Total_Valor: '',
    Vigencia_Desde: '',
    Vigencia_Hasta: '',
    Total_Dias: '',
    Total_Valor_Dias: '',
    Creacion_fecha_Ot: '',
    Actividad: '',
    Orden_ID: ''
  };

  const [createOrderDetails, setCreateOrderDetails] = useState(() => {
    return isBrowser ? JSON.parse(localStorage.getItem('createOrderDetails')) || initialCreateOrderDetails : initialCreateOrderDetails;
  });

  const [queryOrderDetails, setQueryOrderDetails] = useState(() => {
    return isBrowser ? JSON.parse(localStorage.getItem('queryOrderDetails')) || {} : {};
  });

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('createClientData', JSON.stringify(createClientData));
      localStorage.setItem('queryClientData', JSON.stringify(queryClientData));
      localStorage.setItem('createOrderDetails', JSON.stringify(createOrderDetails));
      localStorage.setItem('queryOrderDetails', JSON.stringify(queryOrderDetails));
    }
  }, [createClientData, queryClientData, createOrderDetails, queryOrderDetails]);

  // Otros estados
  const [directors] = useState(["pruebaaa", "prueba"]);
  const [customerServiceReps] = useState(["pruebaaa", "prueba"]);
  const [checkedValues, setCheckedValues] = useState({
    IMPRESOS: true,
    RADIO: true,
    TELEVISION: true,
    INTERNET: true,
    ANALISIS: true,
    SOCIAL: true,
  });
  
  const [values, setValues] = useState({
    impresos: 0,
    radio: 0,
    television: 0,
    internet: 0,
    analisis: 0,
    social: 0,
  });

  
  const [valuesCobertura, setValuesCobertura] = useState("");
  const [totalFee, setTotalFee] = useState(0);
  const [totalContractedValue, setTotalContractedValue] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(0);
  const [clientName, setClientName] = useState("");
  const [checkedValuesCobertura, setCheckedValuesCobertura] = useState({
    Nacional: false,
    Cartagena: false,
    Palmira: false,
    Tulua: false,
    Buga: false,
    Internacional: false,
  });
  const [valuesServicio, setValuesServicio] = useState("");
  const [checkedValuesServicios, setCheckedValuesServicios] = useState({
    Alertas: false,
    Clippin: false,
    Catalogo: false,
    Análisis: false,
  });
  const [tipoOt, setTipoOt] = useState("");
  const [numeroOt, setNumeroOt] = useState("");
  const [actividad, setActividad] = useState("");
  const [facturacion, setFacturacion] = useState("");
  const [correosAlertas, setCorreosAlertas] = useState("");
  const [nombreAnunciante, setNombreAnunciante] = useState("");
  const [correosBoletines, setCorreosBoletines] = useState("");
  const [directorComercial, setDirectorComercial] = useState("");
  const [servicioAlCliente, setServicioAlCliente] = useState("");
  const [comentariosDetalle, setComentariosDetalle] = useState("");
  const [queryOrderNumber, setQueryOrderNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState("");
  const [correccion, setCorreccion] = useState("");
  const [analisis, setAnalisis] = useState("");
  const [marca, setMarca] = useState("");
  const [competencias, setCompetencias] = useState("");
  const [entorno, setEntorno] = useState("");
  const [sectores, setSectores] = useState("");
  const [categoria, setCategoria] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [clients, setClients] = useState([]);
  const [nitCliente, setNitCliente] = useState("");
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [data, setData] = useState([]);
  const [clientNIT, setClientNIT] = useState("");
  const suggestionsRef = useRef(null);
  const [clientData, setClientData] = useState([]);
  const [options, setOptions] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [refreshClients, setRefreshClients] = useState(false); 

  return (
    <DataContext.Provider
      value={{
        clientData, setClientData,
        createClientData, setCreateClientData,
        queryClientData, setQueryClientData,
        orderDetails, setOrderDetails,
        createOrderDetails, setCreateOrderDetails,
        queryOrderDetails, setQueryOrderDetails,
        directors,
        customerServiceReps,
        checkedValues, setCheckedValues,
        values, setValues,
        valuesCobertura, setValuesCobertura,
        totalFee, setTotalFee,
        totalContractedValue, setTotalContractedValue,
        startDate, setStartDate,
        endDate, setEndDate,
        days, setDays,
        clientName, setClientName,
        checkedValuesCobertura, setCheckedValuesCobertura,
        valuesServicio, setValuesServicio,
        checkedValuesServicios, setCheckedValuesServicios,
        tipoOt, setTipoOt,
        numeroOt, setNumeroOt,
        actividad, setActividad,
        facturacion, setFacturacion,
        correosAlertas, setCorreosAlertas,
        nombreAnunciante, setNombreAnunciante,
        correosBoletines, setCorreosBoletines,
        directorComercial, setDirectorComercial,
        servicioAlCliente, setServicioAlCliente,
        comentariosDetalle, setComentariosDetalle,
        queryOrderNumber, setQueryOrderNumber,
        isModalOpen, setIsModalOpen,
        usuarios, setUsuarios,
        correccion, setCorreccion,
        analisis, setAnalisis,
        marca, setMarca,
        competencias, setCompetencias,
        entorno, setEntorno,
        sectores, setSectores,
        categoria, setCategoria,
        suggestions, setSuggestions,
        clients, setClients,
        nitCliente, setNitCliente,
        activeSuggestionIndex, setActiveSuggestionIndex,
        isReadOnly, setIsReadOnly,
        suggestionsRef, data,
        setData, setClientNIT, clientNIT,
        options, setOptions,
        refreshClients, setRefreshClients,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
