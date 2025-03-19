import { useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const ContractedServicesSection = ({ data: dataSaved, isReadOnly }) => {
  const {
    checkedValuesServicios,
    setCheckedValuesServicios,
    createOrderDetails,
    setCreateOrderDetails,
  } = useContext(DataContext);

  const data = isReadOnly ? (dataSaved === undefined ? {} : dataSaved) : {};

  const handleCheckChangeServicio = (e) => {
    const { name, checked } = e.target;
  
    setCheckedValuesServicios((prev) => ({
      ...prev,
      [name]: checked,
    }));
  
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
  
  return (
    <div className="border p-4 rounded-lg">
      <h5 className="text-md font-semibold mb-2">SERVICIOS CONTRATADOS</h5>
      {isReadOnly ? (
        data["SERVICIOS CONTRATADOS"] ? (
          <div>{data["SERVICIOS CONTRATADOS"].replace(/,/g, ", ")}</div>
        ) : (
          ""
        )
      ) : (
        ["Alertas", "Clippin", "Catalogo", "Análisis"].map((service, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              className="form-checkbox"
              name={service}
              checked={checkedValuesServicios[service] || false}
              onChange={handleCheckChangeServicio}
              disabled={isReadOnly}
            />
            <span className="ml-2">
              {service.charAt(0).toUpperCase() + service.slice(1)}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default ContractedServicesSection;
