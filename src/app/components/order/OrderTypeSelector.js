import { useEffect, useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const OrderTypeSelector = ({ data: dataSaved, options, isReadOnly, onChange }) => {
  const {
    createOrderDetails, setCreateOrderDetails,
    setTipoOt, setActividad, setFacturacion,
    tipoOt, actividad, facturacion
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
      case 'TIPO OT':
        return tipoOt || '';
      case 'ACTIVIDAD':
        return actividad || '';
      case 'FACTURACION':
        return facturacion || '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let dbFieldName = '';
    switch (name) {
      case "Tipo_Ot":
        dbFieldName = 'TIPO OT';
        setTipoOt(value);
        break;
      case "Actividad":
        dbFieldName = 'ACTIVIDAD';
        setActividad(value);
        break;
      case "Facturacion":
        dbFieldName = 'FACTURACION';
        setFacturacion(value);
        break;
    }

    notifyChange(dbFieldName, value);

    setCreateOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    localStorage.setItem('createOrderDetails', JSON.stringify({
      ...createOrderDetails,
      [name]: value,
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">TIPO O.T.</label>
        <select
          name="Tipo_Ot"
          value={getCurrentValue('TIPO OT')}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={isReadOnly}
        >
          <option value="">Selecciona una opción</option>
          {options?.tipoot?.map((type, index) => (
            <option key={index} value={type.Tipo_ot}>{type.Tipo_ot}</option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button className="bg-yellow-500 text-black py-2 px-4 rounded">SOLICITADA</button>
      </div>
      <div>
        <label className="block text-sm font-medium">Actividad</label>
        <select
          name="Actividad"
          value={getCurrentValue('ACTIVIDAD')}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={isReadOnly}
        >
          <option value="">Selecciona una opción</option>
          {options?.actividad?.map((activity, index) => (
            <option key={index} value={activity.Actividad}>{activity.Actividad}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Facturación</label>
        <select
          name="Facturacion"
          value={getCurrentValue('FACTURACION')}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={isReadOnly}
        >
          <option value="">Selecciona una opción</option>
          {options?.facturacion?.map((option, index) => (
            <option key={index} value={option.Facturacion}>{option.Facturacion}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderTypeSelector;