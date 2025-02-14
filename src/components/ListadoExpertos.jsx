import { Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/StyleListadoExperto.css'
 

export const ListadoExpertos = () => {

    const [dataSource, setDataSource] = useState([]) // Se usa para guardar la información.
    const [loading, setLoading] = useState(false); // Se usa para cargar y esperar la información.
      
      const columns = [
        {
          title: 'Nombre',
          dataIndex: 'nombre',
          key: 'nombre',
        },{
          title: 'Apellido',
          dataIndex: 'apellido',
          key: 'apellido',

        },
        {
          title: 'Área',
          dataIndex: 'area',
          key: 'area',
        },
        {
          title: 'Habilidad',
          dataIndex: 'habilidad',
          key: 'habilidad',
        },
        {
            title: 'Centro de formación',
            dataIndex: 'centro',
            key: 'centro',
        },
      ];
      
      // Api para obtener usuarios
    const fetchExpertos = async () => {
        try{
            setLoading(true);
            const response = await axios.get('http://localhost:4000/api/clientes');
            
            console.log('El array es', response.data);

            if(Array.isArray(response.data.body) && response.data.body.rol=='Experto'){
                setLoading(true);
                const expertoInfo = response.data.body.map(usuario => ({
                    ...usuario,
                    key: usuario.id,
                    nombre: usuario.name, // Asume que cada experto tiene un id único
                    apellido: usuario.lastName,
                    area: usuario.area,
                    habilidad: usuario.competitionName,
                    centro: usuario.formationCenter
                }));
                setDataSource(expertoInfo);
            }else{
                console.error('La propiedad body no es un array:', response.data);
            }
        } catch(error){
            console.error('Error al cargar expertos', error);
        } finally{
            setLoading(false);
        } }

    useEffect(() => {
        fetchExpertos();
    }, []);


    return(


        <>
        {/* // Falta crear el modulo de crear experto visual */}
        <div className="crearExperto" style={{ display: 'flex', justifyContent: 'flex-end' }} >
        <button type="submit" className="submit-button">Crear Experto</button>
        </div>
            

        <Table dataSource={dataSource} columns={columns} loading={loading} />;
        </>
    )

}