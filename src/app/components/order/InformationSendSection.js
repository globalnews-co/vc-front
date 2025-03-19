import { useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const InformationSendSection = ({ data: dataSaved, isReadOnly }) => {
  const {
    correosAlertas, setCorreosAlertas,
    correosBoletines, setCorreosBoletines,
    createOrderDetails, setCreateOrderDetails,
    queryOrderDetails,
  } = useContext(DataContext);

  const data = isReadOnly ? (dataSaved === undefined ? {} : dataSaved) : {};

  const handleCorreosAlertasChange = (e) => {
    const { value } = e.target;
    setCorreosAlertas(value);

    if (!isReadOnly) {
      setCreateOrderDetails(prevDetails => ({
        ...prevDetails,
        Correos_Alertas: value
      }));
    }
  };

  const handleCorreosBoletinesChange = (e) => {
    const { value } = e.target;
    setCorreosBoletines(value);

    if (!isReadOnly) {
      setCreateOrderDetails(prevDetails => ({
        ...prevDetails,
        Correos_Boletines: value
      }));
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <h5 className="text-md font-semibold mb-2 text-red-500">ENVIO DE INFORMACION</h5>
      <div>
        <label className="block text-sm font-medium">Correos Alertas, Numeros WhatsApp</label>
        <textarea
          value={isReadOnly ? data['ALERTAS_CORREOS'] + data['WHATSAPP'] : correosAlertas}
          onChange={handleCorreosAlertasChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">Correos Boletines</label>
        <textarea
          value={isReadOnly ? data['NEWSLETERS'] : correosBoletines}
          onChange={handleCorreosBoletinesChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        ></textarea>
      </div>
    </div>
  );
};

export default InformationSendSection;
