"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import MyAlert from './MyAlert';

const MyAlertContext = createContext();

export const MyAlertProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [type, setType] = useState('success');

  const showMyAlert = (text, alertType) => {
    setAlertText(text);
    setType(alertType || 'success');
    setShowAlert(true);
  };

  const closeMyAlert = () => {
    setShowAlert(false);
  };

  return (
    <MyAlertContext.Provider value={{ showMyAlert, closeMyAlert }}>
      {children}
      {showAlert && <MyAlert alertText={alertText} type={type} />}
    </MyAlertContext.Provider>
  );
};

export const useMyAlert = () => {
  const context = useContext(MyAlertContext);
  if (!context) {
    throw new Error('useMyAlert debe ser utilizado dentro de un MyAlertProvider');
  }
  return context;
};
