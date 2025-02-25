import axios from "axios";
import { useState, useEffect } from "react";
import { message } from "antd";
import '../../styles/StyleCrearExperto.css';

const TIPOS_DOCUMENTO = [
  { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
  { value: "Tarjeta de identidad", label: "Tarjeta de identidad" },
  { value: "Cédula de extranjería", label: "Cédula de extranjería" }
];

const CENTROS_FORMACION = [
  { value: "Centro Atención Sector Agropecuario", label: "Centro Atención Sector Agropecuario" },
  { value: "Centro de Diseño e Innovación Tecnológica Industrial", label: "Centro de Diseño e Innovación Tecnológica Industrial" },
  { value: "Centro de comercio y servicios", label: "Centro de comercio y servicios" }
];

const TIPOS_SANGRE = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" }
];


const PREFERENCIAS_DIETA = [
{ value: "Normal", label: "Normal" },
{ value: "Vegetariano", label: "Vegetariano" },
{ value: "Vegano", label: "Vegano" },
{ value: "Sin gluten", label: "Sin gluten" }
];

const ESTADO_CONTRATACION = [
{ value: "Patrocinado", label: "Patrocinado" },
{ value: "No patrocinado", label: "No patrocinado" }
];

const MODALIDAD_ETAPA = [
{ value: "Contrato de aprendizaje", label: "Contrato de aprendizaje" },
{ value: "Pasantía", label: "Pasantía" },
{ value: "Monitoría", label: "Monitoría" }
];

const PROGRAMAS_FORMACION = [
  { value: "Análisis y desarrollo de software", label: "Análisis y desarrollo de software" },
  { value: "Multimedia", label: "Multimedia" },
  { value: "Infraestructura", label: "Infraestructura" }
];
  // Función auxiliar para formatear la fecha
const formatearFechaParaInput = (fechaString) => {
  if (!fechaString) return '';
  
  // Maneja cadenas de fecha ISO
  if (fechaString.includes('T')) {
      const fecha = new Date(fechaString);
      return fecha.toISOString().split('T')[0];
  }
  
  // Si ya está en formato YYYY-MM-DD, devuélvela tal cual
  if (fechaString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return fechaString;
  }
  
  // Para cualquier otro formato, intenta convertir a YYYY-MM-DD
  const fecha = new Date(fechaString);
  if (isNaN(fecha.getTime())) return ''; // Devuelve cadena vacía si la fecha es inválida
  
  return fecha.toISOString().split('T')[0];
};


export const VerCompetidor = ({ onClose, expertData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Asegurarse de que el ID se capture correctamente
  const [formData, setFormData] = useState({
    id: expertData?.id || '',
    rol: expertData?.rol || '',
    password: expertData?.password || '',
    name: expertData?.name || '',
    lastName: expertData?.lastName || '',
    documentType: expertData?.documentType || '',
    documentNumber: expertData?.documentNumber || '',
    documentDateOfissue: expertData?.documentDateOfissue || '',
    email: expertData?.email || '',
    birthdate: formatearFechaParaInput(expertData?.birthdate) || '',
    phone: expertData?.phone || '',
    programName: expertData?.programName || '',
    indexCourse: expertData?.indexCourse || '',
    formationCenter: expertData?.formationCenter || '',
    bloodType: expertData?.bloodType || '',
    dietPreferences: expertData?.dietPreferences || '',
    hiringStatus: expertData?.hiringStatus || '',
    productiveStageModality: expertData?.productiveStageModality || '',
    companyName: expertData?.companyName || '',
    nit: expertData?.nit || '',
    immediateBossName: expertData?.immediateBossName || '',
    bossEmail: expertData?.bossEmail || '',
    bossPhone: expertData?.bossPhone || '',
    competitionName: expertData?.competitionName || '',
    strategyCompetition: expertData?.strategyCompetition || null
    

  });

  // Actualizar useEffect para manejar mejor el ID
  useEffect(() => {
    if (expertData) {
        setFormData(prev => ({
            ...prev,
            ...expertData,
            birthdate: formatearFechaParaInput(expertData.birthdate)
        }));
    }
}, [expertData]);
  console.log(expertData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
 if (!formData.id) {
      message.error('ID no encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:4000/api/clientes/${formData.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        message.success("Experto modificado exitosamente");
        if (onClose) {
          onClose();
        }
      }

    } catch (error) {
      console.error('Error al modificar:', error);
      message.error(
        error.response?.data?.message || 
        'Error al modificar el experto'
      );
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

  const renderInput = ({ type = "text", name = "", placeholder = "", hidden = false}) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={formData[name]}
      onChange={handleChange}
      className="form-input"
      style={{ display: hidden ? 'none' : 'block', cursor: 'default' } }
      readOnly={true}
    />
  );

  return (
    <div className="crear-experto">
          <button 
          type="button" 
          onClick={onClose} 
          className="submit-button"
        >
          Volver atrás
        </button>

        <br/>
      <h1 className="titulo_crear"><b>Competidor: </b> {formData.name} {formData.lastName} </h1>
      
      <form onSubmit={handleSubmit} className="formulario_experto">

      <input 
          type="hidden" 
          name="id" 
          value={formData.id} 
        />

<div className="informacion_personal">
            
            <h2>Información Personal</h2><br/>
            <div className="nombre">
               <p>Nombre</p>
               {renderInput({ name: "name", placeholder: "Nombre", required: true })}
            </div>
                  
            <div className="apellido">
            <br/><p>Apellido</p><br/>
              {renderInput({ name: "lastName", placeholder: "Apellido", required: true })}
            </div>

            <div className="email">
            <br/> <p>Correo electrónico</p> <br/>
              {renderInput({ type: "email", name: "email", placeholder: "Correo electrónico", required: true })}
            </div>

            <div className="telefono">
            <br/> <p>Télefono</p><br/>
              {renderInput({ type: "tel", name: "phone", placeholder: "Teléfono" })}
            </div>

            <div className="nacimiento">
            <br/><p>Fecha de nacimiento</p>
              {renderInput({ type: "date", name: "birthdate", placeholder: "Fecha de nacimiento", label: "Fecha de nacimiento" })}
            </div>
          </div>
                  
                  {/* Documentación */}

          <div className="documentacion">

           <h2>Documentación</h2><br/>
           
           <div className="tipoDocumento">
           <p>Tipo de Documento</p>
                  {renderSelect({name: "documentType", options: TIPOS_DOCUMENTO })}
           </div>
           <div className="NumeroDocumento">
           <br/> <p>Número de Documento</p><br/>
                  {renderInput({ name: "documentNumber", placeholder: "Número de documento", required: true })}
           </div>
           <div className="expedicionDocumento">

           <br/> <p>Fecha de expedición del documento</p><br/>
                  {renderInput({ type: "date", name: "documentDateOfissue", placeholder: "Fecha de expedición", label: "Fecha de expedición" })}
           </div>
          </div>
                  
          <div className="informacion_sena">
                  {/* Información SENA */}

            <h2>Información SENA</h2><br/>
              <div className="programa_formacion">
                  <p>Programa de formación</p>
                  {renderInput({ name: "programName", placeholder: "Programa de formación" })}
              </div>
              
              <div className="ficha_formacion">
                  <br/><p>Ficha de formación</p><br/>
                  {renderInput({ name: "indexCourse", placeholder: "Ficha del curso", options: PROGRAMAS_FORMACION})}
              </div>
              
              <div className="centro_formacion">
              <br/><p>Centro de formación</p><br/>
                  {renderInput({ name: "formationCenter", placeholder: "Centro de formación", options: CENTROS_FORMACION })}
              </div>
          </div>
                  
          <div className="informacion_medica">
                  {/* Información Médica */}
                  <h2>Información Médica</h2><br/>
                  <div className="tipo_sangre">
                  <p>Tipo de sangre</p>
                  {renderSelect({ name: "bloodType", options: TIPOS_SANGRE })}
                  </div>
                  <div className="preferencias_alimentarias">
                  <br/><p>Preferencias Alimentarias</p><br/>
                  {renderSelect({name: "dietPreferences", options: PREFERENCIAS_DIETA })}
                  </div>
          </div>

          <div className="informacion_laboral">      
                  {/* Información Laboral */}
                  <h2>Información Laboral</h2><br/>
                  <div className="estado_contratacion">
                <p>Estado de contratación</p>
                  {renderSelect({ name: "hiringStatus", options: ESTADO_CONTRATACION })}
                  </div>

                  <div className="modalidad_productiva">
                  <br/> <p>Modalidad de etapa productiva</p><br/>
                  {renderSelect({ name: "productiveStageModality", options: MODALIDAD_ETAPA })}
                  </div>

                  <div className="nombre_empresa">
                  <br/> <p>Razón Social de la empresa</p><br/>
                  {renderInput({ name: "companyName", placeholder: "Nombre de la empresa" })}
                  </div>

                  <div className="nit_empresa">
                  <br/><p>NIT de la empresa</p><br/>
                  {renderInput({ name: "nit", placeholder: "NIT de la empresa" })}
                  </div>
          </div>
                  
            <div className="informacion_jefe">

                  {/* Información del Jefe Inmediato */}
                  <h2>Información del Jefe Inmediato</h2><br/>
              
              <div className="nombre_jefe">
              <p>Nombre del Jefe Inmediato</p><br/>
                  {renderInput({ name: "immediateBossName", placeholder: "Nombre del jefe inmediato" })}
              </div>

              <div className="email_jefe">
              <br/> <p>Correo electrónico del Jefe Inmediato</p><br/>
                  {renderInput({ type: "email", name: "bossEmail", placeholder: "Correo del jefe" })}
              </div>

              <div className="telefono_jefe">
              <br/> <p>Telefono del Jefe Inmediato</p><br/>
                  {renderInput({ type: "tel", name: "bossPhone", placeholder: "Teléfono del jefe" })}
              </div>
            </div>
                  
            <div className="informacion_competencia">
                  {/* Información de Competencia */}
                  <h2>Información de Competencia</h2><br/>
              <div className="habilidad">
                  <p>Nombre de la habilidad</p><br/>
                  {renderInput({ name: "competitionName", placeholder: "Nombre de la competencia" })}
              </div>
                <div className="estrategia_competicion">
                <br/><p>Estrategia de competición</p><br/>
                  {renderInput({ name: "strategyCompetition", placeholder: "Estrategia de competencia" })}
                </div>
            </div>
        <br/>
        
      </form>
    </div>
  );
};