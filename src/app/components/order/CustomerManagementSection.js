import { useContext, useEffect } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const CustomerManagementSection = ({ data: dataSaved, isReadOnly, onChange }) => {
  const {
    createOrderDetails, setCreateOrderDetails,
    queryOrderDetails,
    directorComercial, setDirectorComercial,
    servicioAlCliente, setServicioAlCliente,
    comentariosDetalle, setComentariosDetalle,
    options, directors,
    customerServiceReps
  } = useContext(DataContext);

  const notifyChange = (field, value) => {
    if (onChange && typeof onChange === 'function') {
      onChange(field, value);
    }
  };

  const getCurrentValue = (field) => {
    if (dataSaved && dataSaved[field] !== undefined) {
      return dataSaved[field];
    }
    
    switch (field) {
      case 'PERSONA COMERCIAL':
        return directorComercial || '';
      case 'PERSONA SERVICIO AL CLIENTE':
        return servicioAlCliente || '';
      case 'Observiaciones':
        return comentariosDetalle || '';
      default:
        return '';
    }
  };

  useEffect(() => {
    // Optional: Perform any additional actions if needed
  }, [options]);

  const handleDirectorChange = (e) => {
    const value = e.target.value;
    setDirectorComercial(value);
    notifyChange('PERSONA COMERCIAL', value);
    
    if (!isReadOnly) {
      setCreateOrderDetails((prevDetails) => ({
        ...prevDetails,
        Director_Comercial: value
      }));
    }
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setServicioAlCliente(value);
    notifyChange('PERSONA SERVICIO AL CLIENTE', value);
    
    if (!isReadOnly) {
      setCreateOrderDetails((prevDetails) => ({
        ...prevDetails,
        Servicio_Al_Cliente: value
      }));
    }
  };

  const handleCommentsChange = (e) => {
    const value = e.target.value;
    setComentariosDetalle(value);
    notifyChange('Observiaciones', value);
    
    if (!isReadOnly) {
      setCreateOrderDetails((prevDetails) => ({
        ...prevDetails,
        Comentarios_Detalle: value
      }));
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <h5 className="text-md font-semibold mb-2 mt-4">GESTION CLIENTE</h5>
      <div className="flex items-center mb-2">
        <label className="block text-sm font-medium">Director Comercial</label>
        <select
          value={getCurrentValue('PERSONA COMERCIAL')}
          onChange={handleDirectorChange}
          className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={isReadOnly}
        >
          <option value="">Selecciona una opción</option>
          {directors?.map((director, index) => (
            <option key={index} value={director}>{director}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center mb-2">
        <label className="block text-sm font-medium">Servicio al Cliente</label>
        <select
          value={getCurrentValue('PERSONA SERVICIO AL CLIENTE')}
          onChange={handleServiceChange}
          className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={isReadOnly}
        >
          <option value="">Selecciona una opción</option>
          {customerServiceReps?.map((rep, index) => (
            <option key={index} value={rep}>{rep}</option>
          ))}
        </select>
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium">Comentario u Observaciones de Apertura del Negocio</label>
        <textarea
          value={getCurrentValue('Observiaciones')}
          onChange={handleCommentsChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
    </div>
  );
};

export default CustomerManagementSection;