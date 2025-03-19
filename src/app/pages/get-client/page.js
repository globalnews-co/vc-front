'use client';

import React, { useContext, useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import Bar from '../../components/Bar';
import { DataContext } from 'src/app/pages/context/DataContext';
import Modal from '../../components/Modal';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { getClient } from 'src/Utilities/Conexion';
import './Client.module.css';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

const ClientTable = () => {
  const { isModalOpen, setIsModalOpen } = useContext(DataContext);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientData, setClientData] = useState([]);
  const tableRef = useRef(null);
  const panelRef = useRef(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: 'contains' },
    'NIT CLIENTE': { value: null, matchMode: 'startsWith' },
    'NOMBRE': { value: null, matchMode: 'startsWith' },
    'FECHA CREACION CLIENTE': { value: null, matchMode: 'custom' }
  });

  useEffect(() => {
    const fetchClients = async () => {
      const response = await getClient();
      setClientData(response); // Ensure clientData is always an array
      console.log('RESPONSE', response); // Verify data is loaded
    };
    fetchClients();
  }, []);

  const clientIDTemplate = (rowData) => {
    return (
      <a onClick={() => setSelectedClient(rowData)} style={{ cursor: 'pointer', color: '#1E90FF' }}>
        {rowData['NIT CLIENTE']}
      </a>
    );
  };

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
  };

  const renderHeader = () => {
    const value = filters['global'] ? filters['global'].value : '';

    return (
      <IconField iconPosition="left" >
        {/* <InputIcon className="pi pi-search mr-3"/> */}
        <InputText type="search" value={value || ''} onChange={onGlobalFilterChange} placeholder="Buscar..." />
      </IconField>
    );
  };

  const header = renderHeader();

  // Date Filter Element
  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => {
          console.log('Filter Date Selected:', e.value); // Debugging log for selected date
          options.filterApplyCallback(e.value);
        }}
        dateFormat="dd/mm/yy" // Ensure consistent format
        placeholder="Select a date"
        className="p-column-filter"
      />
    );
  };

  // Custom Date Filter Function
const filterDate = (value, filter) => {
  if (!filter) {
    console.log('No filter applied'); 
    return true; 
  }
  if (!value) {
    console.log('No date value in data'); 
    return false; 
  }

  const valueDate = new Date(value);

  const filterDate = new Date(filter);

  valueDate.setHours(0, 0, 0, 0);  
  filterDate.setHours(0, 0, 0, 0); 

  console.log('Comparing:', valueDate.toDateString(), filterDate.toDateString());

  return valueDate.getTime() === filterDate.getTime();
};

  const dateBodyTemplate = (rowData) => {
    const date = new Date(rowData['FECHA CREACION CLIENTE']);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <main className="flex min-h-screen">
      <Bar />
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} queryType="Client" />}
      <div className="flex-1 flex justify-center items-start p-10 w-full">
        <div className="border p-6 rounded-lg shadow-lg w-full max-w-10xl flex flex-col overflow-hidden">
          <div className="flex gap-6 overflow-hidden">
            <div className="flex-1 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="flex flex-col space-y-1.5 p-6 px-7">
                <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Clientes</h3>
                <p className="text-sm text-muted-foreground">Lista de clientes creados.</p>
              </div>
              <div className="p-6 overflow-auto custom-table-wrapper" ref={tableRef}>
                <DataTable
                  value={clientData}
                  paginator
                  rows={10}
                  responsiveLayout="scroll"
                  className="p-datatable-gridlines custom-table"
                  header={header}
                  filters={filters}
                  onFilter={(e) => setFilters(e.filters)}
                  globalFilterFields={['NIT CLIENTE', 'NOMBRE']}
                  filterDisplay="menu"
                >
                  <Column
                    field="NIT CLIENTE"
                    header="NIT Cliente"
                    sortable
                    body={clientIDTemplate}
                    filter
                    filterField="NIT CLIENTE"
                    filterPlaceholder="Buscar por NIT"
                  />
                  <Column
                    field="NOMBRE"
                    header="Name"
                    sortable
                    filter
                    filterField="NOMBRE"
                    filterPlaceholder="Buscar por nombre"
                  />
                  <Column
                    field="FECHA CREACION CLIENTE"
                    header="Fecha Creación"
                    sortable
                    body={dateBodyTemplate}
                    // filter
                    // filterElement={dateFilterTemplate}
                    // filterFunction={filterDate} // Apply custom filter logic
                  />
                </DataTable>
              </div>
            </div>
            {selectedClient && (
              <div className="w-[600px] bg-background border-l shadow-lg flex flex-col overflow-auto" ref={panelRef}>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1 overflow-auto">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Detalles Cliente</h3>
                  </div>
                  <div className="p-6 overflow-auto details-content grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-muted-foreground">Nombre:</div>
                      <div>{selectedClient['NOMBRE']}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Consecutivo:</div>
                      <div>{selectedClient['CONSECUTIVO']}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">NIT:</div>
                      <div>{selectedClient['NIT CLIENTE']}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Fecha de Creación:</div>
                      <div>{selectedClient['FECHA CREACION CLIENTE']}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Dirección:</div>
                      <div>{selectedClient['DIRECCION']}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Teléfono:</div>
                      <div>{selectedClient['TELEFONO']}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Correo Electrónico:</div>
                      <div>{selectedClient['EMAIL']}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Persona de Contacto:</div>
                      <div>{selectedClient['PERSONA DE CONTACTO']}</div>
                    </div>
                    {/* <div>
                      <div className="text-muted-foreground">Celular:</div>
                      <div>{selectedClient['CELULAR']}</div>
                    </div> */}
                    <div>
                      <div className="text-muted-foreground">Ciudad:</div>
                      <div>{selectedClient['CIUDAD']}</div>
                    </div>
                    {/* <div>
                      <div className="text-muted-foreground">Actividad:</div>
                      <div>{selectedClient['ACTIVIDAD']}</div>
                    </div> */}
                    <div>
                      <div className="text-muted-foreground">Tipo:</div>
                      <div>{selectedClient['TIPO']}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Detalles Especiales:</div>
                      <div>{selectedClient['OBSERVACIONES']}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Pagador:</div>
                      <div>{selectedClient['PAGADOR']}</div>
                    </div>
                    <div className="static mb-10 transform col-span-2">
                      <button className="bg-brightBlue m-2 text-white py-2 px-4 rounded" onClick={() => setSelectedClient(null)}>Cerrar</button>
                    </div>
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