import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const access = localStorage.getItem('access');

  useEffect(() => {
    if (!access) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'error',
        title: 'You do not have the right',
      });

      navigate('/login');
    }
  }, [access, navigate]);

  if (access) {
    return children;
  }

  return null;
};

export default ProtectedRoute;