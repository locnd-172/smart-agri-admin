import React, {useEffect, useState} from "react";

import {PlusCircleOutlined} from "@ant-design/icons";
import {Button, Form, message, Space} from "antd";

import {KnowledgeCreatePage} from "@/routes/knowledge-base/create";
import KnowledgeList from "@/routes/knowledge-base/KnowledgeList";
import {
    deleteDocument,
    getAllDocuments,
    KnowledgeItem,
    uploadFile,
    uploadLink,
    uploadText
} from "@/service/knowledgeService";

export const KnowledgeBase = () => {
    const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [segmentType, setSegmentType] = useState<string>("file");
    const [documents, setDocuments] = useState<KnowledgeItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await getAllDocuments();
            setDocuments(response.documents);
            setTotal(response.total);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error("Error fetching documents:", error);
            message.error("Failed to fetch documents");
        }
    };
    const handleCancel = () => {
        setIsModelOpen(false);
        form.resetFields();
    };

    const handleFinish = async (values: any) => {
        try {
            let response;
            switch (segmentType) {
                case "file":
                    if (values.document_file && values.document_file.file.originFileObj) {
                        response = await uploadFile(values.document_file.file.originFileObj);
                    } else {
                        throw new Error("No file selected");
                    }
                    break;
                case "link":
                    response = await uploadLink(values.document_link);
                    console.log(response)
                    break;
                case "text":
                    response = await uploadText(values.document_text, values.document_title);
                    break;
                default:
                    handleCancel()
                    throw new Error("Invalid segment type");
            }

            if (response.STATUS) {
                message.success("Knowledge uploaded successfully");
                if (response.document) {
                    setDocuments(prevDocuments => [...prevDocuments, response.document]);
                    setTotal(prevTotal => prevTotal + 1);
                } else {
                    await fetchDocuments();
                }
            } else {
                throw new Error(response.message || "Upload failed");
            }
        } catch (error) {
            console.error("Error posting knowledge:", error);
            message.error("Failed to upload knowledge: " + (error as Error).message);
        }
    };

    const toggleModel = () => {
        setIsModelOpen(isModelOpen => !isModelOpen)
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteDocument([id]);
            message.success('Document deleted successfully');
            setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
            setTotal(prevTotal => prevTotal - 1);
        } catch (error) {
            console.error('Error deleting document:', error);
            message.error('Failed to delete document');
        }
    };

    const AddButton = ({children}) => (
        <Button
            style={{paddingLeft: 0}}
            type="link"
            icon={<PlusCircleOutlined/>}
            onClick={toggleModel}

        >
            {children}
        </Button>
    )

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ marginBottom: '24px' }}>
                <AddButton>
                    <span>Add new knowledge</span>
                </AddButton>
            </div>
            <KnowledgeCreatePage
                segmentType={segmentType}
                setSegmentType={setSegmentType}
                onCancel={handleCancel}
                form={form}
                onFinish={handleFinish}
                isModelOpen={isModelOpen}
            />
            <KnowledgeList handleDelete={handleDelete} loading={loading} data={{ total, documents }} />
        </Space>
    );
};
