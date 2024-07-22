import React, { useState } from 'react';
import { DeleteOutlined, FileOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Popconfirm, Space, Table, Tag, Typography, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';

const { Text } = Typography;

interface KnowledgeItem {
    title: string;
    language: string;
    source: string;
    source_type: string;
    source_size: number;
    status: string;
    created_at: number;
    document_id: string;
}

interface KnowledgeListProps {
    data: {
        total: number;
        documents: KnowledgeItem[];
    };
    loading: boolean;
    handleDelete: (id: string) => void;
}

const KnowledgeList: React.FC<KnowledgeListProps> = ({ data, loading, handleDelete }) => {
    const [searchText, setSearchText] = useState('');

    const formatSize = (size: number): string => {
        const sizeInMB = size.toFixed(2);
        return `${sizeInMB} MB`;
    };

    const formatDate = (timestamp: number): string => {
        return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm');
    };

    const columns: ColumnsType<KnowledgeItem> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.title.toLowerCase().includes(value.toString().toLowerCase()),
            render: (title) => (
                <Tooltip title={title}>
                    <span>{title}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Lang',
            dataIndex: 'language',
            key: 'language',
            width: 70,
            render: (language: string) => (
                <Tag color={language === 'english' ? 'blue' : 'green'}>
                    {language.slice(0, 2).toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            ellipsis: true,
            render: (source: string) => (
                <Tooltip title={source}>
                    {source.startsWith('http') ? (
                        <a href={source} target="_blank" rel="noopener noreferrer">
                            <LinkOutlined /> Link
                        </a>
                    ) : source ? (
                        <Text>
                            <FileOutlined /> File
                        </Text>
                    ) : (
                        <Text italic>N/A</Text>
                    )}
                </Tooltip>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'source_type',
            key: 'source_type',
            width: 80,
        },
        {
            title: 'Size',
            dataIndex: 'source_size',
            key: 'source_size',
            width: 80,
            render: (size: number) => formatSize(size),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status: string) => (
                <Tag color={status.toLowerCase() === 'active' ? 'green' : 'default'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (timestamp: number) => formatDate(timestamp),
            sorter: (a, b) => a.created_at - b.created_at,
        },
        {
            title: 'Action',
            key: 'action',
            width: 70,
            render: (_, record) => (
                <Popconfirm
                    title="Delete this document?"
                    okText="Yes"
                    onConfirm={() => handleDelete(record.document_id)}
                    cancelText="No"
                >
                    <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Input
                placeholder="Search by title"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: "300px", padding: "10px" }}
            />
            <Table
                columns={columns}
                dataSource={data.documents}
                rowKey="document_id"
                loading={loading}
                scroll={{ x: 'max-content' }}
                pagination={{ pageSize: 10 }}
            />
        </Space>
    );
};

export default KnowledgeList;