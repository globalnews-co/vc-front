'use client'

import { login } from 'src/Utilities/Conexion';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const router = useRouter();

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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500 p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <h2 className="font-bold text-3xl text-primary text-center">Inicio de Sesión</h2>
        <p className="text-sm mt-4 text-gray-600 text-center">Bienvenido de nuevo, por favor ingresa tus datos</p>

        <form className="flex flex-col gap-4 mt-8" onSubmit={handleLogin}>
          <input
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            type="text"
            id="username"
            name="username"
            placeholder="Correo Electrónico"
            required
          />
          <div className="relative">
            <input
              className="p-3 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-primary"
              type="password"
              id="password"
              name="password"
              placeholder="Contraseña"
              required
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="gray"
              className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
              viewBox="0 0 16 16"
            >
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
            </svg>
          </div>
          <button
            type="submit"
            className="bg-[#0a74da] rounded-xl text-white py-3 hover:scale-105 transition-transform duration-300"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-5 text-sm border-b border-gray-300 py-4 text-center text-gray-600">
          <Link href="/register">¿No tienes una cuenta? Regístrate</Link>
        </div>

        <div className="mt-3 text-sm text-center text-gray-600">
          <p>Globalnews© 2024</p>
        </div>
      </div>
    </section>
  )
};

export default LoginPage;
