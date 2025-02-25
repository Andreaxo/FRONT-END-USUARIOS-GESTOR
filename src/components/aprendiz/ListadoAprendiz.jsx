import { Table, Input, Button, Space, Popconfirm, Modal, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Highlighter from 'react-highlight-words';
import '../../styles/StyleCrearExperto.css';

import {CrearAprendiz} from '../../components/aprendiz/CrearAprendiz';
import { ModificarAprendiz} from '../../components/aprendiz/ModificarAprendiz';
import { VerAprendiz } from '../../components/aprendiz/VerAprendiz';

export const ListadoAprendiz = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [selectedAprendiz, setSelectedAprendiz] = useState(null);


    //Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    //Modal
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

    //Modal
    const [isModalView, setIsModalView] = useState(false);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Resetear
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Cerrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleDelete = async(id) => {
      try{
          await axios.delete(`http://localhost:4000/api/clientes/${id}`);
          message.success('Aprendiz eliminado exitosamente');
          fetchAprendiz(); // Recargar la lista
      } catch (error) {
          message.error('Error al eliminar el Aprendiz');
          console.error('Error:', error);
      }
      };

    const columns = [
      {
          title: 'Nombre',
          dataIndex: 'nombre',
          key: 'nombre',
          width: '20%',
          ...getColumnSearchProps('nombre'),
          sorter: (a, b) => a.nombre.localeCompare(b.nombre),
          
      },
      {
            title: 'Apellido',
            dataIndex: 'apellido',
            key: 'apellido',
            width: '20%',
            ...getColumnSearchProps('apellido'),
            sorter: (a, b) => a.apellido.localeCompare(b.apellido),
        },
        {
            title: 'Habilidad',
            dataIndex: 'habilidad',
            key: 'habilidad',
            width: '20%',
            ...getColumnSearchProps('habilidad'),
        },
        {
            title: 'Programa de Formación',
            dataIndex: 'programName',
            key: 'programName',
            width: '20%',
            ...getColumnSearchProps('programName'),
            sorter: (a, b) => a.programName.localeCompare(b.programName),
        },
        {
            title: 'Centro de formación',
            dataIndex: 'centro',
            key: 'centro',
            width: '20%',
            ...getColumnSearchProps('centro'),
        },
        {title: 'Acciones',
        key: 'actions',
        width: '20%',
        render: (_, record) => (
            <Space size="middle">
                <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setSelectedAprendiz(record);  // Guarda el experto seleccionado
                        setIsModalOpenEdit(true);   // Abre el modal
                      }}
                    size="small"
                />
                <Popconfirm
                    title="¿Está seguro de eliminar este aspirante?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Sí" 
                    cancelText="No"
                >
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                    />
                </Popconfirm>

                <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() => {
                        setSelectedAprendiz(record);
                        setIsModalView(true);
                    }
                    }
                    size="small"
                />

            </Space>
        ),
    },
  ];

  const fetchAprendiz = async () => {
    try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/clientes');
        
        if (Array.isArray(response.data.body)) {
            // Filtrar solo los usuarios con rol de aprendiz
            const aprendices = response.data.body.filter(usuario => usuario.rol === 'Aprendiz');
            
            const aprendizInfo = aprendices.map(usuario => ({
                ...usuario,
                key: usuario.id,
                nombre: usuario.name,
                apellido: usuario.lastName,
                area: usuario.area,
                habilidad: usuario.competitionName,
                centro: usuario.formationCenter,
                programName: usuario.programName
            }));
            setDataSource(aprendizInfo);
            console.log(aprendizInfo)
        } else {
            console.error('La propiedad body no es un array:', response.data);
        }
    } catch (error) {
        console.error('Error al cargar aprendices', error);
        message.error('Error al cargar la lista de aprendices');
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchAprendiz();
    }, []);

    return (
<>


        <div className="listado-expertos-container">
            <div className="header-actions" style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
        <div className="titulo_expertos">
            <h2> Listado de Aspirantes </h2>
        </div>


                <Button 
                    className="crearExperto"
                    onClick={() => setIsModalOpen(true)}
                    style={{border: 'solid black 1px'}}
                >
                    Crear Aprendiz - No hay boton
                </Button>
            </div>

            <Table 
                dataSource={dataSource} 
                columns={columns} 
                loading={loading}
                
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) => 
                        `${range[0]}-${range[1]} de ${total} expertos`,
                }}
                scroll={{ x: true }}
                style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    margin: '0',
                    borderRadius: '10px',
                    
                }}
                rowClassName="ant-table-row"
                
            ></Table>

            {isModalOpen && <CrearAprendiz onClose={() => setIsModalOpen(false)}/> }
            {isModalOpenEdit && (
        <ModificarAprendiz
          onClose={() => {
            setIsModalOpenEdit(false);
            setSelectedAprendiz(null);  // Limpia el experto al cerrar
          }} 
          expertData={selectedAprendiz}  // Pasa los datos aquí
             />
          )}
        
        {isModalView && (
        <VerAprendiz 
          onClose={() => {
            setIsModalView(false);
            setSelectedAprendiz(null);  // Limpia el experto al cerrar
          }} 
          expertData={selectedAprendiz}  // Pasa los datos aquí
             />
          )}
           
            

        </div>
        </>
    );
};