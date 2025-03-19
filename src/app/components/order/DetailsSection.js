import { useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const DetailsSection = ({ data: dataSaved, isReadOnly }) => {
  const {
    marca, setMarca,
    competencias, setCompetencias,
    entorno, setEntorno,
    sectores, setSectores,
    categoria, setCategoria,
    createOrderDetails, setCreateOrderDetails,
    queryOrderDetails,
  } = useContext(DataContext);

  const data = isReadOnly ? (dataSaved === undefined ? {} : dataSaved) : {};

  const handleChange = (e) => {
    const { name, value } = e.target;

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
      <h4 className="col-span-1 text-md font-semibold mb-2">DETALLE CLIPPIN</h4>
      <div>
        <label className="block text-sm font-medium">Marca</label>
        <textarea
          name="Marca"
          value={isReadOnly ? data['MARCA'] : marca}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">Competencias</label>
        <textarea
          name="Competencias"
          value={isReadOnly ? data['COMPETENCIAS'] : competencias}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">Entorno</label>
        <textarea
          name="Entorno"
          value={isReadOnly ? data['ENTORNO'] : entorno}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">Sectores</label>
        <textarea
          name="Sectores"
          value={isReadOnly ? data['SECTORES'] : sectores}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">Categoria</label>
        <textarea
          name="Categoria"
          value={isReadOnly ? data['CATEGORIA'] : categoria}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
    </div>
  );
};

export default DetailsSection;
