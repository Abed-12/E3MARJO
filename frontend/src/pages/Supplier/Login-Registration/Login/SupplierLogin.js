import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {handleError, handleSuccess} from '../../../../utils/utils.js';
import styles from './SupplierLogin.module.css';

function SupplierLogin() {

    const [loginInfo, setLoginInfo] = useState({
        supplierID: '',
        password: ''
    })

    // React تستخدم للتنقل بين المسارات في navigation function يستخدم للحصول على React Router من مكتبة Hook هي عباره عن
    const navigate = useNavigate();

    // نقوم بحفظها user القيم التي يقوم بتدخيلها ال
    const handleChange = (e) => {
        const {name, value} = e.target;
        console.log(name, value); // console شو بتدخل بعطيك على ال
        const copyLoginInfo = {...loginInfo}; // نسخ معلومات تسجيل الدخول
        copyLoginInfo[name] = value; // تحديث قيمة معينة
        setLoginInfo(copyLoginInfo); // نقوم بتحديث الحالة باستخدام دالة
    }

    const handleLogin = async (e) => {
        e.preventDefault(); // يمنع إعادة تحميل الصفحة عند ارسال النموذج
        const {supplierID, password} = loginInfo;
        if (!supplierID || !password) { // يتحقق مما اذا كانت القيمة غير موجوده (ان تكون فارغة او غير معرفه)
            return handleError('supplierID and password are required')
        }

        // this code sends login information to a local server using a POST request in JSON format.
        try {
            const url = `http://localhost:8080/auth/supplier/login`; // مكان ارسال الطلب
            const response = await fetch(url, { // HTTP لارسال طلب fetch
                method: "POST", // نوع الطلب
                headers: {
                    'Content-Type': 'application/json' // نوع البيانات ( هنا بتنسيق json )
                },
                body: JSON.stringify(loginInfo) // وارسالها JSON string  الى loginInfo يتم تحويل  
            });
            const result = await response.json(); // وتخزينها في متغير JSON لتحويل استجابة الخادم ال
            console.log(result);
            if (result.success) {
                if (result.otpRequired) {
                    localStorage.setItem('userOtpId', result.userOtpId);
                    navigate('/supplier-login/otp')
                } else {
                    const { message, jwtToken, role, supplierProduct} = result;
                    handleSuccess(message);
                    localStorage.setItem('token', jwtToken); // يقوم بتخزين المعلومات داخل المتصفح ( -Application in browser للتأكد من انه تم الحفظ تذهب الى - key 'token' تحت مفتاح localStorage في jwt هنا خزن قيمة )
                    localStorage.setItem('role', role);
                    localStorage.setItem('supplierProduct', supplierProduct);
                    setTimeout(() => {
                        supplierProduct === "Cement" ? navigate('/supplier/cement/pending-orders') : navigate('/supplier/concrete/home'); // (function) سيتم تنفيذها بعد انتهاء الوقت
                    }, 500)
                }
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <section className={styles.supplierBody}>
            <div className={styles.supplierLoginContainer}>
                <h1 className={styles.supplierLoginH1}>Supplier Login</h1>
                <form className={styles.supplierFormLogin} onSubmit={handleLogin}>
                    <div className={styles.supplierDiv}>
                        <label className={styles.supplierLoginLabel} htmlFor='supplierID'>Supplier ID</label>
                        <input
                            className={styles.supplierLoginInput}
                            onChange={handleChange}
                            type='supplierID'
                            name='supplierID'
                            placeholder='Enter your supplier ID ...'
                            value={loginInfo.supplierID}
                            autoFocus
                        />
                    </div>
                    <div className={styles.supplierDiv}>
                        <label className={styles.supplierLoginLabel} htmlFor='password'>Password</label>
                        <input
                            className={styles.supplierLoginInput}
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={loginInfo.password}
                        />
                    </div>
                    <button className={styles.supplierLoginButton} type='submit'>Login</button>
                    <span className={styles.supplierLoginSpan}>Don't have an account?
                        <Link className={styles.supplierLoginLink} to="/supplier-registration"> Registration</Link>
                    </span>
                    <span className={styles.supplierLoginSpan}>If you are a company?
                        <Link className={styles.supplierLoginLink} to="/company-login"> Company</Link>
                    </span>
                </form>
                <ToastContainer/> {/* يتم استخدامه لعرض رسائل النجاح أو الخطأ أو أي نوع آخر من الإشعارات التي يحتاج المستخدم لرؤيتها */}
            </div>
        </section>
    )
}

export default SupplierLogin;
