import React, { useEffect, useState } from 'react';
import { listMyChartByPageUsingPOST } from '@/services/yingbi/chartController';
import {Avatar, Card, List, message, Result} from 'antd';
import ReactECharts from 'echarts-for-react';
import { useModel } from '@umijs/max';
import Search from 'antd/es/input/Search';


/**
 * 我的图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc'
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的title
        if (res.data.records) {
          res.data.records.forEach((data) => {
            if(data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图标失败' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <div>
        <Search
          placeholder="请输入图表名称"
          loading={loading}
          onSearch={(value) => {
            // 设置搜索条件
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
          enterButton="Search"
          size="large"
        />
      </div>
      <div className="margin-16" />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
            console.log(page);
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <>
                {
                  item.status === 'wait' && (
                    <>
                      <Result
                        status="warning"
                        title="待生成"
                        subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等待'}
                      ></Result>
                    </>
                  )
                }
                {item.status === 'succeed' && (
                  <>
                    <div
                      style={{
                        marginBottom: 16,
                      }}
                    ></div>
                    <p>{'分析目标：' + item.goal}</p>
                    <div
                      style={{
                        marginBottom: 16,
                      }}
                    ></div>
                    <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
                  </>
                )}
                {
                  item.status === 'running' && (
                    <>
                      <Result
                        status="info"
                        title="图表生成中"
                        subTitle={item.execMessage}
                      ></Result>
                    </>
                  )
                }{
                  item.status === 'failed' && (
                    <>
                      <Result
                        status="error"
                        title="图表生成失败"
                        subTitle={item.execMessage}
                      ></Result>
                    </>
                  )
                }
              </>
            </Card>
          </List.Item>
        )}
      />
      <br />
      总数：{total}
    </div>
  );
};

export default MyChartPage;
