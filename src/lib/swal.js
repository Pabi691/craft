import Swal from 'sweetalert2';

// SweetAlert styled to match the storefront (classes in index.css).
const craft = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: 'cw-swal',
    confirmButton: 'btn-primary',
    cancelButton: 'btn-outline',
  },
  showClass: { popup: 'swal2-show' },
});

export async function confirmDialog({ title, text, confirmText = 'Yes, continue', cancelText = 'Cancel', icon = 'warning' }) {
  const result = await craft.fire({ title, text, icon, showCancelButton: true, confirmButtonText: confirmText, cancelButtonText: cancelText });
  return result.isConfirmed;
}

export function alertDialog({ title, text, icon = 'info', confirmText = 'OK' }) {
  return craft.fire({ title, text, icon, confirmButtonText: confirmText });
}

export default craft;
