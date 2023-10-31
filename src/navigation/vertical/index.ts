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
      title: 'Servers Status',
      path: '/status',
      icon: 'tabler:chart-pie'
    },
    {
      path: '/settings',
      action: 'read',
      subject: 'settings',
      title: 'Servers Settings',
      icon: 'tabler:settings-cog'
    }
  ]
}

export default navigation
