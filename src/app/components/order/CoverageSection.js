import { useContext, useState, useEffect } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const CoverageSection = ({ data: dataSaved, isReadOnly, onChange, handleChange }) => {
  const {
    checkedValuesCobertura, setCheckedValuesCobertura,
    valuesCobertura, setValuesCobertura,
    createOrderDetails, setCreateOrderDetails,
    queryOrderDetails,
  } = useContext(DataContext);

  // 🔧 USAR DATOS GUARDADOS O DATOS DE CONSULTA
  const data = dataSaved || queryOrderDetails || {};

  // Estados para medios internacionales
  const [mediosInternacionales, setMediosInternacionales] = useState([]);

  // 🔧 Función para notificar cambios
  const notifyChange = (field, value) => {
    if (onChange && typeof onChange === 'function') {
      onChange(field, value);
    }
  };

  // 🔧 Obtener medios internacionales desde BD
  const getMediosInternacionalesValue = () => {
    const mediosData = data['DETALLE_COBERTURA_INTER'] || '';
    if (mediosData) {
      try {
        return typeof mediosData === 'string' ? JSON.parse(mediosData) : mediosData;
      } catch (error) {
        console.error('Error parsing medios internacionales:', error);
        return [];
      }
    }
    return [];
  };

  // 🔧 Cargar medios internacionales al montar el componente
  useEffect(() => {
    const savedMedios = getMediosInternacionalesValue();
    if (savedMedios.length > 0) {
      setMediosInternacionales(savedMedios);
    }
  }, [data, dataSaved, queryOrderDetails]);

  // 🔧 Obtener valores de cobertura
  const getCurrentCheckedValues = () => {
    if (isReadOnly) {
      const cobertura = data['COBERTURA'] || '';
      return {
        Nacional: cobertura === 'Nacional',
        Internacional: cobertura === 'Internacional',
      };
    }
    return checkedValuesCobertura;
  };

  // 🔧 Manejar cambios de cobertura
  const handleCheckChangeCobertura = (e) => {
    const { name, checked } = e.target;

    if (!isReadOnly) {
      if (checked) {
        const newCheckedValues = {
          Nacional: false,
          Internacional: false,
          [name]: checked,
        };

        setCheckedValuesCobertura(newCheckedValues);
        setValuesCobertura(name);
        
        // 🔧 CORREGIDO: Actualizar los campos correctos de la BD
        notifyChange('COBERTURA', name);
        
        // Actualizar campos específicos según el tipo de cobertura
        if (name === 'Nacional') {
          setCreateOrderDetails(prevDetails => ({
            ...prevDetails,
            Cobertura: name,
            COBERTURA: name,
            NACIONAL: 'X', // Marcar campo NACIONAL
            'COBERTURA INTERNACIONAL': '', // Limpiar internacional
            DETALLE_COBERTURA_INTER: '' // Limpiar detalle internacional
          }));
          
          // Limpiar medios internacionales si se cambia a Nacional
          setMediosInternacionales([]);
          actualizarMediosInternacionales([]);
        } else if (name === 'Internacional') {
          setCreateOrderDetails(prevDetails => ({
            ...prevDetails,
            Cobertura: name,
            COBERTURA: name,
            NACIONAL: '', // Limpiar campo NACIONAL
            'COBERTURA INTERNACIONAL': 'X' // Marcar internacional
          }));
        }
      } else {
        const newCheckedValues = {
          ...checkedValuesCobertura,
          [name]: checked,
        };

        setCheckedValuesCobertura(newCheckedValues);
        setValuesCobertura("");
        
        // 🔧 Limpiar campos
        notifyChange('COBERTURA', "");

        setCreateOrderDetails(prevDetails => ({
          ...prevDetails,
          Cobertura: "",
          COBERTURA: "",
          NACIONAL: "",
          'COBERTURA INTERNACIONAL': ""
        }));

        // Si se desmarca Internacional, limpiar los medios internacionales
        if (name === 'Internacional') {
          setMediosInternacionales([]);
          actualizarMediosInternacionales([]);
        }
      }
    }
  };

  // 🔧 Manejar cambios en observaciones - ESTE CAMPO VA A Observaciones_Cobertura (SOLO PARA NACIONAL)
  const handleObservacionesChange = (e) => {
    const { value } = e.target;

    if (!isReadOnly) {
      // 🔧 CORREGIDO: Usar el nombre correcto del campo en la BD
      notifyChange('Observaciones_Cobertura', value);

      // Si hay handleChange (de CreateOrder), usarlo también
      if (handleChange) {
        handleChange({
          target: {
            name: 'Observaciones_Cobertura',
            value: value
          }
        });
      }

      // 🔧 CORREGIDO: Actualizar contexto con el nombre correcto
      setCreateOrderDetails(prevDetails => ({
        ...prevDetails,
        Observaciones_Cobertura: value,
        OBSERVACIONES_COBERTURA: value // Mantener ambos para compatibilidad
      }));

      console.log('📝 Observaciones de cobertura actualizadas:', value);
    }
  };

  // 🔧 Funciones para manejar medios internacionales
  const agregarMedioInternacional = () => {
    const nuevoMedio = {
      id: Date.now(),
      nombre: ''
    };
    
    const nuevosMedios = [...mediosInternacionales, nuevoMedio];
    setMediosInternacionales(nuevosMedios);
    actualizarMediosInternacionales(nuevosMedios);
  };

  const eliminarMedioInternacional = (id) => {
    const nuevosMedios = mediosInternacionales.filter(medio => medio.id !== id);
    setMediosInternacionales(nuevosMedios);
    actualizarMediosInternacionales(nuevosMedios);
  };

  const actualizarMedioInternacional = (id, valor) => {
    const nuevosMedios = mediosInternacionales.map(medio =>
      medio.id === id ? { ...medio, nombre: valor } : medio
    );
    setMediosInternacionales(nuevosMedios);
    actualizarMediosInternacionales(nuevosMedios);
  };

  const actualizarMediosInternacionales = (medios) => {
    const mediosData = JSON.stringify(medios);
    
    console.log('🌍 Actualizando medios internacionales:', mediosData);
    
    // 🔧 CORREGIDO: Usar el campo correcto de la BD
    notifyChange('DETALLE_COBERTURA_INTER', mediosData);
    
    setCreateOrderDetails(prevDetails => ({
      ...prevDetails,
      DETALLE_COBERTURA_INTER: mediosData,
      MEDIOS_INTERNACIONALES: mediosData // Mantener para compatibilidad
    }));
  };

  // 🔧 Obtener valor actual de observaciones
  const currentObservaciones = data['Observaciones_Cobertura'] || '';

  // Verificar si está marcado Internacional
  const isInternacionalSelected = getCurrentCheckedValues().Internacional;
  const isNacionalSelected = getCurrentCheckedValues().Nacional;

  return (
    <div className="rounded-lg">
      <h5 className="text-md font-semibold mb-4">COBERTURA</h5>

      {/* Sección de selección de cobertura */}
      <div className="mb-6">
        <h6 className="text-sm font-medium mb-3 text-gray-700">Tipo de Cobertura *</h6>
        <div className="flex flex-wrap gap-4">
          {["Nacional", "Internacional"].map((location, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="checkbox"
                className={`form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                  isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                name={location}
                checked={getCurrentCheckedValues()[location] || false}
                onChange={handleCheckChangeCobertura}
                disabled={isReadOnly}
              />
              <span className={`ml-2 ${isReadOnly ? 'text-gray-500' : 'text-gray-700'}`}>
                {location.charAt(0).toUpperCase() + location.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🔧 OBSERVACIONES DE COBERTURA - Solo aparece si es NACIONAL */}
      {isNacionalSelected && (
        <div className="mb-6">
          <label
            htmlFor="observaciones-cobertura"
            className="block text-sm font-medium mb-2 text-gray-700 flex items-center"
          >
            Observaciones de Cobertura
            {!isReadOnly && (
              <span className="ml-2 text-xs text-gray-400 font-normal">
                (Opcional - máx. 500 caracteres)
              </span>
            )}
          </label>

          <textarea
            id="observaciones-cobertura"
            name="observaciones-cobertura"
            rows={4}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors ${
              isReadOnly
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-900 hover:border-gray-400'
            }`}
            placeholder="Escriba aquí las observaciones de cobertura..."
            value={currentObservaciones}
            onChange={handleObservacionesChange}
            disabled={isReadOnly}
            maxLength={500}
          />

          {/* Contador de caracteres */}
          {!isReadOnly && (
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <span className={`text-xs ${
                  currentObservaciones.length > 450
                    ? 'text-orange-500 font-medium'
                    : currentObservaciones.length > 400
                      ? 'text-yellow-600'
                      : 'text-gray-400'
                }`}>
                  {currentObservaciones.length}/500
                </span>
                {currentObservaciones.length > 450 && (
                  <span className="ml-2 text-xs text-orange-500">
                    Cerca del límite
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🔧 TABLA DE MEDIOS INTERNACIONALES - Solo aparece si es INTERNACIONAL */}
      {isInternacionalSelected && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h6 className="text-sm font-semibold text-gray-700">
              MEDIOS INTERNACIONALES
              {!isReadOnly && (
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  (Especifique los medios internacionales)
                </span>
              )}
            </h6>
            {!isReadOnly && (
              <button
                type="button"
                onClick={agregarMedioInternacional}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                + Agregar Medio
              </button>
            )}
          </div>

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre del Medio Internacional
                    </th>
                    {!isReadOnly && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mediosInternacionales.length === 0 ? (
                    <tr>
                      <td colSpan={isReadOnly ? 2 : 3} className="px-4 py-4 text-center text-gray-500 text-sm">
                        {isReadOnly 
                          ? 'No hay medios internacionales especificados' 
                          : 'Agregue medios internacionales haciendo clic en el botón "+ Agregar Medio"'
                        }
                      </td>
                    </tr>
                  ) : (
                    mediosInternacionales.map((medio, index) => (
                      <tr key={medio.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={medio.nombre}
                            onChange={(e) => actualizarMedioInternacional(medio.id, e.target.value)}
                            className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 ${
                              isReadOnly 
                                ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                                : 'bg-white text-gray-900'
                            }`}
                            placeholder="Nombre del Medio Internacional"
                            disabled={isReadOnly}
                          />
                        </td>
                        {!isReadOnly && (
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => eliminarMedioInternacional(medio.id)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              Eliminar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverageSection;