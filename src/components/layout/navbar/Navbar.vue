<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../../../stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const showNotifications = ref(false)
const showProfile = ref(false)
const showNotificationsOnHover = ref(false)
const showProfileOnHover = ref(false)
const logoError = ref(false)


let notificationsHideTimer = null
let profileHideTimer = null

const notifications = ref([
  {
    id: 1,
    type: 'critical',
    title: 'Pressure Drop Alert',
    message: 'Critical pressure drop detected in Zone 4',
    time: '2 minutes ago',
    icon: 'ExclamationTriangleIcon',
    read: false
  },
  {
    id: 2,
    type: 'success',
    title: 'Staff Assignment',
    message: 'New field officer assigned to Kombolcha Branch',
    time: '1 hour ago',
    icon: 'UserIcon',
    read: true
  },
  {
    id: 3,
    type: 'warning',
    title: 'Branch Coverage Alert',
    message: 'Dessie Branch now covers 3 additional woredas',
    time: '3 hours ago',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    read: true
  },
  {
    id: 4,
    type: 'info',
    title: 'New Customer Registration',
    message: '15 new applications received this week',
    time: '5 hours ago',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    read: true
  }
])

const toggleTheme = () => {
  // document.body.classList.add('theme-changing')
  themeStore.toggleTheme()
  setTimeout(() => {
    // document.body.classList.remove('theme-changing')
  }, 500)
}

const unreadNotifications = computed(() => {
  return notifications.value.filter((n) => !n.read).length
})

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showNotificationsOnHover.value = false
  showProfile.value = false
  showProfileOnHover.value = false
}

const toggleProfile = () => {
  showProfile.value = !showProfile.value
  showProfileOnHover.value = false
  showNotifications.value = false
  showNotificationsOnHover.value = false
}

const startNotificationsHideTimer = () => {
  if (notificationsHideTimer) {
    clearTimeout(notificationsHideTimer)
  }
  notificationsHideTimer = setTimeout(() => {
    showNotificationsOnHover.value = false
  }, 300) // 300ms delay before hiding
}

const startProfileHideTimer = () => {
  if (profileHideTimer) {
    clearTimeout(profileHideTimer)
  }
  profileHideTimer = setTimeout(() => {
    showProfileOnHover.value = false
  }, 300) // 300ms delay before hiding
}

const markAsRead = (notification) => {
  notification.read = true
}

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.read = true))
}

const handleNotificationClick = (notification) => {
  notification.read = true
  // Additional click handling logic can go here
  showNotifications.value = false
  showNotificationsOnHover.value = false
}

const handleLogoError = () => {
  logoError.value = true
}

// Close dropdowns when clicking outside
const onClickOutside = (event) => {
  const isNotification = event.target
    .closest('.relative')
    ?.querySelector('[aria-label="Notifications"]')
  const isProfile = event.target.closest('.relative')?.querySelector('[aria-label="User Profile"]')

  if (!isNotification && !isProfile) {
    showNotifications.value = false
    showNotificationsOnHover.value = false
    showProfile.value = false
    showProfileOnHover.value = false
  }
}

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    showNotifications.value = false
    showNotificationsOnHover.value = false
    showProfile.value = false
    showProfileOnHover.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('keydown', handleEscape)
  if (notificationsHideTimer) clearTimeout(notificationsHideTimer)
  if (profileHideTimer) clearTimeout(profileHideTimer)
})

import Icon from '@/components/Icon.vue'

</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-17">
    <div class="absolute inset-0 bg-surface-light dark:bg-surface-dark"></div>
    <!-- Main Header Bar -->
    <div class="relative">
      <!-- Header Content -->
      <div class="relative">
        <div class="px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Left Section: Logo & Mobile Menu -->
            <div class="flex items-center">
              <button
                @click="themeStore.toggleMobileSidebar()"
                class="lg:hidden p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
              >
                <Icon name="Bars3Icon" class="text-neutral-700 dark:text-neutral-200" />
              </button>

              <!-- Logo - Simplified for longer width display -->
              <div class="flex items-center space-x-3">
                <!-- Simplified Logo Container -->
                <div class="relative flex items-center space-x-3 min-w-0">
                  <!-- Logo Image or Fallback -->
                  <div
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-light via-accent-light to-secondary-light dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <img
                      src="/g-tech-logo.png"
                      alt="G-TECH Smart Logo"
                      class="w-6 h-6 object-contain"
                      @error="handleLogoError"
                    />
                    <div v-if="logoError" class="absolute inset-0 flex items-center justify-center">
                      <svg
                        class="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>

                  <!-- Brand Text - Always visible on wider screens -->
                  <div class="min-w-0">
                    <h1
                      class="text-lg md:text-xl font-bold bg-gradient-to-r from-primary-light via-accent-light to-secondary-light dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark bg-clip-text text-transparent truncate"
                    >
                      Kocha City DWUMS
                    </h1>
                    <p class="text-xs text-neutral-700 dark:text-neutral-200 font-mono truncate">
                      Water Utility Platform
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Section: Controls -->
            <div class="flex items-center space-x-3">
              <!-- Search Bar -->
              <div class="relative hidden md:block">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="MagnifyingGlassIcon" class="text-neutral-500 dark:text-neutral-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search customers, staff, meters..."
                  class="pl-10 pr-4 py-2.5 w-64 rounded-xl bg-surface-light dark:bg-surface-dark border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-light/40 dark:focus:ring-primary-dark/40 focus:border-primary-light dark:focus:border-primary-dark transition"
                />
              </div>

              <!-- Notification Bell with Hover and Click -->
              <div
                class="relative"
                @mouseenter="showNotificationsOnHover = true"
                @mouseleave="startNotificationsHideTimer()"
                @click.stop
              >
                <button
                  @click="toggleNotifications"
                  class="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-300 relative group"
                >
                  <Icon name="BellIcon" class="text-neutral-600 dark:text-neutral-300" />

                  <!-- Notification Indicator -->
                  <div v-if="unreadNotifications" class="absolute -top-1 -right-1">
                    <div class="relative">
                      <div
                        class="w-2 h-2 rounded-full bg-critical-light dark:bg-critical-dark animate-pulse"
                      ></div>
                      <div
                        class="absolute inset-0 rounded-full bg-critical-light dark:bg-critical-dark animate-ping"
                      ></div>
                    </div>
                  </div>
                  <!-- Tooltip -->
                  <div
                    class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                  >
                    Notifications
                    <div
                      class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-neutral-900 dark:bg-neutral-800 rotate-45"
                    ></div>
                  </div>
                </button>

                <!-- Notifications Dropdown -->
                <transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="transform opacity-0 scale-95 -translate-y-2"
                  enter-to-class="transform opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="transform opacity-100 scale-100 translate-y-0"
                  leave-to-class="transform opacity-0 scale-95 -translate-y-2"
                >
                  <div
                    v-if="showNotifications || showNotificationsOnHover"
                    class="absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl border border-neutral-300 dark:border-neutral-700 overflow-hidden z-50"
                    @mouseenter="showNotificationsOnHover = true"
                    @mouseleave="startNotificationsHideTimer()"
                  >
                    <!-- Dropdown Background -->
                    <div
                      class="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/80 dark:from-surface-dark/95 dark:via-surface-dark/90 dark:to-surface-dark/80 backdrop-blur-xl"
                    ></div>

                    <div class="relative">
                      <!-- Header -->
                      <div class="p-4 border-b border-neutral-300 dark:border-neutral-700">
                        <div class="flex items-center justify-between">
                          <h3 class="font-semibold text-neutral-900 dark:text-neutral-100">
                            Notifications
                          </h3>
                          <div class="flex items-center space-x-3">
                            <button
                              @click="markAllAsRead"
                              class="text-sm text-primary-light dark:text-primary-dark hover:underline"
                            >
                              Mark all read
                            </button>
                            <button
                              class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                            >
                              <Icon name="Cog6ToothIcon" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Notifications List -->
                      <div class="max-h-96 overflow-y-auto">
                        <div
                          v-for="notification in notifications"
                          :key="notification.id"
                          class="p-4 border-b border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors group/notification cursor-pointer"
                          @click="handleNotificationClick(notification)"
                        >
                          <div class="flex items-start space-x-3">
                            <!-- Icon -->
                            <div
                              :class="[
                                'p-2 rounded-lg flex-shrink-0',
                                notification.type === 'critical'
                                  ? 'bg-critical-light/10 dark:bg-critical-dark/10'
                                  : notification.type === 'warning'
                                    ? 'bg-warning-light/10 dark:bg-warning-dark/10'
                                    : notification.type === 'success'
                                      ? 'bg-success-light/10 dark:bg-success-dark/10'
                                      : 'bg-primary-light/10 dark:bg-primary-dark/10'
                              ]"
                            ></div>

                            <!-- Content -->
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {{ notification.title }}
                              </p>
                              <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                {{ notification.message }}
                              </p>
                              <p class="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                                {{ notification.time }}
                              </p>
                            </div>

                            <!-- Actions -->
                            <div
                              class="opacity-0 group-hover/notification:opacity-100 transition-opacity"
                            >
                              <button
                                v-if="!notification.read"
                                @click.stop="markAsRead(notification)"
                                class="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                              >
                                <Icon
                                  name="CheckIcon"
                                  class="text-success-light dark:text-success-dark"
                                />
                              </button>
                            </div>

                            <!-- Unread Indicator -->
                            <div
                              v-if="!notification.read"
                              class="w-2 h-2 rounded-full bg-primary-light dark:bg-primary-dark flex-shrink-0"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- Footer -->
                      <div class="p-4 border-t border-neutral-300 dark:border-neutral-700">
                        <a
                          href="#"
                          class="block text-center text-sm text-primary-light dark:text-primary-dark hover:underline"
                        >
                          View all notifications
                        </a>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              <button
                @click="toggleTheme"
                class="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/50 relative group"
                title="Toggle theme"
              >
                <Icon name="SunIcon" v-if="!isDark" class="text-neutral-600" />

                <Icon v-else class="text-yellow-400" name="MoonIcon" />

                <!-- Tooltip -->
                <div
                  class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                >
                  {{ isDark ? 'Switch to light mode' : 'Switch to dark mode' }}
                  <div
                    class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-neutral-900 dark:bg-neutral-800 rotate-45"
                  ></div>
                </div>
              </button>

              <!-- User Profile with Hover and Click -->
              <div
                class="relative"
                @mouseenter="showProfileOnHover = true"
                @mouseleave="startProfileHideTimer()"
                @click.stop
              >
                <button
                  @click="toggleProfile"
                  class="flex items-center space-x-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-300 group"
                >
                  <!-- Avatar -->
                  <div class="relative">
                    <div
                      class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-light via-accent-light to-secondary-light dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark flex items-center justify-center text-white font-semibold text-sm"
                    >
                      AU
                    </div>
                    <!-- Status Indicator -->
                    <div
                      class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-success-light dark:bg-success-dark border-2 border-white dark:border-surface-dark"
                    ></div>
                  </div>

                  <!-- User Info (Desktop) -->
                  <div class="hidden lg:block text-left min-w-0">
                    <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      Admin User
                    </p>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                      System Administrator
                    </p>
                  </div>

                  <Icon name="ChevronDownIcon"
                    class="text-neutral-500 dark:text-neutral-400 transition-transform duration-300 flex-shrink-0"
                    :class="{ 'rotate-180': showProfile || showProfileOnHover }"
                  />
                </button>

                <!-- Profile Dropdown -->
                <transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="transform opacity-0 scale-95 -translate-y-2"
                  enter-to-class="transform opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="transform opacity-100 scale-100 translate-y-0"
                  leave-to-class="transform opacity-0 scale-95 -translate-y-2"
                >
                  <div
                    v-if="showProfile || showProfileOnHover"
                    class="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border border-neutral-300 dark:border-neutral-700 overflow-hidden z-50"
                    @mouseenter="showProfileOnHover = true"
                    @mouseleave="startProfileHideTimer()"
                  >
                    <!-- Dropdown Background -->
                    <div
                      class="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/80 dark:from-surface-dark/95 dark:via-surface-dark/90 dark:to-surface-dark/80 backdrop-blur-xl"
                    ></div>

                    <div class="relative">
                      <!-- Profile Header -->
                      <div class="p-4 border-b border-neutral-300 dark:border-neutral-700">
                        <div class="flex items-center space-x-3">
                          <div
                            class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-light via-accent-light to-secondary-light dark:from-primary-dark dark:via-accent-dark dark:to-secondary-dark flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                          >
                            AU
                          </div>
                          <div class="min-w-0">
                            <p
                              class="font-semibold text-neutral-900 dark:text-neutral-100 truncate"
                            >
                              Admin User
                            </p>
                            <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1 truncate">
                              admin@waterutility.et
                            </p>
                            <div class="flex items-center mt-1">
                              <div
                                class="w-2 h-2 rounded-full bg-success-light dark:bg-success-dark mr-2 animate-pulse flex-shrink-0"
                              ></div>
                              <span
                                class="text-xs text-success-light dark:text-success-dark truncate"
                                >Online</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Menu Items -->
                      <div class="py-2">
                        <a
                          href="#"
                          class="flex items-center px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors group/menu"
                        >
                          <div
                            class="p-2 rounded-lg bg-primary-light/10 dark:bg-primary-dark/10 mr-3 group-hover/menu:bg-primary-light/20 dark:group-hover/menu:bg-primary-dark/20 transition-colors flex-shrink-0"
                          >
                            <Icon
                              name="UserIcon"
                              class="text-primary-light dark:text-primary-dark"
                            />
                          </div>
                          <span class="text-neutral-900 dark:text-neutral-100 truncate"
                            >Profile Settings</span
                          >
                        </a>
                        <a
                          href="#"
                          class="flex items-center px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors group/menu"
                        >
                          <div
                            class="p-2 rounded-lg bg-accent-light/10 dark:bg-accent-dark/10 mr-3 group-hover/menu:bg-accent-light/20 dark:group-hover/menu:bg-accent-dark/20 transition-colors flex-shrink-0"
                          >
                            <Icon
                              name="ShieldCheckIcon"
                              class="text-success-light dark:text-success-dark"
                            />
                          </div>
                          <span class="text-neutral-900 dark:text-neutral-100 truncate"
                            >System Preferences</span
                          >
                        </a>
                        <a
                          href="#"
                          class="flex items-center px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors group/menu"
                        >
                          <div
                            class="p-2 rounded-lg bg-success-light/10 dark:bg-success-dark/10 mr-3 group-hover/menu:bg-success-light/20 dark:group-hover/menu:bg-success-dark/20 transition-colors flex-shrink-0"
                          >
                            <Icon
                              name="ShieldCheckIcon"
                              class="text-success-light dark:text-success-dark"
                            />
                          </div>
                          <span class="text-neutral-900 dark:text-neutral-100 truncate"
                            >Security</span
                          >
                        </a>
                        <a
                          href="#"
                          class="flex items-center px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors group/menu"
                        >
                          <div
                            class="p-2 rounded-lg bg-informational-light/10 dark:bg-informational-dark/10 mr-3 group-hover/menu:bg-informational-light/20 dark:group-hover/menu:bg-informational-dark/20 transition-colors flex-shrink-0"
                          >
                            <Icon
                              name="CalendarDaysIcon"
                              class="text-informational-light dark:text-informational-dark"
                            />
                          </div>
                          <span class="text-neutral-900 dark:text-neutral-100 truncate"
                            >Activity Log</span
                          >
                        </a>
                        <a
                          href="#"
                          class="flex items-center px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors group/menu"
                        >
                          <div
                            class="p-2 rounded-lg bg-warning-light/10 dark:bg-warning-dark/10 mr-3 group-hover/menu:bg-warning-light/20 dark:group-hover/menu:bg-warning-dark/20 transition-colors flex-shrink-0"
                          >
                            <Icon
                              name="LockClosedIcon"
                              class="text-warning-light dark:text-warning-dark"
                            />
                          </div>
                          <span class="text-neutral-900 dark:text-neutral-100 truncate"
                            >Privacy</span
                          >
                        </a>
                      </div>

                      <!-- Divider -->
                      <div class="border-t border-neutral-300 dark:border-neutral-700"></div>

                      <!-- Logout -->
                      <div class="py-2">
                        <a
                          href="#"
                          class="flex items-center px-4 py-3 text-sm text-critical-light dark:text-critical-dark hover:bg-critical-light/10 dark:hover:bg-critical-dark/10 transition-colors group/menu"
                        >
                          <div
                            class="p-2 rounded-lg bg-critical-light/10 dark:bg-critical-dark/10 mr-3 group-hover/menu:bg-critical-light/20 dark:group-hover/menu:bg-critical-dark/20 transition-colors flex-shrink-0"
                          >
                            <Icon
                              name="ArrowRightOnRectangleIcon"
                              class="text-warning-light dark:text-warning-dark"
                            />
                          </div>
                          <span class="font-medium truncate">Logout</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>

        <!-- Themed Horizontal Line Below Header -->
        <div class="absolute bottom-0 left-0 right-0 h-1.5">
          <!-- Main gradient line -->
          <div
            class="h-full bg-gradient-to-r from-primary-light via-secondary-light to-accent-light dark:from-primary-dark dark:via-secondary-dark dark:to-accent-dark opacity-90 animate-gradient-flow"
          ></div>

          <!-- Glowing effect -->
          <div
            class="absolute inset-0 h-full bg-gradient-to-r from-primary-light via-secondary-light to-accent-light dark:from-primary-dark dark:via-secondary-dark dark:to-accent-dark opacity-30 blur-sm animate-pulse-slow"
          ></div>
        </div>
      </div>
    </div>
  </header>
</template>
