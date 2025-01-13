import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RefrshHandler({ setIsAuthenticated, setRole, setSupplierProduct }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const supplierProduct = localStorage.getItem('supplierProduct');

    if (token && role) {
      setIsAuthenticated(true);
      setRole(role);
      if (role === 'supplier' && supplierProduct) {
        setSupplierProduct(supplierProduct);
      }

      // تعريف المسارات المسموحة لكل دور
      const allowedPaths = {
        supplier: {
          cement: ['/supplier/cement/under-preparing-orders', '/supplier/cement/pending-orders', '/supplier/cement/old-orders', '/supplier/cement/profile', '/supplier/cement/profile/edit-profile','/supplier/cement/profile/disabled-otp','/supplier/cement/profile/enabled-otp'],
          concrete: ['/supplier/concrete/under-preparing-orders', '/supplier/concrete/pending-orders', '/supplier/concrete/old-orders', '/supplier/concrete/profile', '/supplier/concrete/profile/edit-profile', '/supplier/concrete/profile/edit-concrete-strength','/supplier/concrete/profile/enabled-otp','/supplier/concrete/profile/disabled-otp'],
        },
        company: ['/company/home', '/company/home/cement-orders', '/company/home/concrete-orders', '/company/home/profile', '/company/home/profile/edit-profile', '/company/home/under-preparing-orders', '/company/home/pending-orders', '/company/home/old-orders', '/company/home/cement-order/cement-bill', '/company/home/concrete-orders/express-orders', '/company/home/concrete-orders/express-orders/express-bill', '/company/home/concrete-orders/custom-orders', '/company/home/concrete-orders/custom-orders', '/company/home/concrete-orders/note','/company/home/concrete-order/custom-order/custom-bill','/company/home/profile/disabled-otp','/company/home/profile/enabled-otp'],
        admin: ['/admin/request-user', '/admin/approve-user', "/admin/reject-user","/admin/add-admin" ],
      };

      // التحقق إذا كان المسار الحالي من المسارات المسموحة
      const isAllowed =
        role === 'supplier'
          ? allowedPaths[role]?.[supplierProduct]?.includes(location.pathname)
          : allowedPaths[role]?.includes(location.pathname);

      // إذا كان المسار غير مسموح، توجيه المستخدم إلى الصفحة المناسبة
      if (!isAllowed) {
        if (role === 'supplier' && supplierProduct) {
          navigate(`/${role}/${supplierProduct}/pending-orders`, { replace: false });
        } else if(role === 'admin'){
          navigate(`/${role}/request-user`, { replace: false });
        } else {
          navigate(`/${role}/home`, { replace: false });
        }
      }
    } else {
      setIsAuthenticated(false);
      setRole(null);
      setSupplierProduct(null);
      // إذا لم يتم تسجيل الدخول، نقوم بتوجيه المستخدم إلى صفحة تسجيل الدخول
      // if (!['/supplier-login','/supplier-login/otp', '/company-login', '/company-login/otp', '/admin', '/supplier-registration', '/company-registration'].includes(location.pathname)) {
      //   navigate('/', { replace: false }); 
      //   // add worng path 
      // }
    }
  }, [location, navigate, setIsAuthenticated, setRole, setSupplierProduct]);

  return null; // هذا المكون لا يعرض شيئًا
}

export default RefrshHandler;
