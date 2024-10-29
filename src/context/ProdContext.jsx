import { createContext, useContext, useState, useCallback } from 'react';
import supabase from "../supabase/client.js";

export const ProdContext = createContext();

export const useImportarContextoProd = () => {
    const context = useContext(ProdContext);
    if (!context) throw new Error("useImportarContextoProd debe de estar en un ProdContext");
    return context;
};

export const ProdContextProvider = ({ children }) => {
    const [juegos, setJuegos] = useState([]);

    const getJuegos = useCallback(async () => {
        const { error, data } = await supabase.from("productos").select().order("id", { ascending: false });
        
        if (error) throw error;

        setJuegos(data);
    }, []); // Asegúrate de que no tenga dependencias

    return (
        <ProdContext.Provider value={{ juegos, getJuegos }}>
            {children}
        </ProdContext.Provider>
    );
};
