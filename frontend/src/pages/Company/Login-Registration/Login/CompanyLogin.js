import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {handleError, handleSuccess} from '../../../../utils/utils.js';
import styles from './CompanyLogin.module.css';


function CompanyLogin() {

    const [loginInfo, setLoginInfo] = useState({
        companyID: '',
        password: ''
    })

    // React تستخدم للتنقل بين المسارات في navigation function يستخدم للحصول على React Router من مكتبة Hook هي عباره عن
    const navigate = useNavigate();

    // نقوم بحفظها user القيم التي يقوم بتدخيلها ال
    const handleChange = (e) => {
        const {name, value} = e.target;
        const copyLoginInfo = {...loginInfo}; // نسخ معلومات تسجيل الدخول
        copyLoginInfo[name] = value; // تحديث قيمة معينة
        setLoginInfo(copyLoginInfo); // نقوم بتحديث الحالة باستخدام دالة
    }

    const handleLogin = async (e) => {
        e.preventDefault(); // يمنع إعادة تحميل الصفحة عند ارسال النموذج
        const {companyID, password} = loginInfo;
        if (!companyID || !password) { // يتحقق مما اذا كانت القيمة غير موجوده (ان تكون فارغة او غير معرفه)
            return handleError('companyID and password are required')
        }

        // this code sends login information to a local server using a POST request in JSON format.
        try {
            const url = `http://localhost:8080/auth/company/login`; // مكان ارسال الطلب
            const response = await fetch(url, { // HTTP لارسال طلب fetch
                method: "POST", // نوع الطلب
                headers: {
                    'Content-Type': 'application/json' // نوع البيانات ( هنا بتنسيق json )
                },
                body: JSON.stringify(loginInfo) // وارسالها JSON string  الى loginInfo يتم تحويل  
            });
            const result = await response.json(); // وتخزينها في متغير JSON لتحويل استجابة الخادم ال
            if (result.success) {
                if (result.otpRequired) {
                    localStorage.setItem('userOtpId', result.userOtpId);
                    navigate('/company-login/otp')
                } else {
                    const {message, jwtToken, role} = result;
                    handleSuccess(message);
                    localStorage.setItem('token', jwtToken); // يقوم بتخزين المعلومات داخل المتصفح ( -Application in browser للتأكد من انه تم الحفظ تذهب الى - key 'token' تحت مفتاح localStorage في jwt هنا خزن قيمة )
                    localStorage.setItem('role', role);
                    setTimeout(() => {
                        navigate('/company/home') // (function) سيتم تنفيذها بعد انتهاء الوقت
                    }, 500) // الوقت الذي سيتم الانتظار فيه قبل تنفيذ الدالة، وهو 500 مللي ثانية، أي 0.5 ثانية
                }
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <section className={styles.companyBody}>
            <div className={styles.companyLoginContainer}>
                <h1 className={styles.companyLoginH1}>Contracting <br/>Company Login</h1>
                <form className={styles.companyFormLogin} onSubmit={handleLogin}>
                    <div className={styles.companyLoginDiv}>
                        <label className={styles.companyLoginLabel} htmlFor='companyID'>Company ID</label>
                        <input
                            className={styles.companyLoginInput}
                            onChange={handleChange}
                            type='companyID'
                            name='companyID'
                            placeholder='Enter your company ID ...'
                            value={loginInfo.companyID}
                            autoFocus
                        />
                    </div>
                    <div className={styles.companyDiv}>
                        <label className={styles.companyLoginLabel} htmlFor='password'>Password</label>
                        <input
                            className={styles.companyLoginInput}
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={loginInfo.password}
                        />
                    </div>
                    <button className={styles.companyLoginButton} type='submit'>Login</button>
                    <span className={styles.companyLoginSpan}>Don't have an account?
                        <Link className={styles.companyLoginLink} to="/company-registration"> Registration</Link>
                    </span>
                    <span className={styles.companyLoginSpan}>If you are a supplier?
                        <Link className={styles.companyLoginLink} to="/supplier-login"> Supplier</Link>
                    </span>
                </form>
                <ToastContainer/> {/* يتم استخدامه لعرض رسائل النجاح أو الخطأ أو أي نوع آخر من الإشعارات التي يحتاج المستخدم لرؤيتها */}
            </div>
        </section>
    )
}

export default CompanyLogin;
