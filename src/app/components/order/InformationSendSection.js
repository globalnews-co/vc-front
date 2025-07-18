import { useContext, useState, useEffect } from "react";
import { DataContext } from "src/app/pages/context/DataContext";

const InformationSendSection = ({ data: dataSaved, isReadOnly, onChange }) => {
  const {
    createOrderDetails, 
    setCreateOrderDetails,
    queryOrderDetails,
  } = useContext(DataContext);

  // 🔧 USAR DATOS GUARDADOS O DATOS DE CONSULTA
  const data = dataSaved || queryOrderDetails || {};

  // Estados para contactos estructurados
  const [contactosAlertas, setContactosAlertas] = useState([]);
  const [contactosBoletines, setContactosBoletines] = useState([]);

  // 🔧 FUNCIÓN PARA NOTIFICAR CAMBIOS
  const notifyChange = (field, value) => {
    if (onChange && typeof onChange === 'function') {
      onChange(field, value);
    }
  };

  // 🔧 FUNCIÓN PARA GENERAR STRING DE CORREOS (para validación)
  const generateCorreosString = (contactos) => {
    return contactos
      .filter(contacto => contacto.correo && contacto.correo.trim())
      .map(contacto => contacto.correo.trim())
      .join(', ');
  };

  // 🔧 FUNCIÓN PARA SEPARAR CORREOS Y WHATSAPP
  const separateContactsAlertas = (contactos) => {
    const correos = [];
    const whatsapp = [];
    
    contactos.forEach(contacto => {
      if (contacto.correo && contacto.correo.trim()) {
        const valor = contacto.correo.trim();
        if (valor.includes('@')) {
          correos.push(valor);
        } else {
          whatsapp.push(valor);
        }
      }
    });
    
    return {
      correos: correos.join(', '),
      whatsapp: whatsapp.join(', '),
      total: correos.concat(whatsapp).join(', ')
    };
  };

  // 🔧 FUNCIÓN PARA PARSEAR CONTACTOS DESDE STRING
  const parseContactosFromString = (stringData) => {
    if (!stringData || stringData.trim() === '') return [];
    
    try {
      // Si es JSON, intentar parsearlo
      if (stringData.trim().startsWith('[')) {
        return JSON.parse(stringData);
      }
      
      // Si es una cadena separada por comas, crear objetos
      const items = stringData.split(',').map(item => item.trim()).filter(item => item);
      return items.map((item, index) => ({
        id: Date.now() + index,
        correo: item
      }));
    } catch (error) {
      console.error('Error parsing contactos:', error);
      return [];
    }
  };

  // 🔧 FUNCIÓN PARA OBTENER CONTACTOS DE ALERTAS
  const getContactosAlertasValue = () => {
    console.log('🔍 Obteniendo contactos de alertas, datos disponibles:', {
      CONTACTOS_ALERTAS: data['CONTACTOS_ALERTAS'],
      Contactos_Alertas: data['Contactos_Alertas'],
      ALERTAS_CORREOS: data['ALERTAS_CORREOS'],
      WHATSAPP: data['WHATSAPP'],
      Correos_Alertas: data['Correos_Alertas']
    });

    // Prioridad: datos estructurados > datos de string
    const contactosStructured = data['CONTACTOS_ALERTAS'] || data['Contactos_Alertas'] || '';
    if (contactosStructured) {
      try {
        return typeof contactosStructured === 'string' ? JSON.parse(contactosStructured) : contactosStructured;
      } catch (error) {
        console.error('Error parsing contactos alertas structured:', error);
      }
    }

    // Fallback a campos de string de la base de datos
    const alertasCorreos = data['ALERTAS_CORREOS'] || data['Correos_Alertas'] || '';
    const whatsapp = data['WHATSAPP'] || data['Numeros_Whatsapp'] || '';
    
    console.log('📧 Procesando campos de BD:', { alertasCorreos, whatsapp });
    
    if (alertasCorreos || whatsapp) {
      const contactos = [];
      let idCounter = Date.now();
      
      // Agregar correos
      if (alertasCorreos && alertasCorreos.trim()) {
        const correos = alertasCorreos.split(',').map(item => item.trim()).filter(item => item);
        correos.forEach(correo => {
          contactos.push({
            id: idCounter++,
            correo: correo
          });
        });
      }
      
      // Agregar números WhatsApp
      if (whatsapp && whatsapp.trim()) {
        const numeros = whatsapp.split(',').map(item => item.trim()).filter(item => item);
        numeros.forEach(numero => {
          contactos.push({
            id: idCounter++,
            correo: numero
          });
        });
      }
      
      console.log('✅ Contactos de alertas generados:', contactos);
      return contactos;
    }
    
    console.log('❌ No se encontraron contactos de alertas');
    return [];
  };

  // 🔧 FUNCIÓN PARA OBTENER CONTACTOS DE BOLETINES
  const getContactosBoletinesValue = () => {
    console.log('🔍 Obteniendo contactos de boletines, datos disponibles:', {
      CONTACTOS_BOLETINES: data['CONTACTOS_BOLETINES'],
      Contactos_Boletines: data['Contactos_Boletines'],
      NEWSLETERS_CORREOS: data['NEWSLETERS_CORREOS'],
      Correos_Boletines: data['Correos_Boletines']
    });

    // Prioridad: datos estructurados > datos de string
    const contactosStructured = data['CONTACTOS_BOLETINES'] || data['Contactos_Boletines'] || '';
    if (contactosStructured) {
      try {
        return typeof contactosStructured === 'string' ? JSON.parse(contactosStructured) : contactosStructured;
      } catch (error) {
        console.error('Error parsing contactos boletines structured:', error);
      }
    }

    // Fallback a campos de string de la base de datos
    const boletinesCorreos = data['NEWSLETERS_CORREOS'] || data['Correos_Boletines'] || '';
    
    console.log('📧 Procesando campo de BD boletines:', { boletinesCorreos });
    
    if (boletinesCorreos && boletinesCorreos.trim()) {
      const correos = boletinesCorreos.split(',').map(item => item.trim()).filter(item => item);
      const contactos = correos.map((correo, index) => ({
        id: Date.now() + index,
        correo: correo
      }));
      
      console.log('✅ Contactos de boletines generados:', contactos);
      return contactos;
    }
    
    console.log('❌ No se encontraron contactos de boletines');
    return [];
  };

  // 🔧 CARGAR CONTACTOS AL MONTAR EL COMPONENTE O CAMBIAR DATOS
  useEffect(() => {
    console.log('🔄 Cargando contactos desde datos:', data);
    
    const savedContactosAlertas = getContactosAlertasValue();
    const savedContactosBoletines = getContactosBoletinesValue();

    console.log('📧 Contactos cargados:', {
      alertas: savedContactosAlertas,
      boletines: savedContactosBoletines
    });

    setContactosAlertas(savedContactosAlertas);
    setContactosBoletines(savedContactosBoletines);
  }, [data, dataSaved, queryOrderDetails]);

  // 🔧 FUNCIONES PARA MANEJAR CONTACTOS DE ALERTAS
  const agregarContactoAlertas = () => {
    const nuevoContacto = {
      id: Date.now(),
      correo: ''
    };

    const nuevosContactos = [...contactosAlertas, nuevoContacto];
    setContactosAlertas(nuevosContactos);
    actualizarContactosAlertas(nuevosContactos);
  };

  const eliminarContactoAlertas = (id) => {
    const nuevosContactos = contactosAlertas.filter(contacto => contacto.id !== id);
    setContactosAlertas(nuevosContactos);
    actualizarContactosAlertas(nuevosContactos);
  };

  const actualizarContactoAlertas = (id, campo, valor) => {
    const nuevosContactos = contactosAlertas.map(contacto =>
      contacto.id === id ? { ...contacto, [campo]: valor } : contacto
    );
    setContactosAlertas(nuevosContactos);
    actualizarContactosAlertas(nuevosContactos);
  };

  // 🔧 FUNCIÓN PRINCIPAL PARA ACTUALIZAR CONTACTOS DE ALERTAS
  const actualizarContactosAlertas = (contactos) => {
    const contactosData = JSON.stringify(contactos);
    const contactsSeparated = separateContactsAlertas(contactos);
    
    console.log('🚨 Actualizando contactos alertas:', {
      contactos,
      contactosData,
      correos: contactsSeparated.correos,
      whatsapp: contactsSeparated.whatsapp,
      total: contactsSeparated.total
    });

    // Solo actualizar si no estamos en modo de solo lectura
    if (!isReadOnly) {
      // Actualizar el estado principal del contexto
      setCreateOrderDetails(prevDetails => {
        const newDetails = {
          ...prevDetails,
          CONTACTOS_ALERTAS: contactosData,
          Contactos_Alertas: contactosData,
          Correos_Alertas: contactsSeparated.total, // 🔧 CRÍTICO: Para validación
          ALERTAS_CORREOS: contactsSeparated.correos, // Para BD
          WHATSAPP: contactsSeparated.whatsapp // Para BD
        };
        
        console.log('🔄 Actualizando createOrderDetails (alertas):', newDetails);
        return newDetails;
      });

      // Notificar cambios
      notifyChange('CONTACTOS_ALERTAS', contactosData);
      notifyChange('Correos_Alertas', contactsSeparated.total);
      notifyChange('ALERTAS_CORREOS', contactsSeparated.correos);
      notifyChange('WHATSAPP', contactsSeparated.whatsapp);
    }
  };

  // 🔧 FUNCIONES PARA MANEJAR CONTACTOS DE BOLETINES
  const agregarContactoBoletines = () => {
    const nuevoContacto = {
      id: Date.now(),
      correo: ''
    };

    const nuevosContactos = [...contactosBoletines, nuevoContacto];
    setContactosBoletines(nuevosContactos);
    actualizarContactosBoletines(nuevosContactos);
  };

  const eliminarContactoBoletines = (id) => {
    const nuevosContactos = contactosBoletines.filter(contacto => contacto.id !== id);
    setContactosBoletines(nuevosContactos);
    actualizarContactosBoletines(nuevosContactos);
  };

  const actualizarContactoBoletines = (id, campo, valor) => {
    const nuevosContactos = contactosBoletines.map(contacto =>
      contacto.id === id ? { ...contacto, [campo]: valor } : contacto
    );
    setContactosBoletines(nuevosContactos);
    actualizarContactosBoletines(nuevosContactos);
  };

  // 🔧 FUNCIÓN PRINCIPAL PARA ACTUALIZAR CONTACTOS DE BOLETINES
  const actualizarContactosBoletines = (contactos) => {
    const contactosData = JSON.stringify(contactos);
    const correosString = generateCorreosString(contactos);
    
    console.log('📧 Actualizando contactos boletines:', {
      contactos,
      contactosData,
      correosString,
      longitud: correosString.length
    });

    // Solo actualizar si no estamos en modo de solo lectura
    if (!isReadOnly) {
      // Actualizar el estado principal del contexto
      setCreateOrderDetails(prevDetails => {
        const newDetails = {
          ...prevDetails,
          CONTACTOS_BOLETINES: contactosData,
          Contactos_Boletines: contactosData,
          Correos_Boletines: correosString, // 🔧 CRÍTICO: Para validación
          NEWSLETERS_CORREOS: correosString // Para BD
        };
        
        console.log('🔄 Actualizando createOrderDetails (boletines):', newDetails);
        return newDetails;
      });

      // Notificar cambios
      notifyChange('CONTACTOS_BOLETINES', contactosData);
      notifyChange('Correos_Boletines', correosString);
      notifyChange('NEWSLETERS_CORREOS', correosString);
    }
  };

  // 🔧 INICIALIZAR CAMPOS VACÍOS PARA VALIDACIÓN (solo en modo edición)
  useEffect(() => {
    if (!isReadOnly) {
      // Inicializar campos vacíos si no existen
      if (!createOrderDetails.Correos_Alertas) {
        const contactsSeparated = separateContactsAlertas(contactosAlertas);
        setCreateOrderDetails(prevDetails => ({
          ...prevDetails,
          Correos_Alertas: contactsSeparated.total
        }));
        notifyChange('Correos_Alertas', contactsSeparated.total);
      }

      if (!createOrderDetails.Correos_Boletines) {
        const correosString = generateCorreosString(contactosBoletines);
        setCreateOrderDetails(prevDetails => ({
          ...prevDetails,
          Correos_Boletines: correosString
        }));
        notifyChange('Correos_Boletines', correosString);
      }
    }
  }, [contactosAlertas, contactosBoletines, isReadOnly]);

  // 🔧 ASEGURAR QUE LOS CAMPOS EXISTEN AL MONTAR EL COMPONENTE (solo en modo edición)
  useEffect(() => {
    if (!isReadOnly) {
      // Asegurar que los campos de validación existen
      if (typeof createOrderDetails.Correos_Alertas === 'undefined') {
        setCreateOrderDetails(prevDetails => ({
          ...prevDetails,
          Correos_Alertas: ''
        }));
      }

      if (typeof createOrderDetails.Correos_Boletines === 'undefined') {
        setCreateOrderDetails(prevDetails => ({
          ...prevDetails,
          Correos_Boletines: ''
        }));
      }
    }
  }, [isReadOnly]);

  return (
    <div className="rounded-lg">
      <hr className="my-6 border-t border-gray-300 pb-2" />

      <h5 className="text-md font-semibold mb-4">ENVÍO DE INFORMACIÓN</h5>

      {/* Sección de Alertas */}
      <div className="mb-6">
        <h6 className="text-sm font-semibold mb-3 text-gray-700">CORREOS ALERTAS</h6>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">
              Correos y números WhatsApp *
            </label>
            {!isReadOnly && (
              <button
                type="button"
                onClick={agregarContactoAlertas}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                + Agregar
              </button>
            )}
          </div>

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Correos / Números WhatsApp
                    </th>
                    {!isReadOnly && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contactosAlertas.length === 0 ? (
                    <tr>
                      <td colSpan={isReadOnly ? 2 : 3} className="px-3 py-3 text-center text-gray-500 text-sm">
                        No hay contactos configurados para alertas
                      </td>
                    </tr>
                  ) : (
                    contactosAlertas.map((contacto, index) => (
                      <tr key={contacto.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={contacto.correo || ''}
                            onChange={(e) => actualizarContactoAlertas(contacto.id, 'correo', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                            placeholder="email@empresa.com o 300 123 4567"
                            disabled={isReadOnly}
                          />
                        </td>
                        {!isReadOnly && (
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => eliminarContactoAlertas(contacto.id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Eliminar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Boletines */}
      <div>
        <h6 className="text-sm font-semibold mb-3 text-gray-700">CORREOS BOLETINES</h6>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">
              Correos electrónicos *
            </label>
            {!isReadOnly && (
              <button
                type="button"
                onClick={agregarContactoBoletines}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                + Agregar
              </button>
            )}
          </div>

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Correos Electrónicos
                    </th>
                    {!isReadOnly && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contactosBoletines.length === 0 ? (
                    <tr>
                      <td colSpan={isReadOnly ? 2 : 3} className="px-3 py-3 text-center text-gray-500 text-sm">
                        No hay contactos configurados para boletines
                      </td>
                    </tr>
                  ) : (
                    contactosBoletines.map((contacto, index) => (
                      <tr key={contacto.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="email"
                            value={contacto.correo || ''}
                            onChange={(e) => actualizarContactoBoletines(contacto.id, 'correo', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                            placeholder="email@empresa.com"
                            disabled={isReadOnly}
                          />
                        </td>
                        {!isReadOnly && (
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => eliminarContactoBoletines(contacto.id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Eliminar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default InformationSendSection;