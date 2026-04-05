// src/utils/confirm.js
import Swal from 'sweetalert2'

export const confirmAction = async (title, text) => {
  const { isConfirmed } = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
   
  });

  return isConfirmed;
};