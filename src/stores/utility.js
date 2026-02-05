import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUtilityStore = defineStore('utility', () => {
  // Administrative Hierarchy
  const administrativeData = ref({
    regions: [
      { id: 1, code: 'ET-AM', name: 'Amhara National Regional State', zones: 11, woredas: 145, customers: 3847 },
      { id: 2, code: 'ET-OR', name: 'Oromia Region', zones: 20, woredas: 265, customers: 5123 },
      { id: 3, code: 'ET-SN', name: 'Southern Nations', zones: 15, woredas: 189, customers: 2789 },
      { id: 4, code: 'ET-TI', name: 'Tigray Region', zones: 7, woredas: 84, customers: 1892 },
    ],
    zones: [
      { id: 1, region_id: 1, name: 'North Shewa', woredas: 24, branches: 8 },
      { id: 2, region_id: 1, name: 'South Wollo', woredas: 18, branches: 6 },
      { id: 3, region_id: 2, name: 'West Shewa', woredas: 32, branches: 12 },
    ],
    woredas: [
      { id: 1, zone_id: 2, name: 'Dessie Zuria', cities: 3, kebeles: 45, customers: 1245 },
      { id: 2, zone_id: 2, name: 'Kutaber', cities: 2, kebeles: 32, customers: 876 },
    ],
    cities: [
      { id: 1, woreda_id: 1, name: 'Dessie', kebeles: 12, branches: 3 },
      { id: 2, woreda_id: 1, name: 'Kombolcha', kebeles: 8, branches: 2 },
    ],
    kebeles: [
      { id: 1, woreda_id: 1, city_id: 1, name: 'Kebele 01', households: 245, customers: 189 },
      { id: 2, woreda_id: 1, city_id: 1, name: 'Kebele 02', households: 312, customers: 267 },
    ],
    branches: [
      { id: 1, woreda_id: 1, city_id: 1, name: 'Dessie Main Branch', staff: 12, customers: 845 },
      { id: 2, woreda_id: 1, city_id: 2, name: 'Kombolcha Branch', staff: 8, customers: 623 },
    ],
  })

  // Applicants & Customers
  const applicants = ref([
    {
      id: 1001,
      name: 'Alemu Bekele',
      phone: '+251 91 234 5678',
      kebele: 'Kebele 01, Dessie',
      appliedDate: '2024-01-15',
      requestType: 'New Domestic Connection',
      status: 'Pending',
      documents: ['ID Copy', 'House Ownership'],
    },
    {
      id: 1002,
      name: 'Meron Tesfaye',
      phone: '+251 92 345 6789',
      kebele: 'Kebele 03, Kombolcha',
      appliedDate: '2024-01-14',
      requestType: 'Meter Replacement',
      status: 'Document Verification',
      documents: ['ID Copy', 'Old Meter Photo'],
    },
  ])

  const customers = ref([
    {
      id: 5001,
      name: 'Tewodros Alemu',
      customerCode: 'CUS-2023-0456',
      category: 'Residential Large',
      meterNumber: 'MTR-78945',
      connectionDate: '2023-03-15',
      lastReading: 2456,
      currentReading: 2489,
      consumption: 33,
      status: 'Active',
      balance: 0,
    },
    {
      id: 5002,
      name: 'Sara Mohammed',
      customerCode: 'CUS-2023-0789',
      category: 'Commercial',
      meterNumber: 'MTR-78946',
      connectionDate: '2023-04-20',
      lastReading: 1245,
      currentReading: 1321,
      consumption: 76,
      status: 'Active',
      balance: 1250,
    },
  ])

  // Meter Readings & Billing
  const meterReadings = ref([
    {
      id: 1,
      customerCode: 'CUS-2023-0456',
      customerName: 'Tewodros Alemu',
      previousReading: 2423,
      currentReading: 2456,
      consumption: 33,
      readingDate: '2024-01-15',
      status: 'Billed',
    },
    {
      id: 2,
      customerCode: 'CUS-2023-0789',
      customerName: 'Sara Mohammed',
      previousReading: 1169,
      currentReading: 1245,
      consumption: 76,
      readingDate: '2024-01-15',
      status: 'Pending',
    },
  ])

  const bills = ref([
    {
      id: 1,
      customerCode: 'CUS-2023-0456',
      billingMonth: 'January 2024',
      amount: 825,
      dueDate: '2024-01-30',
      status: 'Paid',
      paymentDate: '2024-01-20',
    },
    {
      id: 2,
      customerCode: 'CUS-2023-0789',
      billingMonth: 'January 2024',
      amount: 1900,
      dueDate: '2024-01-30',
      status: 'Overdue',
      paymentDate: null,
    },
  ])

  // Tariffs
  const tariffs = ref([
    {
      id: 1,
      category: 'Residential Small',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      blocks: [
        { from: 0, to: 6, price: 15 },
        { from: 7, to: 15, price: 20 },
        { from: 16, to: 30, price: 25 },
        { from: 31, to: Infinity, price: 30 },
      ],
      status: 'Active',
    },
    {
      id: 2,
      category: 'Commercial',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      blocks: [
        { from: 0, to: 20, price: 25 },
        { from: 21, to: 50, price: 30 },
        { from: 51, to: 100, price: 35 },
        { from: 101, to: Infinity, price: 40 },
      ],
      status: 'Active',
    },
  ])

  // Actions
  function addApplicant(applicant) {
    applicants.value.push({
      id: Date.now(),
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      ...applicant,
    })
  }

  function updateApplicantStatus(id, status) {
    const applicant = applicants.value.find(a => a.id === id)
    if (applicant) {
      applicant.status = status
    }
  }

  function addCustomer(customer) {
    customers.value.push({
      id: Date.now(),
      status: 'Active',
      connectionDate: new Date().toISOString().split('T')[0],
      balance: 0,
      ...customer,
    })
  }

  function recordMeterReading(reading) {
    meterReadings.value.unshift({
      id: Date.now(),
      readingDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...reading,
    })
  }

  function generateBill(customerId, consumption) {
    const customer = customers.value.find(c => c.id === customerId)
    if (customer) {
      const tariff = tariffs.value.find(t => t.category === customer.category)
      let amount = 0
      
      if (tariff) {
        let remaining = consumption
        for (const block of tariff.blocks) {
          if (remaining <= 0) break
          
          const blockRange = block.to === Infinity ? remaining : block.to - block.from
          const blockConsumption = Math.min(remaining, blockRange)
          amount += blockConsumption * block.price
          remaining -= blockConsumption
        }
      }
      
      bills.value.push({
        id: Date.now(),
        customerCode: customer.customerCode,
        billingMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        amount,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Pending',
        paymentDate: null,
      })
    }
  }

  function updateBillStatus(billId, status, paymentDate = null) {
    const bill = bills.value.find(b => b.id === billId)
    if (bill) {
      bill.status = status
      if (paymentDate) {
        bill.paymentDate = paymentDate
      }
    }
  }

  return {
    // State
    administrativeData,
    applicants,
    customers,
    meterReadings,
    bills,
    tariffs,
    
    // Actions
    addApplicant,
    updateApplicantStatus,
    addCustomer,
    recordMeterReading,
    generateBill,
    updateBillStatus,
  }
})