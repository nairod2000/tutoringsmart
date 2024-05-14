import React, { createContext, useContext, useState } from 'react';

const DrawerContext = createContext({ isOpen: false, toggleDrawer: () => {} });

export const useDrawer = () => useContext(DrawerContext);

export const DrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen((prev) => !prev);

  return (
    <DrawerContext.Provider value={{isOpen, toggleDrawer}}>
      {children}
    </DrawerContext.Provider>
  );
};