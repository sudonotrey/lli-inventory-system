import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin } from 'antd'
import {
  MedicineBoxOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import api from '../api/axios'
import dayjs from 'dayjs'

const { Title } = Typography

const DashboardPage = () => {
  const [summary, setSummary]   = useState(null)
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
        setSummary(s.data.data.totals)
        setLowStock(l.data.data.slice(0, 5))
        setExpiry(e.data.data.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const expiryColor = (status) => {
    if (status === 'Expired')    return 'red'
    if (status === 'Critical')   return 'orange'
    if (status === 'Near Expiry') return 'gold'
    return 'green'
  }

  const lowStockCols = [
    { title: 'Product',       dataIndex: 'name',          key: 'name'          },
    { title: 'SKU',           dataIndex: 'sku',           key: 'sku'           },
    { title: 'Qty',           dataIndex: 'quantity',      key: 'quantity'      },
    { title: 'Reorder Level', dataIndex: 'reorder_level', key: 'reorder_level' },
  ]

  const expiryCols = [
    { title: 'Product',     dataIndex: 'name',          key: 'name' },
    { title: 'Expiry Date', dataIndex: 'expiry_date',   key: 'expiry_date',
      render: (v) => dayjs(v).format('MMM DD, YYYY') },
    { title: 'Status',      dataIndex: 'expiry_status', key: 'expiry_status',
      render: (v) => <Tag color={expiryColor(v)}>{v}</Tag> },
  ]

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <Spin size='large' />
    </div>
  )

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>Dashboard</Title>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Total Products'
              value={summary?.total_products ?? 0}
              prefix={<MedicineBoxOutlined style={{ color: '#1677ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Total Quantity'
              value={summary?.total_quantity ?? 0}
              prefix={<MedicineBoxOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Low Stock Items'
              value={lowStock.length}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Total Inventory Value'
              value={summary?.total_value ?? 0}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={<><WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />Low Stock Alert</>}
            extra={<a href='/products'>View All</a>}
          >
            <Table
              dataSource={lowStock}
              columns={lowStockCols}
              rowKey='sku'
              pagination={false}
              size='small'
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<><ClockCircleOutlined style={{ color: '#f5222d', marginRight: 8 }} />Expiry Alerts</>}
            extra={<a href='/reports'>View All</a>}
          >
            <Table
              dataSource={expiry}
              columns={expiryCols}
              rowKey='sku'
              pagination={false}
              size='small'
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage