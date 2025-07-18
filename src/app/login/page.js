'use client'
import { login } from 'src/Utilities/Conexion';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';

// Añadir estilos CSS personalizados
const customStyles = `
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
    };

    login(data)
      .then((res) => {
        console.log(res)
        localStorage.setItem('vc_user_id', res.user._id);
        localStorage.setItem('vc_username', res.user.username);
        localStorage.setItem('vc_nombre', res.user.nombre);
        localStorage.setItem('vc_role_id', res.user.roles[0].id);
        localStorage.setItem('vc_role_name', res.user.roles[0].role_name);
        router.push('/');
        Swal.fire({
          title: "Bienvenido!",
          text: "Inicio de sesión éxitoso",
          icon: "success"
        });
      })
      .catch((err) => {
        console.log('Error al iniciar sesión:', err);
        Swal.fire({
          title: "Error",
          text: "Error al iniciar sesión",
          icon: "error"
        });
      });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 relative p-6 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 max-w-md w-full p-8 z-10">
        <div className="mb-4 text-center">
          <h1 className="text-sm mb-2">Vinculación Clientes
          </h1>

          <h2 className="font-bold text-1xl text-gray-800 mb-2 relative inline-block">
            INICIAR SESIÓN
          </h2>
          <p className="text-gray-600 text-sm">Por favor, complete el formulario para ingresar</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                className="p-3 pl-10 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all duration-200 bg-white/80"
                type="text"
                id="username"
                name="username"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                className="p-3 pl-10 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all duration-200 bg-white/80"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 hover:text-blue-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 hover:text-blue-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* <div className="mt-6 text-center">
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-300"
          >
            ¿No tiene una cuenta? Regístrese
          </Link>
        </div> */}

        <div className="mt-6 pt-5 border-t border-gray-200">
          <p className="text-center text-xs">
            Globalnews© {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;