import { useContext } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const ClientInfoForm = ({ data: dataSaved, isReadOnly }) => {
  const {
    createOrderDetails,
    setCreateOrderDetails,
    clients,
    clientName, setClientName,
    nitCliente, setNitCliente,
    suggestions, setSuggestions,
    activeSuggestionIndex, setActiveSuggestionIndex,
    suggestionsRef, nombreAnunciante, setNombreAnunciante
  } = useContext(DataContext);

  const data = isReadOnly ? (dataSaved === undefined ? {} : dataSaved) : {};

  const handleClientNameChange = (e) => {
    const { value } = e.target;
    setClientName(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredSuggestions = clients.filter(client =>
        client.NOMBRE && client.NOMBRE.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filteredSuggestions);

    }
    setActiveSuggestionIndex(0);

    if (!isReadOnly) {
      setCreateOrderDetails(prevDetails => ({
        ...prevDetails,
        NombreCliente: value
      }));
    }
  };

  // Manejador para el clic en una sugerencia
  const handleSuggestionClick = (suggestion) => {
    // Establecer el nombre y el NIT del cliente seleccionado
    setClientName(suggestion.NOMBRE);
    console.log('SUGGESTION ', suggestion)
    setNitCliente(suggestion['NIT CLIENTE']); // Asegúrate de que esta propiedad está correctamente definida

    console.log("Selected Client NIT:", suggestion.NIT);

    setSuggestions([]);

    if (!isReadOnly) {
      setCreateOrderDetails(prevDetails => ({
        ...prevDetails,
        NombreCliente: suggestion.NOMBRE,
        Cliente_ID: suggestion['NIT CLIENTE']
      }));
    }
  };

  // Manejador de eventos de teclado
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
      }
    }
  };

  // Manejador de cambios en el nombre del anunciante
  const handleNombreAnuncianteChange = (e) => {
    const { value } = e.target;
    setNombreAnunciante(value);

    if (!isReadOnly) {
      setCreateOrderDetails(prevDetails => ({
        ...prevDetails,
        Nombre_Anunciante: value
      }));
    }
  };
  console.log('NIT', nitCliente)

  return (
    <div className="flex mb-6 gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium">Nombre Cliente</label>
        <input
          type="text"
          value={isReadOnly ? data['NOMBRE CLIENTE'] : clientName}
          onChange={handleClientNameChange}
          onKeyDown={handleKeyDown}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1" ref={suggestionsRef}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-200 ${index === activeSuggestionIndex ? 'bg-gray-200' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.NOMBRE}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex-1 max-w-xs">
        <label className="block text-sm font-medium">NIT Cliente</label>
        <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          {isReadOnly ? (data['NIT CLIENTE'] === undefined ? '' : data['NIT CLIENTE']) : nitCliente} {/* Mostrar el NIT actual */}
        </p>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium">Nombre Anunciante</label>
        <input
          type="text"
          value={isReadOnly ? (data['NOMBRE ANUNCIANTE'] === undefined ? '' : data['NOMBRE ANUNCIANTE']) : nombreAnunciante}
          onChange={handleNombreAnuncianteChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          readOnly={isReadOnly}
        />


      </div>
    </div>
  );
};

export default ClientInfoForm;
