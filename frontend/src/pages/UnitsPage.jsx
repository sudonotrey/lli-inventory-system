import { useEffect, useState } from 'react'
import {
  Table, Button, Modal, Form, Input,
  Space, Popconfirm, message, Typography, Card,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import api from '../api/axios'

const { Title } = Typography

const UnitsPage = () => {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form]                    = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/units')
      setData(res.data.data)
    } catch {
      message.error('Failed to load units.')
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
        await api.put(`/units/${editing.id}`, values)
        message.success('Unit updated.')
      } else {
        await api.post('/units', values)
        message.success('Unit created.')
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
      await api.delete(`/units/${id}`)
      message.success('Unit deleted.')
      fetchData()
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed.')
    }
  }

  const columns = [
    { title: 'ID',           dataIndex: 'id',           key: 'id',           width: 60 },
    { title: 'Name',         dataIndex: 'name',         key: 'name'                    },
    { title: 'Abbreviation', dataIndex: 'abbreviation', key: 'abbreviation',
      render: (v) => v || '—' },
    { title: 'Created At',   dataIndex: 'created_at',   key: 'created_at',
      render: (v) => new Date(v).toLocaleDateString() },
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size='small' onClick={() => openEdit(record)} />
          <Popconfirm
            title='Delete this unit?'
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
        <Title level={4} style={{ margin: 0 }}>Units of Measure</Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
          Add Unit
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
        title={editing ? 'Edit Unit' : 'Add Unit'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Update' : 'Create'}
        destroyOnClose
      >
        <Form form={form} layout='vertical' style={{ marginTop: 16 }}>
          <Form.Item
            name='name'
            label='Unit Name'
            rules={[{ required: true, message: 'Name is required.' }]}
          >
            <Input placeholder='e.g. Tablet' />
          </Form.Item>
          <Form.Item name='abbreviation' label='Abbreviation'>
            <Input placeholder='e.g. tab' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UnitsPage