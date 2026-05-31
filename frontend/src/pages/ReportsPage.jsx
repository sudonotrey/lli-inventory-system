import { useEffect, useState } from 'react'
import {
  Tabs, Table, Card, Statistic,
  Row, Col, Tag, Typography, Spin, message,
} from 'antd'
import {
  BarChartOutlined,
  WarningOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import api from '../api/axios'
import dayjs from 'dayjs'

const { Title } = Typography

const ReportsPage = () => {
  const [summary, setSummary]   = useState({ summary: [], totals: {} })
  const [lowStock, setLowStock] = useState([])
  const [expiry, setExpiry]     = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, l, e] = await Promise.all([
          api.get('/reports/inventory-summary'),
          api.get('/reports/low-stock'),
          api.get('/reports/expiry'),
        ])
        setSummary(s.data.data)
        setLowStock(l.data.data)
        setExpiry(e.data.data)
      } catch {
        message.error('Failed to load reports.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const expiryColor = (status) => {
    if (status === 'Expired')     return 'red'
    if (status === 'Critical')    return 'orange'
    if (status === 'Near Expiry') return 'gold'
    return 'green'
  }

  // Tab 1 — Inventory Summary
  const summaryCols = [
    { title: 'Category',        dataIndex: 'category',        key: 'category'        },
    { title: 'Total Products',  dataIndex: 'total_products',  key: 'total_products'  },
    { title: 'Total Quantity',  dataIndex: 'total_quantity',  key: 'total_quantity'  },
    { title: 'Total Value (₱)', dataIndex: 'total_value',     key: 'total_value',
      render: (v) => `₱${parseFloat(v).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
  ]

  // Tab 2 — Low Stock
  const lowStockCols = [
    { title: 'Product',       dataIndex: 'name',          key: 'name'          },
    { title: 'Generic Name',  dataIndex: 'generic_name',  key: 'generic_name',
      render: (v) => v || '—' },
    { title: 'SKU',           dataIndex: 'sku',           key: 'sku'           },
    { title: 'Batch No.',     dataIndex: 'batch_number',  key: 'batch_number',
      render: (v) => v || '—' },
    { title: 'Quantity',      dataIndex: 'quantity',      key: 'quantity',
      render: (v) => <span style={{ color: '#f5222d', fontWeight: 700 }}>{v}</span> },
    { title: 'Reorder Level', dataIndex: 'reorder_level', key: 'reorder_level' },
    { title: 'Category',      dataIndex: 'category',      key: 'category',
      render: (v) => <Tag color='blue'>{v}</Tag> },
    { title: 'Supplier',      dataIndex: 'supplier',      key: 'supplier'      },
    { title: 'Unit',          dataIndex: 'unit',          key: 'unit'          },
  ]

  // Tab 3 — Expiry
  const expiryCols = [
    { title: 'Product',       dataIndex: 'name',             key: 'name'           },
    { title: 'Generic Name',  dataIndex: 'generic_name',     key: 'generic_name',
      render: (v) => v || '—' },
    { title: 'SKU',           dataIndex: 'sku',              key: 'sku'            },
    { title: 'Batch No.',     dataIndex: 'batch_number',     key: 'batch_number',
      render: (v) => v || '—' },
    { title: 'Quantity',      dataIndex: 'quantity',         key: 'quantity'       },
    { title: 'Expiry Date',   dataIndex: 'expiry_date',      key: 'expiry_date',
      render: (v) => dayjs(v).format('MMM DD, YYYY') },
    { title: 'Days Left',     dataIndex: 'days_until_expiry',key: 'days_until_expiry',
      render: (v) => (
        <span style={{ color: v < 0 ? '#f5222d' : v <= 30 ? '#fa541c' : '#faad14', fontWeight: 700 }}>
          {v < 0 ? `${Math.abs(v)} days ago` : `${v} days`}
        </span>
      )
    },
    { title: 'Status',        dataIndex: 'expiry_status',    key: 'expiry_status',
      render: (v) => <Tag color={expiryColor(v)}>{v}</Tag> },
    { title: 'Category',      dataIndex: 'category',         key: 'category',
      render: (v) => <Tag color='blue'>{v}</Tag> },
    { title: 'Supplier',      dataIndex: 'supplier',         key: 'supplier'       },
  ]

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <Spin size='large' />
    </div>
  )

  const tabItems = [
    {
      key: '1',
      label: <><BarChartOutlined /> Inventory Summary</>,
      children: (
        <div>
          {/* Overall Totals */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title='Total Products'
                  value={summary.totals?.total_products ?? 0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title='Total Quantity'
                  value={summary.totals?.total_quantity ?? 0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title='Total Inventory Value'
                  value={summary.totals?.total_value ?? 0}
                  precision={2}
                  prefix='₱'
                />
              </Card>
            </Col>
          </Row>

          <Table
            dataSource={summary.summary}
            columns={summaryCols}
            rowKey='category'
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <><WarningOutlined style={{ color: '#faad14' }} /> Low Stock
          {lowStock.length > 0 && (
            <Tag color='orange' style={{ marginLeft: 6 }}>{lowStock.length}</Tag>
          )}
        </>
      ),
      children: (
        <Table
          dataSource={lowStock}
          columns={lowStockCols}
          rowKey='sku'
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      ),
    },
    {
      key: '3',
      label: (
        <><ClockCircleOutlined style={{ color: '#f5222d' }} /> Expiry Report
          {expiry.length > 0 && (
            <Tag color='red' style={{ marginLeft: 6 }}>{expiry.length}</Tag>
          )}
        </>
      ),
      children: (
        <Table
          dataSource={expiry}
          columns={expiryCols}
          rowKey='sku'
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      ),
    },
  ]

  return (
    <div>
      <div className='page-header'>
        <Title level={4} style={{ margin: 0 }}>Reports</Title>
      </div>

      <Card>
        <Tabs defaultActiveKey='1' items={tabItems} />
      </Card>
    </div>
  )
}

export default ReportsPage