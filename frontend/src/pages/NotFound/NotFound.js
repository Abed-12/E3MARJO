import { useEffect, useState } from 'react';
import styles from './NotFound.module.css';

const NotFound = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, 1000); 

        return () => clearTimeout(timer);
    }, []);
    return (
        show ? (
            <div className={styles.notfoundContainer}>
                <div className={styles.notfoundContent}>
                    <div className={styles.notfoundDiamond}>
                        <div className={styles.diamondShape}></div>
                        <h1 className={styles.errorCode}>404</h1>
                    </div>
                    <h2 className={styles.errorTitle}>PAGE NOT FOUND</h2>
                    <p className={styles.errorMessage}>
                        The page you are looking for might have been removed had its name changed or is temporarily unavailable.
                    </p>
                    <a href="/" className={styles.homeButton}>
                        HOME PAGE
                    </a>
                </div>
            </div>
        ) : (
            <div className={styles.notfoundLoader}>
                <div className={styles.loader}></div>
            </div>
        )
    );
}

export default NotFound;