import { useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const ClientInfoForm = ({ data: dataSaved, isReadOnly, onChange }) => {
  const {
    createOrderDetails,
    setCreateOrderDetails,
    clients,
    clientName, setClientName,
    nitCliente, setNitCliente,
    suggestions, setSuggestions,
    activeSuggestionIndex, setActiveSuggestionIndex,
    suggestionsRef, 
    nombreAnunciante, setNombreAnunciante
  } = useContext(DataContext);

  // 🔥 NUEVO: Función para notificar cambios específicos al componente padre
  const notifyChange = (field, value) => {
    if (onChange && typeof onChange === 'function') {
      onChange(field, value);
    }
  };

  // 🔥 ACTUALIZADO: Función para obtener el valor actual del campo
  const getCurrentValue = (field) => {
    // Siempre usar dataSaved que contiene los datos actuales (originales o editados)
    if (dataSaved && dataSaved[field] !== undefined) {
      return dataSaved[field];
    }
    
    // Fallback a valores del contexto si no están en dataSaved
    switch (field) {
      case 'NOMBRE CLIENTE':
        return clientName || '';
      case 'NIT CLIENTE':
        return nitCliente || '';
      case 'NOMBRE ANUNCIANTE':
        return nombreAnunciante || '';
      default:
        return '';
    }
  };

  const handleClientNameChange = (e) => {
    const { value } = e.target;
    
    // Actualizar el estado del contexto
    setClientName(value);

    // 🔥 NUEVO: Notificar cambio específico
    notifyChange('NOMBRE CLIENTE', value);

    // DEBUG: Verificar datos
    console.log('🔍 DEBUG - handleClientNameChange:');
    console.log('Value:', value);
    console.log('IsReadOnly:', isReadOnly);
    console.log('Clients array:', clients);
    console.log('Clients length:', clients?.length);

    // Filtrar sugerencias solo si no está en modo de solo lectura
    if (!isReadOnly) {
      if (value.trim() === "") {
        setSuggestions([]);
        console.log('🧹 Cleared suggestions (empty value)');
      } else {
        // DEBUG: Verificar estructura de datos
        if (clients && clients.length > 0) {
          console.log('🔍 Sample client:', clients[0]);
          console.log('Available keys:', Object.keys(clients[0]));
        }

        const filteredSuggestions = clients.filter(client => {
          // Verificar diferentes posibles nombres de campos
          const nombreCampos = ['NOMBRE', 'nombre', 'Nombre', 'NOMBRE CLIENTE', 'NombreCliente'];
          let nombreCliente = '';
          
          for (const campo of nombreCampos) {
            if (client[campo]) {
              nombreCliente = client[campo];
              break;
            }
          }
          
          console.log('🔍 Checking client:', nombreCliente);
          return nombreCliente && nombreCliente.toLowerCase().includes(value.toLowerCase());
        }).slice(0, 5);

        console.log('📋 Filtered suggestions:', filteredSuggestions);
        setSuggestions(filteredSuggestions);
      }
      setActiveSuggestionIndex(0);

      // Actualizar los detalles de la orden
      setCreateOrderDetails(prevDetails => ({
        ...prevDetails,
        NombreCliente: value
      }));
    }
  };

  // Manejador para el clic en una sugerencia
  const handleSuggestionClick = (suggestion) => {
    console.log('🎯 SUGGESTION CLICKED:', suggestion);
    
    // Detectar el campo correcto para el nombre
    const nombreCampos = ['NOMBRE', 'nombre', 'Nombre', 'NOMBRE CLIENTE', 'NombreCliente'];
    const nitCampos = ['NIT CLIENTE', 'NIT', 'nit', 'Cliente_ID', 'ID'];
    
    let nombreCliente = '';
    let nitCliente = '';
    
    // Buscar nombre
    for (const campo of nombreCampos) {
      if (suggestion[campo]) {
        nombreCliente = suggestion[campo];
        break;
      }
    }
    
    // Buscar NIT
    for (const campo of nitCampos) {
      if (suggestion[campo]) {
        nitCliente = suggestion[campo];
        break;
      }
    }
    
    console.log('📝 Extracted - Nombre:', nombreCliente, 'NIT:', nitCliente);
    
    // Establecer el nombre y el NIT del cliente seleccionado
    setClientName(nombreCliente);
    setNitCliente(nitCliente);

    // 🔥 NUEVO: Notificar ambos cambios
    notifyChange('NOMBRE CLIENTE', nombreCliente);
    notifyChange('NIT CLIENTE', nitCliente);

    // Limpiar sugerencias
    setSuggestions([]);

    if (!isReadOnly) {
      setCreateOrderDetails(prevDetails => ({
        ...prevDetails,
        NombreCliente: nombreCliente,
        Cliente_ID: nitCliente
      }));
    }
  };

  // Manejador de eventos de teclado para navegar por las sugerencias
  const handleKeyDown = (e) => {
    if (!isReadOnly && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (suggestions.length > 0) {
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        }
      } else if (e.key === "Escape") {
        setSuggestions([]);
      }
    }
  };

  // 🔥 ACTUALIZADO: Manejador de cambios en el nombre del anunciante
  const handleNombreAnuncianteChange = (e) => {
    const { value } = e.target;
    
    // Actualizar el estado del contexto
    setNombreAnunciante(value);

    // 🔥 NUEVO: Notificar cambio específico
    notifyChange('NOMBRE ANUNCIANTE', value);

    if (!isReadOnly) {
      setCreateOrderDetails(prevDetails => ({
        ...prevDetails,
        Nombre_Anunciante: value
      }));
    }
  };

  // Función para cerrar sugerencias cuando se hace click fuera
  const handleBlur = () => {
    // Usar setTimeout para permitir que el click en la sugerencia se procese primero
    setTimeout(() => {
      setSuggestions([]);
    }, 150);
  };

  console.log('🔍 ClientInfoForm - Estado actual:');
  console.log('- IsReadOnly:', isReadOnly);
  console.log('- Clients:', clients);
  console.log('- Suggestions:', suggestions);
  console.log('- ClientName:', clientName);
  console.log('- NitCliente:', nitCliente);
  console.log('- DataSaved:', dataSaved);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Información del Cliente
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Campo Nombre Cliente con Autocompletado */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Cliente *
          </label>
          <input
            type="text"
            value={getCurrentValue('NOMBRE CLIENTE')}
            onChange={handleClientNameChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isReadOnly 
                ? 'border-gray-200 bg-gray-50 text-gray-600' 
                : 'border-gray-300 bg-white'
            }`}
            readOnly={isReadOnly}
            placeholder={!isReadOnly ? "Escriba para buscar cliente..." : ""}
            autoComplete="off"
          />
          
          {/* Lista de sugerencias */}
          {!isReadOnly && suggestions.length > 0 && (
            <ul 
              className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg"
              ref={suggestionsRef}
            >
              {suggestions.map((suggestion, index) => {
                // Detectar campos dinámicamente
                const nombreCampos = ['NOMBRE', 'nombre', 'Nombre', 'NOMBRE CLIENTE', 'NombreCliente'];
                const nitCampos = ['NIT CLIENTE', 'NIT', 'nit', 'Cliente_ID', 'ID'];
                
                let nombreDisplay = '';
                let nitDisplay = '';
                
                for (const campo of nombreCampos) {
                  if (suggestion[campo]) {
                    nombreDisplay = suggestion[campo];
                    break;
                  }
                }
                
                for (const campo of nitCampos) {
                  if (suggestion[campo]) {
                    nitDisplay = suggestion[campo];
                    break;
                  }
                }

                return (
                  <li
                    key={index}
                    className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      index === activeSuggestionIndex 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setActiveSuggestionIndex(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{nombreDisplay}</span>
                      <span className="text-sm text-gray-500">
                        {nitDisplay}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Campo NIT Cliente (Solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NIT Cliente
          </label>
          <div className="block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600">
            {getCurrentValue('NIT CLIENTE')}
          </div>
        </div>

        {/* Campo Nombre Anunciante */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Anunciante
          </label>
          <input
            type="text"
            value={getCurrentValue('NOMBRE ANUNCIANTE')}
            onChange={handleNombreAnuncianteChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isReadOnly 
                ? 'border-gray-200 bg-gray-50 text-gray-600' 
                : 'border-gray-300 bg-white'
            }`}
            readOnly={isReadOnly}
            placeholder={!isReadOnly ? "Ingrese nombre del anunciante" : ""}
          />
        </div>
      </div>

   

  
    </div>
  );
};

export default ClientInfoForm;