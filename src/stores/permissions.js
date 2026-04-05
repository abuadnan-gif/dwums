import { useUserStore } from '@/stores/user'

export const can = (permissionName) => {
  const userStore = useUserStore()
  return userStore.hasPermission(permissionName)
}