import { useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const CoverageSection = ({ data: dataSaved, isReadOnly }) => {
  const {
    checkedValuesCobertura, setCheckedValuesCobertura,
    valuesCobertura, setValuesCobertura,
    createOrderDetails, setCreateOrderDetails,
    queryOrderDetails,
  } = useContext(DataContext);

  const data = isReadOnly ? (dataSaved === undefined ? {} : dataSaved) : {};

  const handleCheckChangeCobertura = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setCheckedValuesCobertura({
        Nacional: false,
        Internacional: false,
        [name]: checked,
      });
      setValuesCobertura(name);

      if (!isReadOnly) {
        setCreateOrderDetails(prevDetails => ({
          ...prevDetails,
          Cobertura: name
        }));
      }
    } else {
      setCheckedValuesCobertura(prev => ({
        ...prev,
        [name]: checked,
      }));
      setValuesCobertura("");

      if (!isReadOnly) {
        setCreateOrderDetails(prevDetails => ({
          ...prevDetails,
          Cobertura: ""
        }));
      }
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <h5 className="text-md font-semibold mb-2">COBERTURA</h5>
      <div className="flex flex-wrap gap-4">
        {["Nacional", "Internacional"].map((location, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              className="form-checkbox"
              name={location}
              checked={isReadOnly ? data['COBERTURA'] === location : data.Cobertura}
              onChange={handleCheckChangeCobertura}
              disabled={isReadOnly}
            />
            <span className="ml-2">{location.charAt(0).toUpperCase() + location.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoverageSection;
