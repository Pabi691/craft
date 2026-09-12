// Read on every call (the reference snapshotted it once at import time, so a
// role change needed a full reload to take effect).
export const getUserRole = () => {
  try {
    return localStorage.getItem('role');
  } catch {
    return null;
  }
};

export const isDistributor = () => getUserRole() === 'distributor';
