import { Table, Input, Button, Space, Popconfirm, Modal, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Highlighter from 'react-highlight-words';
import '../styles/StyleListadoExperto.css';
import { CrearExperto } from "./CrearExperto";
import { ModificarExperto } from "./ModificarExperto";
import { VerExperto } from "./VerExperto";

export const ListadoExpertos = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [selectedExpert, setSelectedExpert] = useState(null);


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
          message.success('Experto eliminado exitosamente');
          fetchExpertos(); // Recargar la lista
      } catch (error) {
          message.error('Error al eliminar el experto');
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
            title: 'Área',
            dataIndex: 'area',
            key: 'area',
            width: '20%',
            ...getColumnSearchProps('area'),
            sorter: (a, b) => a.area.localeCompare(b.area),
        },
        {
            title: 'Habilidad',
            dataIndex: 'habilidad',
            key: 'habilidad',
            width: '20%',
            ...getColumnSearchProps('habilidad'),
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
        width: '15%',
        render: (_, record) => (
            <Space size="middle">
                <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setSelectedExpert(record);  // Guarda el experto seleccionado
                        setIsModalOpenEdit(true);   // Abre el modal
                      }}
                    size="small"
                />
                <Popconfirm
                    title="¿Está seguro de eliminar este experto?"
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
                        setSelectedExpert(record);
                        setIsModalView(true);
                    }
                    }
                    size="small"
                />

            </Space>
        ),
    },
  ];

    const fetchExpertos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:4000/api/clientes');
            
            if (Array.isArray(response.data.body)) {
                const expertoInfo = response.data.body.map(usuario => ({
                    ...usuario,
                    key: usuario.id,
                    nombre: usuario.name,
                    apellido: usuario.lastName,
                    area: usuario.area,
                    habilidad: usuario.competitionName,
                    centro: usuario.formationCenter
                }));
                setDataSource(expertoInfo);
            } else {
                console.error('La propiedad body no es un array:', response.data);
            }
        } catch (error) {
            console.error('Error al cargar expertos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpertos();
    }, []);

    return (
<>
      <div className="titulo_expertos">
      <h2> Expertos </h2>
      </div>


        <div className="listado-expertos-container">
            <div className="header-actions" style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <h2>Listado de Expertos</h2>
                <Button 
                    type="primary"
                    className="submit-button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Crear Experto
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
                
                
            ></Table>

            {isModalOpen && <CrearExperto onClose={() => setIsModalOpen(false)}/> }
            {isModalOpenEdit && (
        <ModificarExperto 
          onClose={() => {
            setIsModalOpenEdit(false);
            setSelectedExpert(null);  // Limpia el experto al cerrar
          }} 
          expertData={selectedExpert}  // Pasa los datos aquí
             />
          )}
        
        {isModalView && (
        <VerExperto 
          onClose={() => {
            setIsModalView(false);
            setSelectedExpert(null);  // Limpia el experto al cerrar
          }} 
          expertData={selectedExpert}  // Pasa los datos aquí
             />
          )}
           
            

        </div>
        </>
    );
};