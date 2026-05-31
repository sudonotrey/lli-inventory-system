import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Typography, theme } from 'antd'
import {DashboardOutlined, MedicineBoxOutlined, AppstoreOutlined, TeamOutlined, ExperimentOutlined, BarChartOutlined, LogoutOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axios'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const menuItems = [
  { key: '/dashboard',   icon: <DashboardOutlined />,   label: 'Dashboard'   },
  { key: '/products',    icon: <MedicineBoxOutlined />,  label: 'Products'    },
  { key: '/categories',  icon: <AppstoreOutlined />,     label: 'Categories'  },
  { key: '/suppliers',   icon: <TeamOutlined />,         label: 'Suppliers'   },
  { key: '/units',       icon: <ExperimentOutlined />,   label: 'Units'       },
  { key: '/reports',     icon: <BarChartOutlined />,     label: 'Reports'     },
]

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const logout    = useAuthStore((s) => s.logout)
  const user      = useAuthStore((s) => s.user)
  const { token } = theme.useToken()

  const handleLogout = async () => {
    await api.post('/auth/logout')
    logout()
    navigate('/login')
  }

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        danger: true,
        onClick: handleLogout,
      },
    ],
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {/* Logo */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 24px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          gap: 10,
        }}>
          <MedicineBoxOutlined style={{ fontSize: 22, color: '#1677ff' }} />
          {!collapsed && (
            <Text strong style={{ fontSize: 15, color: '#1677ff' }}>
              LLI Pharma
            </Text>
          )}
        </div>

        <Menu
          mode='inline'
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: 'none', marginTop: 8 }}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{
          padding: '0 24px',
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Collapse button */}
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ cursor: 'pointer', fontSize: 18, color: token.colorText }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          {/* User dropdown */}
          <Dropdown menu={userMenu} placement='bottomRight'>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ background: '#1677ff' }} />
              {!collapsed && <Text strong>{user?.username}</Text>}
            </div>
          </Dropdown>
        </Header>

        {/* Page Content */}
        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout