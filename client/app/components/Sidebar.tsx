import React, { createContext, useContext, useEffect, useState } from 'react';

import { Menu, UserCircle, X } from 'lucide-react';
import { Container, Navbar } from 'react-bootstrap';

const Sidebar: React.FC = () => {

    const { isOpen, closeSidebar } = useSidebar();
    
    return (
        <>
            {/* Sidebar */}
            <div className={`custom-sidebar ${isOpen ? 'open' : ''}`}>
                {/* Botão de fechar no canto superior direito */}
                <button
                className="btn-close-sidebar"
                onClick={() => closeSidebar()}
                >
                <X size={24} />
                </button>

                <div className="p-3 mt-5">
                <h5>Menu</h5>
                <ul className="list-unstyled">
                    <li><a href="#">Item 1</a></li>
                    <li><a href="#">Item 2</a></li>
                    <li><a href="#">Item 3</a></li>
                </ul>
                </div>
            </div>
        </>
    );
}

interface SidebarContextType {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}


const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within SidebarProvider');
  return context;
};

export default Sidebar;