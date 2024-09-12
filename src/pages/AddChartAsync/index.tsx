import {UploadOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, message, Select, Space, Upload} from 'antd';

import TextArea from 'antd/es/input/TextArea';
import React, {useState} from 'react';
import {useForm} from "antd/es/form/Form";
import {genChartByAiAsyncUsingPOST} from "@/services/yingbi/chartController";

/**
 * 添加图表
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);


  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 提交中直接返回 (避免重复提交)
    if (submitting) {
      return;
    }
    setSubmitting(true);
    // 对接后端 上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      // const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
          message.success('分析任务提交成功，稍后请在我的图表页面查看');
          form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      <Card title={'智能分析'}>
        <Form form={form} name="addChart" labelCol={{ span: 4 }}
              wrapperCol={{ span:14 }} onFinish={onFinish} initialValues={{}}>
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{ required: true, message: '请输入分析目标' }]}
          >
            <TextArea placeholder="请输入你的分析诉求，比如：分析网站用户的增长情况"></TextArea>
          </Form.Item>

          <Form.Item name="name" label="图表名称">
            <Input placeholder="请输入图表名称"></Input>
          </Form.Item>

          <Form.Item name="chartType" label="图表类型">
            <Select
              options={[
                { value: '折线图', label: '折线图' },
                { value: '柱状图', label: '柱状图' },
                { value: '堆叠图', label: '堆叠图' },
                { value: '饼图', label: '饼图' },
                { value: '雷达图', label: '雷达图' },
                { value: '大数据量面积图', label: '大数据量面积图' },
                { value: '渐变堆叠面积图', label: '渐变堆叠面积图' },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item name="file" label="原始数据">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined />}>上传csv文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={submitting}
              >
                提交
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
