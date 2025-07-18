import { useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const ConfigSection = ({ data: dataSaved, isReadOnly, onChange }) => {
  const {
    createOrderDetails, setCreateOrderDetails,
    usuarios, setUsuarios,
    correccion, setCorreccion,
    analisis, setAnalisis,
  } = useContext(DataContext);

  // ?? NUEVO: Función para notificar cambios específicos al componente padre
  const notifyChange = (field, value) => {
    if (onChange && typeof onChange === 'function') {
      onChange(field, value);
    }
  };

  // ?? NUEVO: Función para obtener el valor actual del campo
  const getCurrentValue = (field) => {
    // Siempre usar dataSaved que contiene los datos actuales (originales o editados)
    if (dataSaved && dataSaved[field] !== undefined) {
      return dataSaved[field];
    }
    
    // Fallback a valores del contexto si no están en dataSaved
    switch (field) {
      case 'USUARIOS':
        return usuarios || '';
      case 'CORRECCION':
        return correccion || '';
      case 'DETALLE_ANALISIS':
        return analisis || '';
      default:
        return '';
    }
  };

  // ?? ACTUALIZADO: Manejador de cambios mejorado
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (!isReadOnly) {
      // Mapear nombres de campos del input a nombres de campos de la base de datos
      let dbFieldName = name;
      switch (name) {
        case "Usuarios":
          dbFieldName = "USUARIOS";
          setUsuarios(value);
          break;
        case "Correccion":
          dbFieldName = "CORRECCION";
          setCorreccion(value);
          break;
        case "Analisis":
          dbFieldName = "DETALLE_ANALISIS";
          setAnalisis(value);
          break;
        default:
          break;
      }

      // ?? NUEVO: Notificar cambio específico
      notifyChange(dbFieldName, value);

      // Actualizar createOrderDetails
      setCreateOrderDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  console.log('?? ConfigSection - Estado actual:');
  console.log('- IsReadOnly:', isReadOnly);
  console.log('- DataSaved:', dataSaved);
  console.log('- USUARIOS:', getCurrentValue('USUARIOS'));
  console.log('- CORRECCION:', getCurrentValue('CORRECCION'));
  console.log('- DETALLE_ANALISIS:', getCurrentValue('DETALLE_ANALISIS'));

  return (
    <div className="space-y-6">
   

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campo Usuarios */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Usuarios *
          </label>
          <textarea
            name="Usuarios"
            value={getCurrentValue('USUARIOS')}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200 resize-none ${
              isReadOnly 
                ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed' 
                : 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            rows={4}
            readOnly={isReadOnly}
            placeholder={!isReadOnly ? "Especifique los usuarios que tendrán acceso..." : ""}
          />
    
        </div>

        {/* Campo Corrección */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Corrección *
          </label>
          <textarea
            name="Correccion"
            value={getCurrentValue('CORRECCION')}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200 resize-none ${
              isReadOnly 
                ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed' 
                : 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            rows={4}
            readOnly={isReadOnly}
            placeholder={!isReadOnly ? "Indique los criterios de corrección..." : ""}
          />
        </div>

        {/* Campo Análisis */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Análisis Detallado *
          </label>
          <textarea
            name="Analisis"
            value={getCurrentValue('DETALLE_ANALISIS')}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200 resize-none ${
              isReadOnly 
                ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed' 
                : 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            rows={4}
            readOnly={isReadOnly}
            placeholder={!isReadOnly ? "Describa el tipo de análisis requerido..." : ""}
          />
        </div>
      </div>



     
    </div>
  );
};

export default ConfigSection;