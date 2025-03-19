"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyAlert } from 'src/app/components/MyAlertContextProvider';
import Link from 'next/link';
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Server Error:', data.message); 
        
        return;
      }

      const data = await response.json();
      localStorage.setItem('rol', data.user.roles[0].role_name); 
      router.push('/');

      Swal.fire({
        title: "Registrado",
        icon: "error"
      });
    } catch (err) {
      console.error('Failed to register:', err);
      Swal.fire({
        title: "Error",
        text: "Error al registrarse",
        icon: "error"
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative overflow-hidden">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10">
        <h1 className="font-semibold text-2xl text-center text-[#0a74da] mb-2">Vinculación Clientes</h1>
        <h2 className="font-semibold text-xl text-center text-blue-600">Registro</h2>
        <p className="text-md mt-2 text-gray-600 text-center">Crea tu cuenta ingresando los datos</p>

        <form className="flex flex-col gap-6 mt-6" onSubmit={handleRegister}>
          <input
            className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            name="username"
            placeholder="Correo Electrónico"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="relative">
            <input
              className="p-4 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              type="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#0a74da] text-white rounded-xl py-3 hover:scale-105 transition-transform duration-300"
          >
            Registrarse
          </button>
        </form>

        <div className="mt-5 text-sm border-b border-gray-300 py-4 text-center text-gray-600">
          <Link href="/login" className="underline">¿Ya tienes una cuenta? Inicia sesión</Link>
        </div>

        <div className="mt-3 text-sm text-center text-gray-600">
          <p>Globalnews© 2024</p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
