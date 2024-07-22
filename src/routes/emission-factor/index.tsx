import React, { useEffect,useState } from "react";

import { DeleteOutlined,EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, message,Modal, Popconfirm, Row, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";

import { EmissionFactorData,emissionFactorService } from '../../service/emissionFactorService';


interface EmissionData extends EmissionFactorData {
    id: string;
}

const EmissionsTable: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState<EmissionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<EmissionData | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const emissionList = await emissionFactorService.getAll();
            setData(emissionList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setLoading(false);
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingRecord) {
                await updateEmission({...values, document_id: editingRecord.id});
            } else {
                await addEmission({...values, description: values?.description || ""});
            }
            setModalVisible(false);
            form.resetFields();
            setEditingRecord(null);
            fetchData(); // Refresh the data after add/update
        } catch (error) {
            console.error("Error saving emission: ", error);
            message.error("Failed to save emission factor");
        }
    };

    const addEmission = async (values: EmissionFactorData) => {
        try {
            await emissionFactorService.addOne(values);
            message.success("Emission factor added successfully");
        } catch (error) {
            console.error("Error adding emission: ", error);
            message.error("Failed to add emission factor");
        }
    };

    const updateEmission = async (values) => {
        console.log(values)
        try {
            await emissionFactorService.updateOne({
                ...values,
            });
            message.success("Emission factor updated successfully");
        } catch (error) {
            console.error("Error updating emission: ", error);
            message.error("Failed to update emission factor");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await emissionFactorService.deleteOneEFById(id);
            message.success("Emission factor deleted successfully");
            fetchData(); // Refresh the data after delete
        } catch (error) {
            console.error("Error deleting emission: ", error);
            message.error("Failed to delete emission factor");
        }
    };

    const columns: ColumnsType<EmissionData> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.name.toLowerCase().includes(value.toString().toLowerCase()),
            ellipsis: true,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            ellipsis: true,
        },
        {
            title: 'Scope',
            dataIndex: 'scope',
            key: 'scope',
        },
        {
            title: 'CO2',
            dataIndex: 'co2',
            key: 'co2',
        },
        {
            title: 'CO2 Unit',
            dataIndex: 'co2_unit',
            key: 'co2_unit',
        },
        {
            title: 'CH4',
            dataIndex: 'ch4',
            key: 'ch4',
        },
        {
            title: 'CH4 Unit',
            dataIndex: 'ch4_unit',
            key: 'ch4_unit',
        },
        {
            title: 'N2O',
            dataIndex: 'n2o',
            key: 'n2o',
        },
        {
            title: 'N2O Unit',
            dataIndex: 'n2o_unit',
            key: 'n2o_unit',
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            render: (text, record) => (
                record.link ?
                    <a href={record.link} target="_blank" rel="noopener noreferrer">
                        {text}
                    </a> : text
            ),
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this emission factor?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Row justify="space-between" align="middle">
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        setEditingRecord(null);
                        form.resetFields();
                        setModalVisible(true);
                    }}>
                        Add Emission Factor
                    </Button>
                </Col>
                <Col>
                    <Input
                        placeholder="Search by name"
                        onChange={handleSearch}
                        style={{ width: 300 }}
                        prefix={<SearchOutlined />}
                    />
                </Col>
            </Row>
            <Table<EmissionData>
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />
            <Modal
                title={editingRecord ? "Edit Emission Factor" : "Add Emission Factor"}
                visible={modalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingRecord(null);
                    form.resetFields();
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="scope" label="Scope" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value={1}>1</Select.Option>
                            <Select.Option value={2}>2</Select.Option>
                            <Select.Option value={3}>3</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="co2" label="CO2" rules={[{ required: true }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="co2_unit" label="CO2 Unit" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="ch4" label="CH4" rules={[{ required: true }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="ch4_unit" label="CH4 Unit" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="n2o" label="N2O" rules={[{ required: true }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="n2o_unit" label="N2O Unit" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="source" label="Source" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="link" label="Link" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export const EmissionFactor: React.FC = () => {
    return (
        <div>
            <EmissionsTable />
        </div>
    );
};