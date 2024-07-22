import React, {FunctionComponent} from "react";

import {UploadOutlined} from "@ant-design/icons";
import {Button, Form, Input, Modal, Segmented, Upload,} from "antd";


type ModelProps = {
    isModelOpen: boolean;
    onFinish: (values: any) => void;
};

export const KnowledgeCreatePage: FunctionComponent<ModelProps> = ({
                                                                       isModelOpen,
                                                                       onFinish,
                                                                       form,
                                                                       onCancel,
                                                                       segmentType,
                                                                       setSegmentType
                                                                   }) => {

    return (
        <>
            <Modal
                open={isModelOpen}
                title="Create knowledege base"
                onCancel={onCancel}
                onOk={() => form.submit()}
                okText="Save"
                width={560}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{segment: "file"}}
                >
                    <Form.Item
                        label={"Type"}
                        name="segment">
                        <Segmented
                            options={['link', 'file', 'text']}
                            onChange={(value) => setSegmentType(value.toString())}
                        />
                    </Form.Item>
                    {segmentType === "file" && (
                        <Form.Item
                            name="document_file"
                            label="Upload File"
                            rules={[{required: true, message: 'Please upload a file'}]}
                        >
                            <Upload>
                                <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                    )}
                    {segmentType === "link" && (
                        <Form.Item
                            name="document_link"
                            label="Link"
                            rules={[{required: true, message: 'Please enter a link'}]}
                        >
                            <Input placeholder="Enter link here"/>
                        </Form.Item>
                    )}
                    {segmentType === "text" && (
                        <>
                            <Form.Item
                                name="document_title"
                                label="Link"
                                rules={[{required: true, message: 'Please enter a title'}]}
                            >
                                <Input placeholder="Enter document title here"/>
                            </Form.Item>
                            <Form.Item
                                name="document_text"
                                label="Description"
                                rules={[{required: true, message: 'Please enter a description'}]}
                            >
                                <Input.TextArea rows={4} placeholder="Enter description here"/>
                            </Form.Item>
                        </>


                    )}

                </Form>
            </Modal>
        </>

    )
}