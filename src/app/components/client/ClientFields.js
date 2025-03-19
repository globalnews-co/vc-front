import moment from "moment";
import { useContext, useEffect } from "react";
import { DataContext } from "src/app/pages/context/DataContext";
import { fetchOptions } from "src/Utilities/Conexion";


const ClientFields = ({ clientData, handleChange, isReadOnly }) => {

const {setOptions, options} = useContext(DataContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const optionsResponse = await fetchOptions();
        setOptions(optionsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setOptions]);


  const handleChangeNumeros = (e) => {
    const { name, value } = e.target;

    // Solo permite números
    if (/^\d*$/.test(value)) {
      handleChange(e); // Llama a handleChange si es un número válido
    }
  };


  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {isReadOnly ? <div>
        <label className="block text-sm font-medium">Cliente No.</label>
        <input
          type="text"
          name="Cliente_ID"
          value={clientData.Cliente_ID || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div> : ""}
      <div>
        <label className="block text-sm font-medium">Persona de Contacto</label>
        <input
          type="text"
          name="Persona_de_Contacto"
          value={clientData.Persona_de_Contacto || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Pagador</label>
        <input
          type="text"
          name="Pagador"
          value={clientData.Pagador || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Nombre Cliente</label>
        <input
          type="text"
          name="NombreCliente"
          value={clientData.NombreCliente || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Móvil Pagador</label>
        <input
          type="text"
          name="Celular"
          value={clientData.Celular || ""}
          onChange={(e) => handleChangeNumeros(e)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">NIT Cliente</label>
        <input
          type="text"
          name="Nit_Cliente"
          value={clientData.Nit_Cliente || ""}
          onChange={(e) => handleChangeNumeros(e)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Cumpleaños</label>
        <input
          type={isReadOnly ? "text" : "date"}
          name="Birthday"
          value={isReadOnly ? clientData.Cumpleaños : clientData.Birthday}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Ciudad</label>
        <input
          type="text"
          name="Ciudad"
          value={clientData.Ciudad || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Tipo</label>
        <select
          name="Tipo"
          value={isReadOnly ? data['ACTIVIDAD'] : clientData.Tipo}
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
        <label className="block text-sm font-medium">Dirección</label>
        <input
          type="text"
          name="Direccion"
          value={clientData.Direccion || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Correo electrónico</label>
        <input
          type="email"
          name="Correo_Electronico"
          value={clientData.Correo_Electronico || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          type="text"
          name="Telefono"
          value={clientData.Telefono || ""}
          onChange={(e) => handleChangeNumeros(e)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium">Detalles especiales de este cliente</label>
        <textarea
          name="Detalle_Especiales"
          value={clientData.Detalle_Especiales || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
    </div>
  );
};

export default ClientFields;
