'use client';

import { useState, useEffect, useContext } from "react";
import Bar from "../../components/Bar";
import ClientFields from "../../components/client/ClientFields";
import { DataContext } from "src/app/pages/context/DataContext";
import Modal from "../../components/Modal";
import { createClient } from "src/Utilities/Conexion"; // Ensure these functions are exported correctly
import Swal from 'sweetalert2';
import { FaCommentsDollar } from "react-icons/fa";

export default function CreateClient() {
  const { createClientData, setCreateClientData, isModalOpen, setIsModalOpen } = useContext(DataContext);

  useEffect(() => {
    const savedCreateClientData = localStorage.getItem('createClientData');
    if (savedCreateClientData) {
      setCreateClientData(JSON.parse(savedCreateClientData));
    }
  }, [setCreateClientData]);

  useEffect(() => {
    localStorage.setItem('createClientData', JSON.stringify(createClientData));
  }, [createClientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const isFormValid = () => {
    const requiredFields = [
      "NombreCliente",
      "Nit_Cliente",
      "Direccion",
      "Telefono",
      "Correo_Electronico",
      "Persona_de_Contacto",
      "Pagador",
      "Celular",
      "Birthday",
      "Ciudad",
      "Tipo",
      "Detalle_Especiales"
    ];
    
    for (const field of requiredFields) {
      if (!createClientData[field] || createClientData[field].trim() === "") {
        return false;
      }
    }
    return true;
  };
  

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Swal.fire({
        title: 'Datos incompletos',
        text: 'Por favor complete todos los campos requeridos.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      localStorage.setItem('createClientData', JSON.stringify(createClientData));
      const response = await createClient(createClientData);
      handleReset();
      Swal.fire({
        title: 'Cliente creado',
        text: 'El cliente ha sido creado exitosamente.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Error al insertar datos',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error('Error al insertar datos:', err);
    }
  };

  return (
    <main className="flex min-h-screen">
      <Bar />
      <div className="flex-1 flex justify-center items-start p-10">
        <div className="border p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold mb-4">Crear Cliente</h3>
            <div>
              <button className="bg-red-500 m-2 text-white py-2 px-4 rounded" onClick={handleReset}>Resetear</button>
              <button className="bg-brightBlue m-2 text-white py-2 px-4 rounded" onClick={handleSubmit}>Enviar</button>
            </div>
          </div>
          <ClientFields clientData={createClientData} handleChange={handleChange} isReadOnly={false} />
        </div>
      </div>
    </main>
  );
}