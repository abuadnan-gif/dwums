<script setup>
import { ref, reactive, computed, onMounted, onUnmounted  } from 'vue'
import api from '@/plugins/axios'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Modal from '@/components/ui/BaseModal.vue'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton.vue'
import Table from '@/components/ui/BaseTable.vue'
import Icon from '@/components/Icon.vue'
import { useToast } from 'vue-toastification'
import Applicant from '@/views/applicants/Applicant.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import Kebele from '@/views/administrative/Kebele.vue'


const showApplicantModal = ref(false)
const loading = ref(false)
const mode = ref('create')
const applicants = ref([])
const kebeles = ref([])
const requestTypes = ref([])
const openActionId = ref(null)
const tableLoading = ref(true)

const applicantDocuments = ref([])
const currentIndex = ref(0)

const selectedApplicant = ref(null)
// Work Order Modal State
const showWorkOrderModal = ref(false)
const workOrderApplicant = ref(null)

// Material Modal State
const showMaterialModal = ref(false)
const materialApplicant = ref(null)

// Bulk Modals State
const showBulkWorkOrderModal = ref(false)
const showBulkMaterialModal = ref(false)

const errors = reactive({})
const toast = useToast()
const form = reactive({
  id: null,
  first_name: '',
  last_name: '',
  phone: '',
  kebele_id: '',
  house_number: '',
  documents: [] // file array
})

//const getKebeles = () => api.get('/kebeles')
const getRequestTypes = () => api.get('/request_type')

const fetchKebeles = async () => {
  try {
    const response = await api.get('/kebeles')
    kebeles.value = response.data || []
  } catch (error) {
    console.error('Failed to load kebeles:', error)
    toast.error('Failed to load kebele options')
  }
}

const kebeleOptions = computed(() => {
  return kebeles.value.map((kebele) => ({
    value: kebele.id,
    label: kebele.kebele_name
  }))
})
const fetchApplicants = async () => {
  try {
    tableLoading.value = true
    applicants.value = (await api.get('/applicants')).data
  } catch (e) {
    console.error(e)
    toast.error('Error featching applicant!')
  } finally {
    tableLoading.value = false
  }
}

// ----------------- MODALS -----------------
const openCreateModal = () => {
  mode.value = 'create'
  resetForm()
  showApplicantModal.value = true
}
const openEditModal = (row) => {
  mode.value = 'edit'
  Object.assign(form, {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    phone: row.phone,
    kebele_id: row.kebele_id,
    house_number: row.house_number,
    documents: []
  })
  showApplicantModal.value = true
}
const closeApplicantModal = () => {
  showApplicantModal.value = false
}

const handleSubmit = async () => {
  loading.value = true
  const formData = new FormData()

  if (form.first_name) formData.append('first_name', form.first_name)
  if (form.last_name) formData.append('last_name', form.last_name)
  if (form.phone) formData.append('phone', form.phone)
  if (form.kebele_id) formData.append('kebele_id', String(form.kebele_id)) // Convert to string
  if (form.house_number) formData.append('house_number', form.house_number)

  if (form.documents && form.documents.length > 0) {
    form.documents.forEach((file) => {
      formData.append('documents[]', file)
    })
  } else {
    toast.warning('No documents selected')
  }
  try {
    if (mode.value === 'create') {
      const { data } = await api.post('/applicants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success(data.message)
    } else {
      const { data } = await api.post(`/applicants/${form.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT'
        }
      })
      toast.success(data.message)
    }

    await fetchApplicants()
    closeApplicantModal()
    resetForm()
  } catch (e) {
    if (e.response?.data?.errors) {
      Object.assign(errors, e.response.data.errors)
      console.log('Validation errors:', e.response.data.errors)
    }
    const errmess = e.response?.data?.message || 'Somethine went wrong!'
    toast.error(errmess)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    id: null,
    first_name: '',
    last_name: '',
    phone: '',
    kebele_id: null,
    house_number: '',
    documents: []
  })
  Object.keys(errors).forEach((k) => delete errors[k])
}

const toggleDropdown = (id) => (openActionId.value = openActionId.value === id ? null : id)

const showDeleteModal = ref(false)
const deleteTargetId = ref(null)
const deleteTargetName = ref('')

const openDeleteModal = (row) => {
  deleteTargetId.value = row.id // Unique ID for deletion
  deleteTargetName.value = `${row.first_name} ${row.last_name}` // Display only
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}

const handleDelete = async () => {
  if (!deleteTargetId.value) return
  loading.value = true
  try {
    const { data } = await api.delete(`/applicants/${deleteTargetId.value}`) // Delete by ID
    applicants.value = applicants.value.filter((a) => a.id !== deleteTargetId.value)
    toast.success(data.message)
    showDeleteModal.value = false
  } catch (err) {
    console.error('Delete failed', err)
    toast.error('Error deleting this applicant!')
  } finally {
    loading.value = false
  }
}

const getRowActions = (row) => {
  const actions = [
    {
      name: 'View Details',
      icon: 'EyeIcon',
      onClick: () => viewApplicant(row),
      class: 'action-view'
    },
    {
      name: 'Edit',
      icon: 'PencilIcon',
      onClick: () => openEditModal(row),
      class: 'action-edit'
    }
  ]
  if (row.status === 'Pending') {
    actions.push({
      name: 'Assign Work Order',
      icon: 'ClipboardDocumentListIcon',
      onClick: () => openWorkOrderModal(row),
      class: 'action-workorder'
    })
  }
  // Always include these
  actions.push(
    {
      name: 'Delete',
      icon: 'TrashIcon',
      onClick: () => openDeleteModal(row),
      class: 'action-delete',
      danger: true
    },
    {
      name: 'Verify Document',
      icon: 'VerifyIcon',
      onClick: () => loadApplicantDocuments(row),
      class: 'action-verify'
    }
  )

  return actions
}
const statusClass = (status) => {
  return {
    'bg-red-100 text-red-600': status === 'Pending' || status === 'Rejected',
    'bg-yellow-100 text-yellow-600': status === 'Under_review',
    'bg-green-100 text-green-600': status === 'Approved',
    'bg-green-100 text-green-600': status === 'Accepted'
  }
}

const loadApplicantDocuments = async (row) => {
  selectedApplicant.value = {
    id: row.id,
    applicant_name: row.full_name, // use existing field
    phone: row.phone
  }
  currentIndex.value = 0

  try {
    const res = await api.get(`/applicants/${row.id}/documents`)
    applicantDocuments.value = res.data
  } catch (err) {
    toast.error('Failed to load documents')
  }
}

const isImage = (path) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(path)
}

const isPdf = (path) => {
  return /\.pdf$/i.test(path)
}

const getRowActions_doc = (doc) => {
  return [
    {
      name: 'Open Document',
      icon: 'EyeIcon',
      onClick: () => openDocument(doc),
      class: 'action-open'
    },
    {
      name: 'Accept',
      icon: 'CheckCircleIcon',
      onClick: () => openAcceptedModal(doc),
      class: 'action-accept'
    },
    {
      name: 'Reject',
      icon: 'XCircleIcon',
      onClick: () => openRejectModal(doc),
      class: 'action-reject'
    },
    {
      name: 'Delete',
      icon: 'TrashIcon',
      onClick: () => openDeleteDocModal(doc),
      class: 'action-delete',
      danger: true
    }
  ]
}
const currentDocument = computed(() => {
  return applicantDocuments.value[currentIndex.value] || null
})

const nextDocument = () => {
  if (currentIndex.value < applicantDocuments.value.length - 1) {
    currentIndex.value++
  }
}

const prevDocument = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}
const getDocumentUrl = (doc) => {
  return `http://localhost:8000/storage/${doc.file_path}`
}
const openDocument = async (doc) => {
  window.open(getDocumentUrl(doc), '_blank')

  if (doc.Status === 'Pending') {
    doc.status = 'Under_review'
    await updateStatus(doc.id, 'Under_review')
    ;((doc.Status = 'Under_review'), (doc.is_viewed = true))
  }
}
const rejectModal = ref({
  show: false,
  row: null,
  reason: ''
})
const acceptModal = ref({
  show: false,
  row: null,
  applicantName: ''
})
const deleteModal = ref({
  show: false,
  row: null,
  reason: ''
})
const deleteDocModal = ref({
  show: false,
  row: null,
  reason: ''
})
const acceptDocument = async (doc) => {
  if (!doc.is_viewed) {
    toast.warning('You must view the document first.')
    return
  }

  try {
    const { data } = await api.post(`/documents/${doc.id}/accept`)
    doc.Status = 'Accepted'
    toast.success(data.message)
    closeAcceptedModal()
  } catch (err) {
    const errmess = err.response?.data?.message || 'Something went wrong!'
    toast.error(errmess)
  } finally {
    this.loading = false
  }
}

const openRejectModal = (row) => {
  if (!row.is_viewed) {
    toast.warning('You must view the document first.')
    return
  }
  if (row.Status === 'Rejected') {
    toast.warning('This document is already rejected.')
    return
  }
  if (row.Status === 'Accepted') {
    toast.warning('This document is already Accepted and cannot be rejected.')
    return
  }
  rejectModal.value = {
    show: true,
    row: row,
    rejection_reason: ''
  }
}
const openDeleteDocModal = (row) => {
  if (!row.is_viewed) {
    toast.warning('You must view the document first.')
    return
  }
  deleteDocModal.value = {
    show: true,
    row: row,
    deletion_reason: ''
  }
}
const rejectDocument = async (row) => {
  if (!rejectModal.value.reason) {
    toast.error('Please enter rejection reason')
    return
  }
  try {
    loading.value = true
    const { data } = await api.post(`/documents/${rejectModal.value.row.id}/reject`, {
      rejection_reason: rejectModal.value.reason
    })
    rejectModal.value.row.Status = 'Rejected'
    toast.success(data.message)
    rejectModal.value.show = false
  } catch (err) {
    const errmessage = err.response?.data?.message || 'Something Went wrong'
    toast.error(errmessage)
  } finally {
    loading.value = false
  }
}

const deleteDocument = async () => {
  if (!deleteDocModal.value.reason) {
    toast.error('Please enter a deletion reason')
    return
  }
  try {
    const { data } = await api.delete(`/documents/${deleteDocModal.value.row.id}`, {
      data: { deletion_reason: deleteDocModal.value.reason }
    })
    toast.success(data.message)
    deleteDocModal.value.show = false
    applicantDocuments.value = applicantDocuments.value.filter(
      (doc) => doc.id !== deleteDocModal.value.row.id
    )
    closedeleteDocModal()
  } catch (err) {
    const errmess = err.response?.data?.message || 'Something went wrong!'
    toast.error(errmess)
  } finally {
    loading.value = false
  }
}
const updateStatus = async (id, newStatus) => {
  try {
    const { data } = await api.patch(`/documents/${id}/status`, {
      status: newStatus
    })
    toast.success(data.message)
  } catch (error) {
    const errmess = error.response?.data?.message ?? 'Something went wrong!'
    toast.error(errmess)
  }
}

const openAcceptedModal = (row) => {
  if (row.Status === 'Pending') {
    toast.warning('You must read/view the document before accepting it.')
    return
  }
  if (row.Status === 'Rejected') {
    toast.warning('This document is already rejected.')
    return
  }
  if (row.Status === 'Accepted') {
    toast.warning('This document is already accepted!.')
    return
  }
  acceptModal.value = {
    show: true,
    row: row,
    applicantName: `${row.First_Name || ''} ${row.Last_Name || ''}`.trim() || 'Unknown'
  }
}
const closeAcceptedModal = () => {
  ;((acceptModal.value.show = false),
    (acceptModal.value.row = null),
    (acceptModal.value.applicantName = ''))
}
const closeRejectModal = () => {
  rejectModal.value.show = false
  rejectModal.value.row = null
  rejectModal.value.reason = ''
}
const closedeleteDocModal = () => {
  deleteDocModal.value.show = false
  deleteDocModal.value.row = null
}

const workorderform = ref({
  order_code: '',
  applicant_id: '',
  staff_id: '',
  priority: 'medium',
  due_date: '',
  description: '',
  location: '',
  estimated_hours: '',
  is_urgent: false
})

const openWorkOrderModal = (row) => {
  selectedApplicant.value = row
  workorderform.value = {
    // order_code: generateOrderCode(),
    applicant_id: row.id,
    staff_id: '',
    priority: 'medium',
    scheduled_date: '',
    description: '',
    location_details: '',
    estimated_hours: '',
    is_urgent: false
  }
  showWorkOrderModal.value = true
}

const staffs = ref([])

const getStaffs = async () => {
  try {
    const res = await api.get('/staffs')
    // Extract the staff array from response
    staffs.value = res.data.staffs
  } catch (error) {
    console.error('Failed to load staffs:', error)
    staffs.value = []
  }
}

const staffOptions = computed(() =>
  staffs.value.map((s) => ({
    label: `${s.first_name || ''} ${s.last_name || ''}`.trim(),
    value: s.id
  }))
)


const assignWorkOrder = async () => {
  if (!workorderform.value.staff_id) {
    toast.warning('Please select staff')
    return
  }

  loading.value = true

  try {
    const { data } = await api.post('/workorders', {
      applicant_id: workorderform.value.applicant_id,
      staff_id: workorderform.value.staff_id,
      priority: workorderform.value.priority,
      scheduled_date: workorderform.value.scheduled_date,
      location_details: workorderform.value.location_details,
      description: workorderform.value.description,
      estimated_hours: workorderform.value.estimated_hours,
      is_urgent: workorderform.value.is_urgent
    })
    
    // Update local status
    const index = applicants.value.findIndex(a => a.id === workorderform.value.applicant_id)
    if (index !== -1) {
      applicants.value[index].status = data.applicant_status || 'workorder_assigned'
    }
    
    // Dispatch event for workorder.vue
    window.dispatchEvent(new CustomEvent('workorder-updated', {
      detail: {
        applicantId: workorderform.value.applicant_id,
        status: data.applicant_status || 'workorder_assigned'
      }
    }))
    
    toast.success('Work order assigned successfully')
    showWorkOrderModal.value = false
    
    workorderform.value = {
      applicant_id: '',
      staff_id: '',
      priority: 'medium',
      scheduled_date: '',
      description: '',
      location_details: '',
      estimated_hours: '',
      is_urgent: false
    }
    
  } catch (error) {
    console.error('Work order creation error:', error)
    toast.error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to assign work order'
    )
  } finally {
    loading.value = false
  }
}

const refreshApplicantStatus = (applicantId, newStatus) => {
  const index = applicants.value.findIndex(a => a.id === applicantId)
  if (index !== -1) {
    applicants.value[index].status = newStatus
  }
  
   if (selectedApplicant.value?.id === applicantId) {
    selectedApplicant.value.status = newStatus
  }
}

onMounted(() => {
  fetchApplicants()
  fetchKebeles()
  getStaffs()
 
   // Listen for status update events
  window.addEventListener('status-updated', (event) => {
    const { applicantId, status } = event.detail
    refreshApplicantStatus(applicantId, status)
  })
})

// clean up


onUnmounted(() => {
  window.removeEventListener('status-updated', refreshApplicantStatus)
})
</script>

<template>
 <div class="p-6 text-gray-900 dark:text-gray-100">
  <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Applicants Managment</h1>
      <BaseButton 
      @click="openCreateModal"
       class="px-4 py-2 rounded-md font-semibold bg-blue-600 hover:bg-blue-700 text-white"
      >
      Add Applicant
    </BaseButton>
     </div>
    </div>
    <div class="grid grid-cols-1 gap-6">
      <div class="grid col-span-12 md:col-span-5">
        <div v-if="tableLoading" class="p-8 text-center">
          <Icon name="ArrowPathIcon" class="w-10 h-10 mx-auto text-indigo-600 animate-spin" />
          <p class="mt-3 text-gray-500">Loading Applicants...</p>
        </div>
        <Table
          :columns="[
            
            { key: 'full_name', label: 'Applicant Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'kebele.kebele_name', label: 'Kebele' },
            { key: 'house_number', label: 'House Number' },
            { key: 'status', label: 'Status', type: 'badge' },
            { key: 'applied_date', label: 'Applied Date' }
          ]"
          :rows="applicants"
          selectable
        >
          <!-- Actions column -->
          <template #actions="{ row }">
            <ThreeDotsButton :actions="getRowActions(row)" :id="`desktop-actions-${row.id}`" />
          </template>
        </Table>
      </div>
      <div class="col-span-12 md:col-span-7">
        <div v-if="selectedApplicant">
          <!-- Applicant Header -->
          <div
            class="mb-6 p-5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40"
                >
                  <UserIcon class="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>

                <div>
                  <p class="text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                    Applicant Name
                  </p>
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ selectedApplicant.applicant_name }}
                  </h3>
                </div>
              </div>
              <span
                class="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-full shadow-sm"
              >
                {{ applicantDocuments.length }} Docs
              </span>
            </div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="doc in applicantDocuments"
              :key="doc.id"
              class="relative border rounded-xl p-2 hover:shadow-lg transition cursor-pointer"
            >
              <div class="h-48">
                <img
                  v-if="isImage(doc.file_path)"
                  :src="getDocumentUrl(doc)"
                  class="h-full w-full object-cover rounded-lg"
                />
                <iframe
                  v-else-if="isPdf(doc.file_path)"
                  :src="getDocumentUrl(doc)"
                  class="h-full w-full rounded-lg pointer-events-none"
                ></iframe>
              </div>
              <div class="flex justify-between items-center mt-2">
                <span
                  class="text-xs font-semibold px-3 py-1 rounded-full"
                  :class="statusClass(doc.Status)"
                >
                  {{ doc.Status }}
                </span>

                <!-- Three Dots Action Button -->
                <div @click.stop>
                  <ThreeDotsButton
                    :actions="getRowActions_doc(doc)"
                    :open="openDropdownId === doc.id"
                    @toggle="toggleDropdown(doc.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-gray-400 p-10">Select applicant to view documents</div>
      </div>
    </div>

    <Modal
      v-model="showApplicantModal"
      :title="mode === 'create' ? 'Register Applicant' : 'Edit Applicant'"
      :showCancel="true"
      :confirmText="mode === 'create' ? 'Save' : 'Update'"
      :loading="loading"
      @confirm="handleSubmit"
      @close="closeApplicantModal"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          required
          label="First Name"
          v-model="form.first_name"
          :error="errors.first_name"
        />
        <BaseInput required label="Last Name" v-model="form.last_name" :error="errors.last_name" />
        <BaseInput required label="Phone" v-model="form.phone" :error="errors.phone" />
        <BaseSelect
          v-model="form.kebele_id"
          :options="kebeleOptions"
          label="Kebele"
          :required="true"
          :error="errors.kebele_id ? errors.kebele_id[0] : ''"
          :searchable="true"
          :clearable="false"
          placeholder="Select Kebele"
        />
        <BaseInput
          required
          label="House Number"
          v-model="form.house_number"
          :error="errors.house_number"
        />
        <BaseInput label="Upload Documents" type="file" multiple v-model="form.documents" />
      </div>
    </Modal>

    <Modal
      v-model="showDeleteModal"
      title="Delete Applicant"
      :showCancel="true"
      confirmText="Delete"
      :confirmType="danger"
      :loading="loading"
      @confirm="handleDelete"
      @close="closeDeleteModal()"
    >
      <p class="text-gray-700 dark:text-gray-200">
        Are you sure you want to delete
        <strong>{{ deleteTargetName }}</strong
        >? This action cannot be undone.
      </p>
    </Modal>

    <Modal
      v-model="acceptModal.show"
      title="Accepting Document"
      :showCancel="true"
      :loading="loading"
      confirmText="Accept"
      @confirm="acceptDocument(acceptModal.row)"
      @close="closeAcceptedModal()"
    >
      <div class="p-4">
        <p class="text-gray-700 dark:text-gray-200">
          Are you sure you want to accept The document for
          <strong>{{ acceptModal.applicantName }}</strong
          >?
        </p>
      </div>
    </Modal>
    <Modal
      v-model="rejectModal.show"
      title="Reject Document"
      :showCancel="true"
      :loading="loading"
      confirmText="Reject"
      @confirm="rejectDocument(rejectModal.row)"
      @close="closeRejectModal()"
    >
      <BaseInput
        type="textarea"
        label="Rejection Reason"
        v-model="rejectModal.reason"
        placeholder="Enter reason for rejection"
        :rows="5"
        error="Please enter a reason"
      />
    </Modal>
    <Modal
      v-model="deleteDocModal.show"
      title="Deleting Document"
      :showCancel="true"
      :loading="loading"
      confirmType="danger"
      confirmText="Delete"
      @confirm="deleteDocument(deleteDocModal.row)"
      @close="closedeleteDocModal"
    >
      <BaseInput
        type="textarea"
        label="Deletion Reason"
        v-model="deleteDocModal.reason"
        placeholder="Enter reason for Deletion"
        :rows="5"
        error="Please enter a reason"
      />
    </Modal>
    <BaseModal
      v-model="showWorkOrderModal"
      title="Assign Work Order"
      confirmText="Assign Work Order"
      :loading="loading"
      @confirm="assignWorkOrder"
    >
      <div class="space-y-4">
        <!-- Applicant Info -->
        <div
          v-if="selectedApplicant"
          class="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-sm font-medium"
        >
          {{ selectedApplicant.first_name }} {{ selectedApplicant.last_name }}
        </div>

        <!-- Staff Select -->
        <BaseSelect
          v-model="workorderform.staff_id"
          :options="staffOptions"
          label="Assign Staff"
          placeholder="Select staff"
          searchable
          :disabled="staffOptions.length === 0"
        />

        <!-- Scheduled Date -->
        <BaseInput
          type="date"
          v-model="workorderform.scheduled_date"
          label="Scheduled Date"
          required
        />

        <!-- Priority -->
        <BaseSelect
          v-model="workorderform.priority"
          :options="[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
            { label: 'Urgent', value: 'urgent' }
          ]"
          label="Priority"
          required
        />

        <!-- Description -->
        <BaseInput
          type="textarea"
          v-model="workorderform.description"
          label="Description"
          placeholder="Enter work order description"
        />

        <!-- Location -->
        <BaseInput
          v-model="workorderform.location_details"
          label="Location Details"
          placeholder="Enter location details"
        />

        <!-- Estimated Hours -->
        <BaseInput
          type="number"
          v-model="workorderform.estimated_hours"
          label="Estimated Hours"
          placeholder="Enter estimated hours"
        />

        <!-- Urgent Checkbox -->
        <label class="inline-flex items-center gap-2">
          <input type="checkbox" v-model="workorderform.is_urgent" />
          <span>Mark as urgent</span>
        </label>
      </div>
    </BaseModal>

</template>
