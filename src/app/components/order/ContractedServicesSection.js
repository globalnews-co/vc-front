import { useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const ContractedServicesSection = ({ data: dataSaved, isReadOnly, onChange }) => {
  const {
    checkedValuesServicios,
    setCheckedValuesServicios,
    createOrderDetails,
    setCreateOrderDetails,
  } = useContext(DataContext);

  // 🔧 CORREGIDO: Usar dataSaved tanto en modo lectura como edición
  const data = dataSaved || {};

  const handleCheckChangeServicio = (e) => {
    const { name, checked } = e.target;
  
    // Actualizar el estado local del contexto
    setCheckedValuesServicios((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // 🔧 NUEVO: Calcular los servicios seleccionados
    const currentServices = data["SERVICIOS CONTRATADOS"] || "";
    let updatedServices = "";

    if (checked) {
      updatedServices = currentServices
        ? `${currentServices}, ${name}`
        : name;
    } else {
      updatedServices = currentServices
        .split(", ")
        .filter((service) => service !== name)
        .join(", ");
    }

    if (onChange) {
      onChange("SERVICIOS CONTRATADOS", updatedServices);
    }

    if (checked) {
      setCreateOrderDetails((prevDetails) => ({
        ...prevDetails,
        Servicios_Contratados: prevDetails.Servicios_Contratados
          ? `${prevDetails.Servicios_Contratados}, ${name}`
          : name,
      }));
    } else {
      setCreateOrderDetails((prevDetails) => ({
        ...prevDetails,
        Servicios_Contratados: prevDetails.Servicios_Contratados
          .split(", ")
          .filter((service) => service !== name)
          .join(", "),
      }));
    }
  };

  const isServiceSelected = (serviceName) => {
    if (isReadOnly) {
      const services = data["SERVICIOS CONTRATADOS"] || "";
      return services.includes(serviceName);
    } else {
      return checkedValuesServicios[serviceName] || 
             (data["SERVICIOS CONTRATADOS"] || "").includes(serviceName);
    }
  };
  
  return (
    <div className="border p-4 rounded-lg">
      <h5 className="text-md font-semibold mb-2">SERVICIOS CONTRATADOS</h5>
      
      {isReadOnly ? (
        // 🔧 MEJORADO: Mostrar servicios en modo lectura con mejor formato
        <div className="bg-gray-50 p-3 rounded border">
          {data["SERVICIOS CONTRATADOS"] ? (
            <div className="flex flex-wrap gap-2">
              {data["SERVICIOS CONTRATADOS"].split(", ").map((service, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium"
                >
                  {service.trim()}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500 italic">No hay servicios contratados</span>
          )}
        </div>
      ) : (
        // 🔧 CORREGIDO: Checkboxes en modo edición
        <div className="space-y-3">
          {["Alertas", "Clippin", "Catalogo", "Análisis", "Social Media", "Correción"].map((service, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                name={service}
                checked={isServiceSelected(service)}
                onChange={handleCheckChangeServicio}
                disabled={isReadOnly}
              />
              <label className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                {service.charAt(0).toUpperCase() + service.slice(1)}
              </label>
            </div>
          ))}
          
          {!isReadOnly && (data["SERVICIOS CONTRATADOS"] || checkedValuesServicios) && (
            <div className="mt-4 p-3 bg-gray-50 rounded border">
              <label className="block text-sm font-medium text-gray-700 mb-2">
              </label>
              <div className="flex flex-wrap gap-2">
                {(data["SERVICIOS CONTRATADOS"] || "").split(", ")
                  .filter(service => service.trim())
                  .map((service, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium"
                    >
                      {service.trim()}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContractedServicesSection;