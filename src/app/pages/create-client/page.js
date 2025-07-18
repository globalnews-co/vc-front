'use client';

import { useState, useEffect, useContext } from "react";
import Bar from "../../components/Bar";
import ClientFields from "../../components/client/ClientFields";
import { DataContext } from "src/app/pages/context/DataContext";
import Modal from "../../components/Modal";
import { createClient } from "src/Utilities/Conexion";
import Swal from 'sweetalert2';
import { 
  UserPlus, 
  RefreshCw, 
  Send, 
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function CreateClient() {
  const { createClientData, setCreateClientData, isModalOpen, setIsModalOpen } = useContext(DataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Load saved form data from localStorage
  useEffect(() => {
    const savedCreateClientData = localStorage.getItem('createClientData');
    if (savedCreateClientData) {
      setCreateClientData(JSON.parse(savedCreateClientData));
      
      // Calculate form progress
      calculateFormProgress(JSON.parse(savedCreateClientData));
    }
  }, [setCreateClientData]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('createClientData', JSON.stringify(createClientData));
    calculateFormProgress(createClientData);
  }, [createClientData]);

  // Calculate form completion percentage
  const calculateFormProgress = (data) => {
    const requiredFields = [
      "NombreCliente", "Nit_Cliente", "Direccion", "Telefono", 
      "Correo_Electronico", "Persona_de_Contacto", "Pagador", 
      "Celular", "Birthday", "Ciudad", "Tipo", "Detalle_Especiales"
    ];
    
    let filledFields = 0;
    for (const field of requiredFields) {
      if (data[field] && data[field].trim() !== "") {
        filledFields++;
      }
    }
    
    setFormProgress(Math.round((filledFields / requiredFields.length) * 100));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Reset form
const handleReset = () => {
    setCreateClientData({
          NombreCliente: "",
          Cliente_ID: "",
          Nit_Cliente: "",
          FechaCreacionCliente: "",
          Direccion: "",
          Telefono: "",
          Correo_Electronico: "",
          Persona_de_Contacto: "",
          Detalle_Especiales: "",
          Celular: "",
          Actividad: "",
          Pagador: "",
          Birthday: "",
          Ciudad: "",
          Tipo: ""
        });
  };

  // Validate form
  const isFormValid = () => {
    const requiredFields = [
      "NombreCliente", "Nit_Cliente", "Direccion", "Telefono", 
      "Correo_Electronico", "Persona_de_Contacto", "Pagador", 
      "Celular", "Birthday", "Ciudad", "Tipo", "Detalle_Especiales"
    ];
    
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!createClientData[field] || createClientData[field].trim() === "") {
        const fieldLabels = {
          NombreCliente: "Nombre del Cliente",
          Nit_Cliente: "NIT",
          Direccion: "Dirección",
          Telefono: "Teléfono",
          Correo_Electronico: "Correo Electrónico",
          Persona_de_Contacto: "Persona de Contacto",
          Pagador: "Pagador",
          Celular: "Celular",
          Birthday: "Fecha de Nacimiento",
          Ciudad: "Ciudad",
          Tipo: "Tipo",
          Detalle_Especiales: "Detalles Especiales"
        };
        
        missingFields.push(fieldLabels[field] || field);
      }
    }
    
    if (missingFields.length > 0) {
      Swal.fire({
        title: 'Datos incompletos',
        html: `
          <p>Por favor complete los siguientes campos:</p>
          <ul class="text-left mt-2 pl-4">
            ${missingFields.map(field => `<li class="list-disc">• ${field}</li>`).join('')}
          </ul>
        `,
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return false;
    }
    
    return true;
  };
  
  // Submit form
  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      localStorage.setItem('createClientData', JSON.stringify(createClientData));
      const response = await createClient(createClientData);
      
      Swal.fire({
        title: '¡Cliente creado exitosamente!',
        text: 'Los datos del cliente han sido registrados en el sistema',
        icon: 'success',
        confirmButtonText: 'Continuar'
      });
      
      handleReset();
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: `Error al crear el cliente: ${err.message || 'Intente nuevamente más tarde'}`,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      console.error('Error al insertar datos:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen">
      <Bar />
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} queryType="Client" />}
      
      <div className="flex-1 p-6 md:p-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">CREAR CLIENTE</h1>
              <p className="mt-1 text-sm text-gray-500">Ingresa la información del cliente para registrarlo en el sistema</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Progreso del formulario:</span>
              <div className="w-56 bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${formProgress < 50 ? 'bg-red-500' : formProgress < 100 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{formProgress}%</span>
            </div>
          </div>
        </div>
        
        {/* Main form card */}
        <div className="bg-white overflow-hidden">
        
          
          {/* Form content */}
          <div className=" py-8">
            <ClientFields clientData={createClientData} handleChange={handleChange} isReadOnly={false} />
          </div>
          
          <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t">
         
            
            <div className="flex space-x-3">
              <button 
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resetear
              </button>
              
              <button 
                className={`inline-flex items-center justify-center px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Crear Cliente
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}