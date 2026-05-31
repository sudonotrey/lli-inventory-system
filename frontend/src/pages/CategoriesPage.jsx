import { useEffect, useState } from 'react'
import {
  Table, Button, Modal, Form, Input,
  Space, Popconfirm, message, Typography, Card,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import api from '../api/axios'

const { Title } = Typography

const CategoriesPage = () => {
  const [data, setData]         = useState([])
  const [loading, setLoading]   = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]   = useState(null) // null = create, object = edit
  const [form]                  = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/categories')
      setData(res.data.data)
    } catch (err) {
      message.error('Failed to load categories.')
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
        await api.put(`/categories/${editing.id}`, values)
        message.success('Category updated.')
      } else {
        await api.post('/categories', values)
        message.success('Category created.')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      if (err?.errorFields) return // form validation error
      message.error(err.response?.data?.message || 'Operation failed.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`)
      message.success('Category deleted.')
      fetchData()
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed.')
    }
  }

  const columns = [
    { title: 'ID',          dataIndex: 'id',          key: 'id',          width: 60  },
    { title: 'Name',        dataIndex: 'name',        key: 'name'                    },
    { title: 'Description', dataIndex: 'description', key: 'description',
      render: (v) => v || '—' },
    { title: 'Created At',  dataIndex: 'created_at',  key: 'created_at',
      render: (v) => new Date(v).toLocaleDateString() },
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size='small'
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title='Delete this category?'
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
        <Title level={4} style={{ margin: 0 }}>Categories</Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
          Add Category
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
        title={editing ? 'Edit Category' : 'Add Category'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Update' : 'Create'}
        destroyOnClose
      >
        <Form form={form} layout='vertical' style={{ marginTop: 16 }}>
          <Form.Item
            name='name'
            label='Category Name'
            rules={[{ required: true, message: 'Name is required.' }]}
          >
            <Input placeholder='e.g. Antibiotics' />
          </Form.Item>
          <Form.Item name='description' label='Description'>
            <Input.TextArea rows={3} placeholder='Optional description' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CategoriesPage