import axios from "axios";
import { useState } from "react";


const TIPOS_DOCUMENTO = [
  { value: "CC", label: "Cédula de ciudadanía" },
  { value: "TI", label: "Tarjeta de identidad" },
  { value: "CE", label: "Cédula de extranjería" }
];

const TIPOS_SANGRE = [
  { value: "O-", label: "O-" },
  { value: "O+", label: "O+" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B-", label: "B-" },
  { value: "B+", label: "B+" },
  { value: "AB-", label: "AB-" },
  { value: "AB+", label: "AB+" }
];

const PREFERENCIAS_ALIMENTARIAS = [
  { value: "vegetariano", label: "Vegetariano" },
  { value: "vegano", label: "Vegano" },
  { value: "ninguna", label: "Ninguna" }
];

const CENTROS_FORMACION = [
  { value: "agro", label: "Centro Atención Sector Agropecuario" },
  { value: "diseño", label: "Centro de Diseño e Innovación Tecnológica Industrial" },
  { value: "comercio", label: "Centro de comercio y servicios" }
];

export const CrearExperto = () => {
    
    
    const api = axios.create({
        baseURL: 'http://localhost:4000/api/clientes',
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        rol: "",
        birthdate: "",
        documentType: "CC",
        documentNumber: "",
        email: "",
        phone: "",
        bloodType: "O+",
        dietPreferences: "ninguna",
        area: "",
        formationCenter: "agro",
        senaVinculation: "",
        competitionName: ""
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await api.post('http://localhost:4000/api/clientes', formData);
      
      setSuccessMessage("Experto creado exitosamente");
      console.log('Respuesta del servidor:', response.data);
      
      // Limpiar el formulario después de éxito
      setFormData({
        name: "",
        rol: "",
        birthdate: "",
        documentType: "CC",
        documentNumber: "",
        email: "",
        phone: "",
        bloodType: "O+",
        dietPreferences: "ninguna",
        area: "",
        formationCenter: "agro",
        senaVinculation: "",
        competitionName: ""
      });

      console.log('Información: ', response.data);

    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Hubo un error al crear el experto'
      );
      console.error('Error detallado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelect = ({ label, name, options }) => (
    <div className="input-group">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="form-select"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderInput = ({ type = "text", name, placeholder }) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={formData[name]}
      onChange={handleChange}
      className="form-input"
    />
  );



  return (
    <div className="crear-experto">
      <h1 className="titulo_crear">Crear Experto</h1>
      
      <form onSubmit={handleSubmit} className="formulario_experto">
        {renderInput({ name: "name", placeholder: "Nombre completo" })}
        {renderInput({ name: "rol", placeholder: "Rol" })}
        {renderInput({ 
          type: "date", 
          name: "birthdate", 
          placeholder: "Fecha de nacimiento" 
        })}
        
        {renderSelect({
          label: "documentType",
          name: "tipoDocumento",
          options: TIPOS_DOCUMENTO
        })}
        
        {renderInput({ 
          name: "documentNumber", 
          placeholder: "Número de documento" 
        })}
        {renderInput({ 
          name: "email", 
          placeholder: "Correo electrónico",
          type: "email"
        })}
        {renderInput({ 
          name: "phone", 
          placeholder: "Número de teléfono" 
        })}
        
        {renderSelect({
          label: "Tipo de Sangre",
          name: "bloodType",
          options: TIPOS_SANGRE
        })}
        
        {renderSelect({
          label: "dietPreferences",
          name: "preferenciaAlimentaria",
          options: PREFERENCIAS_ALIMENTARIAS
        })}
        
        {renderInput({ name: "area", placeholder: "Área" })}
        
        {renderSelect({
          label: "Centro de formación",
          name: "formationCenter",
          options: CENTROS_FORMACION
        })}
        
        {renderInput({ 
          name: "senaVinculation", 
          placeholder: "Vinculación SENA" 
        })}
        {renderInput({ name: "competitionName", placeholder: "Habilidad" })}

        <br/>
        <button type="submit" className="submit-button">
          Crear Experto
        </button>
      </form>
    </div>
  );
};