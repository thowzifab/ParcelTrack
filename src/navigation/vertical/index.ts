// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
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
    }
  ]
}

export default navigation
