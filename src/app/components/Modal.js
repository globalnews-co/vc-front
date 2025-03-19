import { useContext, useState } from "react";
import { getOT, getClient } from "src/Utilities/Conexion";
import { DataContext } from "../pages/context/DataContext";

export default function Modal({ onClose, queryType, onSubmit }) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setOrderDetails, setClientData, setIsModalOpen, setQueryOrderNumber, setClientNIT, setIsReadOnly } = useContext(DataContext);

  const handleQuery = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (queryType === 'OT') {
        response = await getOT(inputValue);
        if (response) {
          setOrderDetails(response);
          setQueryOrderNumber(inputValue);
          setIsReadOnly(true); // Establecer los campos como solo lectura
          localStorage.setItem('queryOrderDetails', JSON.stringify(response)); 
          onSubmit(response); 
        } else {
          throw new Error('Orden no encontrada');
        }
      } else if (queryType === 'Client') {
        response = await getClient(inputValue);
        if (response) {
          setClientData(response);
          setClientNIT(inputValue);
          setIsReadOnly(true); // Establecer los campos como solo lectura
          localStorage.setItem('queryClientData', JSON.stringify(response)); 
        } else {
          throw new Error('Cliente no encontrado');
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al obtener los datos. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='fixed inset-0 flex items-center justify-center z-50 bg-gray-800'>
        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>
        <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-xl max-w-xs w-full p-6 z-50 relative max-h-[90vh] overflow-y-auto">
          <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800" onClick={onClose}>
            &#10005;
          </button>
          <span className="mr-2">Introduzca el {queryType === 'OT' ? 'número de orden' : 'NIT del cliente'} a consultar</span>
          <input
            className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="mt-4 bg-brightBlue m-2 text-white py-2 px-4 rounded"
            onClick={handleQuery}
            disabled={loading}
          >
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
          {error && <div className="mt-2 text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
}
