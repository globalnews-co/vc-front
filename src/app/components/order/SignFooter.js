import { useContext, useState } from 'react';
import { DataContext } from 'src/app/pages/context/DataContext';

const FooterBar = ({ data: dataSaved, className }) => {
  const { isModalOpen } = useContext(DataContext);
  const [isSignaturesExpanded, setIsSignaturesExpanded] = useState(false);
  
  // Si no hay datos o están vacíos, no mostrar nada
  if (!dataSaved || Object.keys(dataSaved).length === 0) {
    return null;
  }
  
  // Process data in a cleaner way
  const newData = {
    firmaComercial: dataSaved?.['FIRMA COMERCIAL'] || false,
    firmaOperacion: dataSaved?.['FIRMA OPERACIONES'] || false,
    firmaServicioCliente: dataSaved?.['FIRMA SERVICIO AL CLIENTE'] || false,
    observacionesCierre: dataSaved?.['Observaciones de cierre'] || 'Sin observaciones'
  };

  const { firmaComercial, firmaOperacion, firmaServicioCliente, observacionesCierre } = newData;

  // Hide the footer when modal is open
  if (isModalOpen) {
    return null;
  }

  // Calcular cuántas firmas están pendientes
  const firmasPendientes = [firmaComercial, firmaOperacion, firmaServicioCliente].filter(firma => !firma).length;
  const todasFirmadas = firmasPendientes === 0;

  return (
    <div className="w-full">
      {/* Observación section */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Observación Gestión Operativa</h3>
        <div className="p-3 bg-white border border-gray-200 rounded-md">
          {observacionesCierre}
        </div>
      </div>

      {/* Signatures toggle button */}
      <div className="mt-4">
        <button
          onClick={() => setIsSignaturesExpanded(!isSignaturesExpanded)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
            todasFirmadas 
              ? 'bg-green-50 border-green-200 hover:bg-green-100' 
              : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              todasFirmadas ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <SignatureStatusIcon isComplete={todasFirmadas} />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-800">
                Estado de Firmas
              </h4>
              <p className={`text-sm ${
                todasFirmadas ? 'text-green-600' : 'text-orange-600'
              }`}>
                {todasFirmadas 
                  ? 'Todas las firmas completadas' 
                  : `${firmasPendientes} firma${firmasPendientes > 1 ? 's' : ''} pendiente${firmasPendientes > 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
          
          <div className={`transform transition-transform duration-200 ${
            isSignaturesExpanded ? 'rotate-180' : ''
          }`}>
            <ChevronDownIcon />
          </div>
        </button>

        {/* Collapsible signatures section */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isSignaturesExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Firma Comercial */}
            <SignatureBox 
              title="Firma Comercial" 
              isSigned={firmaComercial} 
            />
            
            {/* Firma Servicio al Cliente */}
            <SignatureBox 
              title="Firma Servicio al Cliente" 
              isSigned={firmaServicioCliente} 
            />
            
            {/* Firma Operaciones */}
            <SignatureBox 
              title="Firma Operaciones" 
              isSigned={firmaOperacion} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Signature box component for better organization and reuse
const SignatureBox = ({ title, isSigned }) => {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200 bg-white">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
        isSigned ? 'bg-green-100' : 'bg-gray-100'
      }`}>
        <SignatureIcon isSigned={isSigned} />
      </div>
      <h4 className="font-medium text-gray-800 text-center">{title}</h4>
      <span className={`mt-1 px-2 py-1 text-xs font-medium rounded-full ${
        isSigned 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isSigned ? 'FIRMADO' : 'FALTA FIRMA'}
      </span>
    </div>
  );
};

// Custom signature icon
const SignatureIcon = ({ isSigned }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    className={isSigned ? 'text-green-600' : 'text-gray-400'}
  >
    <path 
      d="M3.5 19h17v-2h-17v2zm2-5h14c.55 0 1 .45 1 1s-.45 1-1 1h-14c-.55 0-1-.45-1-1s.45-1 1-1zm3-5h8c.55 0 1 .45 1 1s-.45 1-1 1h-8c-.55 0-1-.45-1-1s.45-1 1-1z" 
      fill="currentColor"
    />
  </svg>
);

// Icon to show signature completion status
const SignatureStatusIcon = ({ isComplete }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    className={isComplete ? 'text-green-600' : 'text-orange-600'}
  >
    {isComplete ? (
      <path 
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" 
        fill="currentColor"
      />
    ) : (
      <path 
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
        fill="currentColor"
        opacity="0.5"
      />
    )}
  </svg>
);

// Chevron down icon for the expand/collapse button
const ChevronDownIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    className="text-gray-500"
  >
    <path 
      d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" 
      fill="currentColor"
    />
  </svg>
);

export default FooterBar;