import {genChartByAiUsingPOST} from '@/services/yingbi/chartController';
import {DownOutlined, UploadOutlined} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  MenuProps,
  message,
  Row,
  Select,
  Space,
  Spin,
  Upload
} from 'antd';
import ReactMarkdown from 'react-markdown';
import TextArea from 'antd/es/input/TextArea';
import React, {useState} from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * 添加图表
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [aiModel, setAiModel] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [option, setOption] = useState<any>();

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
    setChart(undefined);
    setOption(undefined);
    // 对接后端 上传数据
    const params = {
      ...values,
      aiModel: aiModel,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图标代码解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
          console.log(res);
          message.success('分析成功！');
        }
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
  };

  const onClick: MenuProps['onClick'] = ({ key }) => {
    setAiModel(key);
    message.info(`Click on item ${key}`);
  };

  // useEffect(() => {
  //   // 在 aiModel 更新后运行
  //   alert('AI Model updated:'+ aiModel);
  // }, [aiModel]);

  const items: MenuProps['items'] = [
    {
      label: 'ChatGPT',
      key: 'chatgpt',
    },
    {
      label: '鱼聪明',
      key: 'yucongming',
    },
    {
      label: '豆包',
      key: 'doubao',
    },
  ];
  return (
    <div className="add-chart">
      我的图表
      <br/>
      <Dropdown menu={{ items, onClick }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {aiModel?aiModel:"请选择AI模型"}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
      <Row gutter={24}>
        <Col span={12}>
          <Card title={'智能分析'}>
            <Form name="addChart" labelCol={{ span: 4 }}
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
        </Col>
        <Col span={12}>
          <Card title={'分析结论'}>
            {/* // TODO 支持 markdown 语法 */}
            {chart?.genResult ? (
              <ReactMarkdown>{chart.genResult}</ReactMarkdown>
            ) : (
              <div>请先在左侧进行提交</div>
            )}
            {/*<ReactMarkdown>{chart?.genResult} </ReactMarkdown>*/}
            {/*<div>请先在左侧进行提交</div>*/}
            <Spin spinning={submitting}></Spin>
          </Card>
          <Divider></Divider>
          <Card title={'可视化图表'}>
            {option ? <ReactECharts option={option} /> : <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting}></Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
