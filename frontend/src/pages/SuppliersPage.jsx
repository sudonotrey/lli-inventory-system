import { useEffect, useState } from 'react'
import {
  Table, Button, Modal, Form, Input,
  Space, Popconfirm, message, Typography, Card,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import api from '../api/axios'

const { Title } = Typography

const SuppliersPage = () => {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form]                    = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/suppliers')
      setData(res.data.data)
    } catch {
      message.error('Failed to load suppliers.')
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
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editing) {
        await api.put(`/suppliers/${editing.id}`, values)
        message.success('Supplier updated.')
      } else {
        await api.post('/suppliers', values)
        message.success('Supplier created.')
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
      await api.delete(`/suppliers/${id}`)
      message.success('Supplier deleted.')
      fetchData()
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed.')
    }
  }

  const columns = [
    { title: 'ID',           dataIndex: 'id',           key: 'id',           width: 60 },
    { title: 'Name',         dataIndex: 'name',         key: 'name'                    },
    { title: 'Contact',      dataIndex: 'contact_name', key: 'contact_name',
      render: (v) => v || '—' },
    { title: 'Phone',        dataIndex: 'phone',        key: 'phone',
      render: (v) => v || '—' },
    { title: 'Email',        dataIndex: 'email',        key: 'email',
      render: (v) => v || '—' },
    { title: 'Address',      dataIndex: 'address',      key: 'address',
      render: (v) => v || '—' },
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size='small' onClick={() => openEdit(record)} />
          <Popconfirm
            title='Delete this supplier?'
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
        <Title level={4} style={{ margin: 0 }}>Suppliers</Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
          Add Supplier
        </Button>
      </div>

      <Card>
        <Table
          dataSource={data}
          columns={columns}
          rowKey='id'
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editing ? 'Edit Supplier' : 'Add Supplier'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Update' : 'Create'}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout='vertical' style={{ marginTop: 16 }}>
          <Form.Item
            name='name'
            label='Supplier Name'
            rules={[{ required: true, message: 'Name is required.' }]}
          >
            <Input placeholder='e.g. Unilab Inc.' />
          </Form.Item>
          <Form.Item name='contact_name' label='Contact Person'>
            <Input placeholder='e.g. Juan Dela Cruz' />
          </Form.Item>
          <Form.Item name='phone' label='Phone'>
            <Input placeholder='e.g. 02-8888-0000' />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email'
            rules={[{ type: 'email', message: 'Enter a valid email.' }]}
          >
            <Input placeholder='e.g. sales@supplier.com' />
          </Form.Item>
          <Form.Item name='address' label='Address'>
            <Input.TextArea rows={2} placeholder='e.g. Makati City, Metro Manila' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SuppliersPage