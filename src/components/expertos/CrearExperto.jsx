import axios from "axios";
import { useState } from "react";
import '../../styles/StyleCrearExperto.css';


const TIPOS_DOCUMENTO = [
  { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
  { value: "Tarjeta de identidad", label: "Tarjeta de identidad" },
  { value: "Cédula de extranjería", label: "Cédula de extranjería" }
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
  { value: "Vegetariano", label: "Vegetariano" },
  { value: "Vegano", label: "Vegano" },
  { value: "Ninguna", label: "Ninguna" }
];

const CENTROS_FORMACION = [
  { value: "Centro Atención Sector Agropecuario", label: "Centro Atención Sector Agropecuario" },
  { value: "Centro de Diseño e Innovación Tecnológica Industrial", label: "Centro de Diseño e Innovación Tecnológica Industrial" },
  { value: "Centro de comercio y servicios", label: "Centro de comercio y servicios" }
];

export const CrearExperto = ( { onClose } ) => {

  const api = axios.create({
    baseURL: 'http://localhost:4000/api/clientes',
    timeout: 5000,
    headers:  {
      'Content-Type':
      'aplication/json'
    }
  })
    
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        rol: "",
        birthdate: "",
        documentType: "Cédula de ciudadanía",
        documentNumber: "",
        email: "",
        phone: "",
        bloodType: "O+",
        dietPreferences: "Ninguna",
        area: "",
        formationCenter: "Centro de Diseño e Innovación Tecnológica Industrial",
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
    window.location.reload();

    try {
      const response = await axios.post('http://localhost:4000/api/clientes', formData);
      
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
        dietPreferences: "Ninguna",
        area: "",
        formationCenter: "Centro de Diseño e Innovación Tecnológica Industrial",
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
        {renderInput({ name: "name", placeholder: "Nombre" })}
        {renderInput({ name: "lastName", placeholder: "Apellido" })}
        {renderInput({ name: "rol", placeholder: "Rol" })}
        {renderInput({ 
          type: "date", 
          name: "birthdate", 
          placeholder: "Fecha de nacimiento" 
        })}
        
        {renderSelect({
          label: "Tipo de documento ",
          name: "documentType",
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
          label: "Preferencias alimentarias",
          name: "dietPreferences",
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
        
        <button type="submit" onClick={onClose} className="submit-button">
          X
         </button>

      </form>
    </div>
  );
};