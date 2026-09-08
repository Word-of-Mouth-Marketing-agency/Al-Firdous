export type InquiryState = {
  status: 'idle' | 'success' | 'error'
  message: string
  values: {
    name: string
    phone: string
    subject: string
    message: string
  }
}

export const initialInquiryState: InquiryState = {
  status: 'idle',
  message: '',
  values: { name: '', phone: '', subject: '', message: '' },
}
