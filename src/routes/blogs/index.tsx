import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Row, Button, message, Modal, Select } from 'antd';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FullScreenLoading } from "@/components";
import { db } from '@/firebase';
import {uploadText} from "@/service/knowledgeService";

const { Option } = Select;

interface Blog {
    id: string;
    title: string;
    image: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    author: string;
    created_time: string;
}

export const BlogsPage: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
    const [newStatus, setNewStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

    const fetchBlogs = useCallback(async () => {
        try {
            const blogsCollection = collection(db, 'blogs');
            const blogSnapshot = await getDocs(blogsCollection);
            const blogList = blogSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Blog));
            setBlogs(blogList);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const showStatusModal = (blog: Blog) => {
        setCurrentBlog(blog);
        setNewStatus(blog.status);
        setIsStatusModalVisible(true);
    };

    const handleStatusChange = async () => {
        if (currentBlog) {
            console.log(currentBlog)
            try {
                const blogRef = doc(db, 'blogs', currentBlog.id);
                await updateDoc(blogRef, { status: newStatus });
                setBlogs(prevBlogs =>
                    prevBlogs.map(blog =>
                        blog.id === currentBlog.id ? { ...blog, status: newStatus } : blog
                    )
                );
                if (newStatus === "approved") {
                    const res = await uploadText(currentBlog.title, currentBlog.content)
                }
                message.success(`Blog status updated to ${newStatus} successfully`);
            } catch (error) {
                console.error('Error updating blog status:', error);
                message.error('Failed to update blog status');
            }
        }
        setIsStatusModalVisible(false);
    };



    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'approved': return 'green';
            case 'rejected': return 'red';
            default: return 'black';
        }
    };

    if (loading) {
        return <FullScreenLoading />;
    }

    return (
        <>
            <Row gutter={[16, 16]}>
                {blogs.map((blog) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={blog.id}>
                        <Card
                            cover={<img alt={blog.title} src={blog.image} style={{ height: 200, objectFit: 'cover' }} />}
                            title={blog.title}
                            extra={
                                <Button onClick={() => showStatusModal(blog)} style={{ color: getStatusColor(blog.status) }}>
                                    {blog.status}
                                </Button>
                            }
                        >
                            <Card.Meta
                                description={
                                    <>
                                        <p>{`${blog.content.substring(0, 100)}...`}</p>
                                        <p>Author: {blog.author}</p>
                                        <p>Created: {new Date(blog.created_time).toLocaleDateString()}</p>
                                    </>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                title="Change Blog Status"
                visible={isStatusModalVisible}
                onOk={handleStatusChange}
                onCancel={() => setIsStatusModalVisible(false)}
            >
                <p>Current status: <span style={{ color: getStatusColor(currentBlog?.status || '') }}>{currentBlog?.status}</span></p>
                <Select
                    style={{ width: '100%' }}
                    value={newStatus}
                    onChange={(value: 'pending' | 'approved' | 'rejected') => setNewStatus(value)}
                >
                    <Option value="pending">Pending</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="rejected">Rejected</Option>
                </Select>
            </Modal>
        </>
    );
};