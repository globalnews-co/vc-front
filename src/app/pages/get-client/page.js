'use client';

import React, { useContext, useState, useEffect, useRef } from 'react';
import Bar from '../../components/Bar';
import { DataContext } from 'src/app/pages/context/DataContext';
import Modal from '../../components/Modal';
import { getClient } from 'src/Utilities/Conexion';
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const ClientTable = () => {
  const { isModalOpen, setIsModalOpen } = useContext(DataContext);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientData, setClientData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      const response = await getClient();
      setClientData(response);
    };
    fetchClients();
  }, []);

  // Convert date string to Date object for comparison
  const parseDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  // Filter data based on search text and date range
  const filteredData = clientData.filter((client) => {
    // Text search filter
    const textMatch = !searchText || (
      (client['NIT CLIENTE'] && client['NIT CLIENTE'].toString().toLowerCase().includes(searchText.toLowerCase())) ||
      (client['NOMBRE'] && client['NOMBRE'].toLowerCase().includes(searchText.toLowerCase()))
    );

    // Date range filter
    let dateMatch = true;
    if (dateFilter.startDate || dateFilter.endDate) {
      const clientDate = parseDate(client['FECHA CREACION CLIENTE']);

      if (!clientDate) return false;

      if (dateFilter.startDate && dateFilter.endDate) {
        const start = parseDate(dateFilter.startDate);
        const end = parseDate(dateFilter.endDate);
        // Set end date to end of day for inclusive range
        end.setHours(23, 59, 59, 999);
        dateMatch = clientDate >= start && clientDate <= end;
      } else if (dateFilter.startDate) {
        const start = parseDate(dateFilter.startDate);
        dateMatch = clientDate >= start;
      } else if (dateFilter.endDate) {
        const end = parseDate(dateFilter.endDate);
        // Set end date to end of day for inclusive range
        end.setHours(23, 59, 59, 999);
        dateMatch = clientDate <= end;
      }
    }

    return textMatch && dateMatch;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, dateFilter]);

  // Sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (sortConfig.key === 'FECHA CREACION CLIENTE') {
          // Sort dates
          return sortConfig.direction === 'ascending'
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        } else {
          // Sort strings
          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <ChevronDown className="h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ChevronUp className="h-4 w-4" /> :
      <ChevronDown className="h-4 w-4" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Handle date filter changes
  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  // Clear date filters
  const clearDateFilters = () => {
    setDateFilter({ startDate: '', endDate: '' });
  };

  return (
    <main className="flex min-h-screen">
      <Bar />
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} queryType="Client" />}
      <div className="flex-1 flex justify-center items-start p-10 w-full">
        <div className=" rounded-lg w-full max-w-10xl flex flex-col overflow-hidden">
          <div className="flex gap-6 overflow-hidden">
            <div className="flex-1 bg-white text-gray-900 shadow-sm overflow-hidden">
              <div className="flex flex-col space-y-1.5 p-6 px-7">
                <h3 className="whitespace-nowrap text-2xl leading-none tracking-tight">CLIENTES</h3>
                <p className="text-sm text-gray-500">Lista de clientes creados.</p>
              </div>

              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                  

                  {/* Filtros por fecha */}
                  <div className="flex flex-col md:flex-row gap-4 w-full">

                     <div className="relative w-full md:w-64">
                    <label className="block text-sm text-gray-700 mb-1">Buscar</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <Search className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Buscar por NIT o nombre..."
                        className="pl-10 pr-4 text-sm py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                    <div className="w-full md:w-auto">
                      <label className="block text-sm text-gray-700 mb-1">Fecha Inicio</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <Calendar className="h-4 w-4" />
                        </span>
                        <input
                          type="date"
                          name="startDate"
                          value={dateFilter.startDate}
                          onChange={handleDateFilterChange}
                          className="pl-10 pr-4 text-sm py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      
                      <label className="block text-sm text-gray-700 mb-1">Fecha Fin</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <Calendar className="h-4 w-4" />
                        </span>
                        <input
                          type="date"
                          name="endDate"
                          value={dateFilter.endDate}
                          onChange={handleDateFilterChange}
                          className="pl-10 pr-4 py-2 text-sm w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                  
                  </div>
                </div>
              </div>

              {(dateFilter.startDate || dateFilter.endDate) && (
                <div className="mt-2 p-2 mx-4">
                  <span className="text-sm text-gray-600 mr-2">Filtros activos:</span>
                  <div className="flex flex-wrap gap-2">
                    {dateFilter.startDate && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Desde: {formatDate(dateFilter.startDate)}
                      </span>
                    )}
                    {dateFilter.endDate && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Hasta: {formatDate(dateFilter.endDate)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('NIT CLIENTE')}
                      >
                        <div className="flex items-center">
                          NIT Cliente
                          {getSortIcon('NIT CLIENTE')}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('NOMBRE')}
                      >
                        <div className="flex items-center">
                          Nombre
                          {getSortIcon('NOMBRE')}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('FECHA CREACION CLIENTE')}
                      >
                        <div className="flex items-center">
                          Fecha Creación
                          {getSortIcon('FECHA CREACION CLIENTE')}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((client, index) => (
                        <tr
                          key={index}
                          className={`${selectedClient && selectedClient['NIT CLIENTE'] === client['NIT CLIENTE'] ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer transition-colors`}
                          onClick={() => setSelectedClient(client)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="text-sm font-medium pl-5 text-blue-600">{client['NIT CLIENTE']}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{client['NOMBRE']}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{formatDate(client['FECHA CREACION CLIENTE'])}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-4 py-4 text-center text-gray-500">No hay datos disponibles</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 0 && (
  <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
    <div className="flex-1 flex justify-between sm:hidden">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
      >
        Anterior
      </button>
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
      >
        Siguiente
      </button>
    </div>
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * rowsPerPage, filteredData.length)}</span> de <span className="font-medium">{filteredData.length}</span> resultados
        </p>
      </div>
      <div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <span className="sr-only">Anterior</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            // Show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === pageNum
                    ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                    : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <span className="sr-only">Siguiente</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
)}

            </div>

            {/* Client details panel */}
            {selectedClient && (
              <div className="w-[600px] flex flex-col overflow-auto">
                <div className="rounded-lg border bg-white text-gray-900 shadow-sm flex-1 overflow-auto">
                  {/* Header with close button */}
                  <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-SM leading-none tracking-tight">DETALLES CLIENTE</h3>
                    <button
                      className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setSelectedClient(null)}
                      aria-label="Cerrar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Client summary section */}
                  <div className=" p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold">{selectedClient['NOMBRE']}</h4>
                        <p className="text-sm">NIT: {selectedClient['NIT CLIENTE']}</p>
                      </div>
                      <div className="bg-white rounded-lg px-4 py-2 border border-blue-100">
                        <p className="text-sm text-gray-500">Tipo</p>
                        <p className="font-medium">{selectedClient['TIPO'] || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details sections with cards */}
                  <div className="p-6">
                    <h4 className="font-medium text-gray-800 mb-4">Información de Contacto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Correo Electrónico</span>
                        </div>
                        <p className="text-gray-800 truncate">{selectedClient['EMAIL'] || 'No especificado'}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Teléfono</span>
                        </div>
                        <p className="text-gray-800">{selectedClient['TELEFONO'] || 'No especificado'}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Dirección</span>
                        </div>
                        <p className="text-gray-800">{selectedClient['DIRECCION'] || 'No especificada'}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Persona de Contacto</span>
                        </div>
                        <p className="text-gray-800">{selectedClient['PERSONA DE CONTACTO'] || 'No especificada'}</p>
                      </div>
                    </div>

                    <h4 className="font-medium text-gray-800 mb-4">Información Adicional</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Fecha de Creación</span>
                        </div>
                        <p className="text-gray-800">{formatDate(selectedClient['FECHA CREACION CLIENTE']) || 'No especificada'}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Consecutivo</span>
                        </div>
                        <p className="text-gray-800">{selectedClient['CONSECUTIVO'] || 'No especificado'}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Ciudad</span>
                        </div>
                        <p className="text-gray-800">{selectedClient['CIUDAD'] || 'No especificada'}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Pagador</span>
                        </div>
                        <p className="text-gray-800">{selectedClient['PAGADOR'] || 'No especificado'}</p>
                      </div>
                    </div>

                    {selectedClient['OBSERVACIONES'] && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-800 mb-4">Detalles Especiales</h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <p className="text-gray-800 whitespace-pre-line">{selectedClient['OBSERVACIONES']}</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClientTable;