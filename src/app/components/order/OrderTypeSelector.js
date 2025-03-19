import { useEffect, useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const OrderTypeSelector = ({ data: dataSaved, options, isReadOnly }) => {
  const {
    createOrderDetails, setCreateOrderDetails,
    setTipoOt, setActividad, setFacturacion,
    tipoOt, actividad, facturacion
  } = useContext(DataContext);

  const data = isReadOnly ? (dataSaved === undefined ? {} : dataSaved) : {};

  // useEffect(() => {

  //   if (data && isReadOnly) {
  //     setTipoOt(data['TIPO OT']);
  //     setActividad(data['ACTIVIDAD']);
  //     setFacturacion(data['FACTURACION']);
  //   }
  // }, [data, isReadOnly, setTipoOt, setActividad, setFacturacion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    localStorage.setItem('createOrderDetails', JSON.stringify({
      ...createOrderDetails,
      [name]: value,
    }));

    if (name === "Tipo_Ot") setTipoOt(value);
    if (name === "Actividad") setActividad(value);
    if (name === "Facturacion") setFacturacion(value);
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">TIPO O.T.</label>
        <select
          name="Tipo_Ot"
          value={isReadOnly ? data['TIPO OT'] : tipoOt}
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
          value={isReadOnly ? data['ACTIVIDAD'] : actividad}
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
          value={isReadOnly ? data['FACTURACION'] : facturacion}
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
