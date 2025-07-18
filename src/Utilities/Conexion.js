import axios from 'axios';

export const fetchOptions = async () => {
  try {
    const response = await axios.get('/api/ot/options');
    return response.data;
  } catch (error) {
    console.log('Ha ocurrido un error: ', error);
  }
}

export const updateOT = async (orderData) => {
  try {
    // Asegúrate de que el ID esté presente
    if (!orderData.id && !orderData['orden de trabajo']) {
      throw new Error('ID de la orden de trabajo es requerido');
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/actualizarOT`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la orden de trabajo:', error);
    throw error;
  }
};

export const fetchClientes = async () => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`);
    return response.data;
  } catch (error) {
    console.log('Ha ocurrido un error: ', error);
  }
}


export const sendData = async (newOrder) => {
  const response = await axios.post("/api/ot/post", newOrder);
  return response.data;
}

export const createClient = async (clientData) => {
  const response = await axios.post("/api/client/post", clientData);
  return response.data;
}

export const getOT = async (ot) => {
  try {
    const response = await axios.post("/api/ot/get", { ot });
    return response.data[0];
  } catch (error) {
    console.log(error)
  }
}

export const getOTForCheking = async (nit) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ots`, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  return await response.json();
}

export const getSearchOTChecking = async (fechaInicio, fechaFin) => {
  // Convertir las fechas a formato 'YYYY-MM-DD' si es necesario
  const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
  const fechaFinStr = fechaFin.toISOString().split('T')[0];

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ots?fechaInicio=${fechaInicioStr}&fechaFin=${fechaFinStr}`, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  return await response.json();
}


export const getClient = async (nit) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  return await response.json();
}


export const newUser = async (data) => {
  const response = await axios.post("/api/auth/register",
    data
  );
  return response.data;

}
export const login = async (data) => {
  const response = await axios.post("/api/auth/login",
    data
  );
  return response.data;
}
export const register = async (res) => {
  const response = await axios.post("/api/auth/register",
    res
  );
  return response.res;
}

export const updateSignature = async (selectedOrder, rol, observacionesCierre) => {
  try {
    const updateData = {
      id: selectedOrder['orden de trabajo'],
    };

    // Solo agregar observacionesCierre si el rol es de Operaciones
    if (rol === '3') {
      updateData.observacionesCierre = observacionesCierre;
    }

    switch (rol) {
      case '1': // Comercial
        updateData.firmaComercial = '1';
        break;
      case '2': // Servicio al Cliente
        updateData.firmaServicioCliente = '1';
        break;
      case '3': // Operaciones
        updateData.firmaOperaciones = '1';
        break;
      default:
        throw new Error('Rol no válido');
    }

    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/update-ots`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error al firmar la orden:', error);
    throw error;
  }
};


export const logOrderSignature = async (logData) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/log`, logData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar la firma en el log:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
      const response = await axios.post('/api/auth/logout');
      return response; 
  } catch (error) {
      console.log('Error al cerrar sesión:', error);
  }
};
