import React from 'react';
import Bar from './components/Bar';
import { DataProvider } from 'src/app/pages/context/DataContext';
import 'src/app/styles/write.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  
import 'primereact/resources/primereact.min.css';  
import 'primeicons/primeicons.css';  

export default function Page() {
  return (
    <DataProvider>
      <main className="flex min-h-screen">
        <Bar />
        <div className="flex-1 p-10 bg-gradient-radial-custom">
          <h1 className="text-4xl font-bold text-gray-900 typing-effect">Vinculación Clientes</h1>
          <p className="mt-4 text-lg text-gray-600">
            Bienvenido al nuevo Módulo de Creacion de Ordenes de Trabajo de <span className="font-semibold">GlobalNews Colombia</span>.
          </p>
        </div>
      </main>
    </DataProvider>
  );
}
