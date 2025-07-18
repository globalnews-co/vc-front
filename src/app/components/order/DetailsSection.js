import { useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const DetailsSection = ({ data: dataSaved, isReadOnly, onChange }) => {
  const {
    marca, setMarca,
    competencias, setCompetencias,
    entorno, setEntorno,
    sectores, setSectores,
    categoria, setCategoria,
    createOrderDetails, setCreateOrderDetails,
    queryOrderDetails,
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
      case 'MARCA':
        return marca || '';
      case 'COMPETENCIAS':
        return competencias || '';
      case 'ENTORNO':
        return entorno || '';
      case 'SECTORES':
        return sectores || '';
      case 'CATEGORIA':
        return categoria || '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let dbFieldName = name.toUpperCase();
    notifyChange(dbFieldName, value);
    
    if (!isReadOnly) {
      setCreateOrderDetails(prevDetails => ({
        ...prevDetails,
        [name]: value
      }));
    }
    
    switch (name) {
      case "Marca":
        setMarca(value);
        break;
      case "Competencias":
        setCompetencias(value);
        break;
      case "Entorno":
        setEntorno(value);
        break;
      case "Sectores":
        setSectores(value);
        break;
      case "Categoria":
        setCategoria(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      <h4 className="col-span-1 text-md mb-2">DETALLE CLIPPIN</h4>
      <div>
        <label className="block text-sm font-medium">Marca</label>
        <textarea
          name="Marca"
          value={getCurrentValue('MARCA')}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">Competencias</label>
        <textarea
          name="Competencias"
          value={getCurrentValue('COMPETENCIAS')}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">Entorno</label>
        <textarea
          name="Entorno"
          value={getCurrentValue('ENTORNO')}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div className="text-lg font-medium   mb-4 border-b border-gray-200 pb-2" />
      <h4 className="col-span-1 text-md mb-2">DETALLE PUBLICIDAD</h4>
      <div>
        <label className="block text-sm font-medium">Sectores</label>
        <textarea
          name="Sectores"
          value={getCurrentValue('SECTORES')}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">Categoria</label>
        <textarea
          name="Categoria"
          value={getCurrentValue('CATEGORIA')}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
    </div>
  );
};

export default DetailsSection;