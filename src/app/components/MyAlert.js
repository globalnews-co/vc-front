import React from 'react';
import { useMyAlert } from './MyAlertContextProvider';

const MyAlert = ({ alertText, type }) => {
  const { closeMyAlert } = useMyAlert();

  const colorsBgGdType = {
    success: 'from-[#fcf1e73d] to-[#34d399]',
    warning: 'from-[#fcf1e73d] to-[#fb9324d4]',
    error: 'from-[#fce7e712] to-[#f47272c7]',
    load: 'from-[#fcf1e73d] to-[#34d3d3]',
  };

  const colorsBgType = {
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    load: 'bg-blue-600',
  };

  const borderColorsType = {
    success: 'border-green-600',
    warning: 'border-yellow-600',
    error: 'border-red-600',
    load: 'border-blue-600',
  };

  const iconColorsType = {
    success: 'green',
    warning: '#fb9324d4',
    error: 'red',
  };

  const icons = {
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" style={{ height: "6rem", width: "8rem", color: "#3279b7", fill: iconColorsType[type] }}>
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" style={{ height: "6rem", width: "8rem", color: "#3279b7", fill: iconColorsType[type] }}>
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" style={{ height: "6rem", width: "8rem", color: "#3279b7", fill: iconColorsType[type] }}>
        <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
      </svg>
    ),
    load: (
      <div role="status">
        <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    )
  };

  return (
    <div className={`fixed top-0 w-full min-h-screen bg-gradient-to-b ${colorsBgGdType[type]} flex justify-center items-center`}>
      <div className="bg-white rounded-lg">
        <div className={`w-96 border-t-8 ${borderColorsType[type]} rounded-lg flex`}>
          <div className="w-1/3 pt-6 flex justify-center">
            {icons[type]}
          </div>
          <div className="w-full pt-9 pr-4">
            <h3 className="font-bold text-pink-700">
              {type === "error" ? "Ocurrió un error" : type === "success" ? "Operación completada con éxito" : type === "warning" ? "Advertencia" : ""}
            </h3>
            <p className="py-4 text-sm text-gray-400">{alertText}</p>
          </div>
        </div>
        <div className="p-4 flex space-x-4">
          <button onClick={closeMyAlert} className={`w-1/2 px-4 py-3 text-center text-white ${colorsBgType[type]} rounded-lg font-bold text-sm`}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAlert;
