// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'tabler:server'
  },
  {
    title: 'Server Status',
    path: '/status',
    icon: 'tabler:chart-pie'
  },
  {
    path: '/settings',
    action: 'read',
    subject: 'settings',
    title: 'Server Settings',
    icon: 'tabler:settings-cog'
  },
  {
    path: '/add-job',
    action: 'read',
    subject: 'settings',
    title: 'Add Scanning Jobs',
    icon: 'gg:add'
  },
  {
    path: '/edit-job',
    action: 'read',
    subject: 'settings',
    title: 'Edit Scanning Jobs',
    icon: 'gg:edit'
  },
  {
    path: '/scan-stats',
    action: 'read',
    subject: 'settings',
    title: 'Scan Statistics',
    icon: 'gg:edit'
  }
]

export default navigation
