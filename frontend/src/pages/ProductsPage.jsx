import { useEffect, useState } from 'react'
import {
  Table, Button, Modal, Form, Input, InputNumber,
  Select, DatePicker, Space, Popconfirm,
  message, Typography, Card, Tag,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import api from '../api/axios'
import dayjs from 'dayjs'

const { Title } = Typography

const ProductsPage = () => {
  const [data, setData]           = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [units, setUnits]         = useState([])
  const [loading, setLoading]     = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form]                    = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [p, c, s, u] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/suppliers'),
        api.get('/units'),
      ])
      setData(p.data.data)
      setCategories(c.data.data)
      setSuppliers(s.data.data)
      setUnits(u.data.data)
    } catch {
      message.error('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditing(record)
    form.setFieldsValue({
      ...record,
      expiry_date: record.expiry_date ? dayjs(record.expiry_date) : null,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        expiry_date: values.expiry_date
          ? values.expiry_date.format('YYYY-MM-DD')
          : null,
      }
      if (editing) {
        await api.put(`/products/${editing.id}`, payload)
        message.success('Product updated.')
      } else {
        await api.post('/products', payload)
        message.success('Product created.')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err.response?.data?.message || 'Operation failed.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`)
      message.success('Product deleted.')
      fetchData()
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed.')
    }
  }

  const expiryTag = (date) => {
    if (!date) return '—'
    const days = dayjs(date).diff(dayjs(), 'day')
    if (days < 0)   return <Tag color='red'>Expired</Tag>
    if (days <= 30) return <Tag color='orange'>{dayjs(date).format('MMM DD, YYYY')}</Tag>
    if (days <= 90) return <Tag color='gold'>{dayjs(date).format('MMM DD, YYYY')}</Tag>
    return <Tag color='green'>{dayjs(date).format('MMM DD, YYYY')}</Tag>
  }

  const columns = [
    { title: 'Name',         dataIndex: 'name',          key: 'name'         },
    { title: 'Generic Name', dataIndex: 'generic_name',  key: 'generic_name',
      render: (v) => v || '—' },
    { title: 'SKU',          dataIndex: 'sku',           key: 'sku'          },
    { title: 'Category',     dataIndex: 'category_name', key: 'category_name',
      render: (v) => v ? <Tag color='blue'>{v}</Tag> : '—' },
    { title: 'Unit',         dataIndex: 'unit_name',     key: 'unit_name',
      render: (v) => v || '—' },
    { title: 'Qty',          dataIndex: 'quantity',      key: 'quantity',
      render: (v, r) => (
        <span style={{ color: v <= r.reorder_level ? '#f5222d' : 'inherit', fontWeight: v <= r.reorder_level ? 700 : 400 }}>
          {v}
        </span>
      )
    },
    { title: 'Unit Price',   dataIndex: 'unit_price',    key: 'unit_price',
      render: (v) => `₱${parseFloat(v).toFixed(2)}` },
    { title: 'Expiry Date',  dataIndex: 'expiry_date',   key: 'expiry_date',
      render: (v) => expiryTag(v) },
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size='small' onClick={() => openEdit(record)} />
          <Popconfirm
            title='Delete this product?'
            onConfirm={() => handleDelete(record.id)}
            okText='Yes' cancelText='No'
          >
            <Button icon={<DeleteOutlined />} size='small' danger />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className='page-header'>
        <Title level={4} style={{ margin: 0 }}>Products</Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
          Add Product
        </Button>
      </div>

      <Card>
        <Table
          dataSource={data}
          columns={columns}
          rowKey='id'
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={editing ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Update' : 'Create'}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout='vertical' style={{ marginTop: 16 }}>
          <Form.Item name='name' label='Brand / Product Name'
            rules={[{ required: true, message: 'Name is required.' }]}>
            <Input placeholder='e.g. Amoxicillin 500mg' />
          </Form.Item>

          <Form.Item name='generic_name' label='Generic Name'>
            <Input placeholder='e.g. Amoxicillin' />
          </Form.Item>

          <Form.Item name='sku' label='SKU'
            rules={[{ required: true, message: 'SKU is required.' }]}>
            <Input placeholder='e.g. AMOX-500-001' />
          </Form.Item>

          <Form.Item name='batch_number' label='Batch / Lot Number'>
            <Input placeholder='e.g. BTC-2024-001' />
          </Form.Item>

          <Form.Item name='manufacturer' label='Manufacturer'>
            <Input placeholder='e.g. Unilab Inc.' />
          </Form.Item>

          <Form.Item name='category_id' label='Category'>
            <Select placeholder='Select category' allowClear>
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name='supplier_id' label='Supplier'>
            <Select placeholder='Select supplier' allowClear>
              {suppliers.map((s) => (
                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name='unit_id' label='Unit of Measure'>
            <Select placeholder='Select unit' allowClear>
              {units.map((u) => (
                <Select.Option key={u.id} value={u.id}>
                  {u.name} {u.abbreviation ? `(${u.abbreviation})` : ''}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name='quantity' label='Quantity'>
            <InputNumber min={0} style={{ width: '100%' }} placeholder='0' />
          </Form.Item>

          <Form.Item name='reorder_level' label='Reorder Level'>
            <InputNumber min={0} style={{ width: '100%' }} placeholder='0' />
          </Form.Item>

          <Form.Item name='unit_price' label='Unit Price (₱)'>
            <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder='0.00' />
          </Form.Item>

          <Form.Item name='expiry_date' label='Expiry Date'>
            <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductsPage