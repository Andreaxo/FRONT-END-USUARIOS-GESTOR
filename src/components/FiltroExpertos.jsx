import { useState } from "react"




export const FiltroExpertos = () => {
    
    // Valor de input de Expertos
    const [inputExpertoValue, setExpertoValue] = useState('');
    
    // Cambiar el valor del input
    const onChangeExperto = (e) => {
        setExpertoValue(e.target.value);
    }
 
    return (
        <>
    <div className="filtro_expertos">
        <h1>Expertos</h1>
        <input 
        type="text"
        placeholder="Buscar un experto"
        value={inputExpertoValue}
        onChange={onChangeExperto}
        />
    </div>
    
    </>
    )
}