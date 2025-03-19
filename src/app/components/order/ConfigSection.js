import { useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const ConfigSection = ({ data: dataSaved, isReadOnly }) => {
  const {
    createOrderDetails, setCreateOrderDetails,
    usuarios, setUsuarios,
    correccion, setCorreccion,
    analisis, setAnalisis,
  } = useContext(DataContext);

  const data = isReadOnly ? (dataSaved === undefined ? {} : dataSaved) : {};

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!isReadOnly) {
      setCreateOrderDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }

    switch (name) {
      case "Usuarios":
        setUsuarios(value);
        break;
      case "Correccion":
        setCorreccion(value);
        break;
      case "Analisis":
        setAnalisis(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <h4 className="col-span-3 text-md font-semibold mb-2">CONFIGURACIÓN</h4>
      <div>
        <label className="block text-sm font-medium">Usuarios</label>
        <textarea
          name="Usuarios"
          value={isReadOnly ? (data['USUARIOS'] || "") : usuarios}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">Corrección</label>
        <textarea
          name="Correccion"
          value={isReadOnly ? (data['CORRECCION'] || "") : correccion}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">ANALISIS</label>
        <textarea
          name="Analisis"
          value={isReadOnly ? (data['DETALLE_ANALISIS'] || "") : analisis}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
    </div>
  );
};

export default ConfigSection;
