import { useContext } from 'react';
import { FaSignature } from 'react-icons/fa';
import { DataContext } from 'src/app/pages/context/DataContext';

const FooterBar = ({ data: dataSaved, className }) => {
  const { isModalOpen } = useContext(DataContext);

  const newData = {
    'firmaComercial': dataSaved['FIRMA COMERCIAL'],
    'firmaOperacion': dataSaved['FIRMA OPERACIONES'],
    'firmaServicioCliente': dataSaved['FIRMA SERVICIO AL CLIENTE'],
    'observacionesCierre': dataSaved['Observaciones de cierre'] || 'Sin observaciones'
  };

  const { firmaComercial, firmaOperacion, firmaServicioCliente, observacionesCierre } = newData;

  return (
    <div>
      {!isModalOpen ? (
        <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white py-4 z-50 flex flex-col items-start border border-gray-300 shadow-xl rounded-lg ${className}`}>

          <div className='ml-6'>
            <span className="text-gray-800 font-bold">Observación Gestión Operativa</span>
            <div className="w-full p-2 mb-2 border border-gray-300 rounded-md bg-gray-50 mt-3">
              <span className="block text-gray-600 ">{observacionesCierre}</span>
            </div>
          </div>

          {/* Divisor opcional para mayor claridad */}
          <div className="border-t border-gray-300 w-full my-2"></div>

          {/* Sección de Firmas en una sola fila */}
          <div className="flex justify-around w-full">
            {/* Firma Comercial */}
            <div className="flex flex-col items-center p-2">
              <div className={`p-3 rounded-full flex justify-center items-center mb-2 ${firmaComercial ? 'bg-green' : 'bg-gray'}`}>
                <FaSignature size="24" color={firmaComercial ? 'black' : 'white'} />
              </div>
              <span className="text-gray-800 font-semibold">Firma Comercial</span>
              <span className={`font-bold ${firmaComercial ? 'text-green' : 'text-red-600'}`}>
                {firmaComercial ? 'FIRMADO' : 'FALTA FIRMA'}
              </span>
            </div>

            {/* Firma Servicio al Cliente */}
            <div className="flex flex-col items-center p-2">
              <div className={`p-3 rounded-full flex justify-center items-center mb-2 ${firmaServicioCliente ? 'bg-green' : 'bg-gray'}`}>
                <FaSignature size="24" color={firmaServicioCliente ? 'black' : 'white'} />
              </div>
              <span className="text-gray-800 font-semibold">Firma Servicio al Cliente</span>
              <span className={`font-bold ${firmaServicioCliente ? 'text-green' : 'text-red-600'}`}>
                {firmaServicioCliente ? 'FIRMADO' : 'FALTA FIRMA'}
              </span>
            </div>

            {/* Firma Operaciones */}
            <div className="flex flex-col items-center p-2">
              <div className={`p-3 rounded-full flex justify-center items-center mb-2 ${firmaOperacion ? 'bg-green' : 'bg-gray'}`}>
                <FaSignature size="24" color={firmaOperacion ? 'black' : 'white'} />
              </div>
              <span className="text-gray-800 font-semibold">Firma Operaciones</span>
              <span className={`font-bold ${firmaOperacion ? 'text-green' : 'text-red-600'}`}>
                {firmaOperacion ? 'FIRMADO' : 'FALTA FIRMA'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default FooterBar;
