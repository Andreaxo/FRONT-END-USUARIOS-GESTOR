import { Navigate, Route, Routes } from "react-router-dom";
import { ListadoExpertos } from "./components/expertos/ListadoExpertos";
import { ListadoAprendiz } from "./components/aprendiz/ListadoAprendiz";
import { ListadoCompetidor } from "./components/competidores/ListadoCompetidor";


export const App = () => {
    return (
        <Routes>
        {/* Redirigir la ruta raíz a /lista */}
        <Route path="/" element={<Navigate to="/listadoExpertos" replace />} />
        
        {/* Rutas principales */}
        <Route path="/listadoExpertos" element={<ListadoExpertos />} />
        <Route path="/listadoAprendiz" element={<ListadoAprendiz />} />
        <Route path="/listadoCompetidores" element={<ListadoCompetidor/>}>/</Route>

        {/* Ruta para manejar 404 - páginas no encontradas */}
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    );
  };
        
