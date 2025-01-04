import React, {useState} from "react";
import {Link} from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar(props) {
    const [isActive, setIsActive] = useState(false);
    const [dropdownActive, setDropdownActive] = useState(false);

    const toggleNavbar = () => {
        setIsActive(prev => !prev); // Toggle the state
    };

    const toggleDropdown = () => {
        setDropdownActive(prev => !prev);
    };

    const confirmNavigation = (event, confirmationMessage = 'Are you sure you want to leave this page?') => {
        if (props.confirmationRequired === 'true' && !window.confirm(props.confirmationMessage ?? confirmationMessage)) {
            event.preventDefault();
        }
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <img src="/images/logo.png" alt="logo" className={styles.logo}/>
                <button
                    className={styles.toggleButton}
                    aria-expanded={isActive}
                    aria-label="Toggle navigation"
                    onClick={toggleNavbar}
                >
                    ☰
                </button>
                {/* The navbarCollapse class dynamically changes based on the isActive state */}
                <div className={`${styles.navbarCollapse} ${isActive ? styles.active : ''}`}>
                    <ul className={styles.navbarNav}>
                        {props.one && (
                            <li className={styles.navItem}>
                                <Link className={styles.navLink} onClick={(e) => confirmNavigation(e)}
                                      to={props.pathOne}>{props.one}</Link>
                            </li>
                        )}
                        {props.two && (
                            <li className={`${styles.navItem} ${styles.dropdown}`}>
                                <button
                                    className={`${styles.navLink} ${styles.dropdownToggle}`}
                                    aria-expanded={dropdownActive}
                                    onClick={toggleDropdown}
                                >
                                    {props.two}
                                </button>
                                <ul className={`${styles.dropdownMenu} ${dropdownActive ? styles.show : ''}`}>
                                    <li className={styles.dropdownItem}>
                                        <Link className={styles.navLink} onClick={(e) => confirmNavigation(e)}
                                              to={props.pathTwo1}>{props.two1}</Link>
                                    </li>
                                    <li className={styles.dropdownItem}>
                                        <Link className={styles.navLink} onClick={(e) => confirmNavigation(e)}
                                              to={props.pathTwo2}>{props.two2}</Link>
                                    </li>
                                    <li className={styles.dropdownItem}>
                                        <Link className={styles.navLink} onClick={(e) => confirmNavigation(e)}
                                              to={props.pathTwo3}>{props.two3}</Link>
                                    </li>
                                </ul>
                            </li>
                        )}
                        {props.three && (
                            <li className={styles.navItem}>
                                <Link className={styles.navLink} onClick={(e) => confirmNavigation(e)}
                                      to={props.pathThree}>{props.three}</Link>
                            </li>
                        )}
                        {props.four && (
                            <li className={styles.navItem}>
                                <Link className={styles.navLink} onClick={(e) => confirmNavigation(e)}
                                      to={props.pathFour}>{props.four}</Link>
                            </li>
                        )}
                        {props.five && (
                            <li className={styles.navItem}>
                                <Link className={styles.navLink} onClick={(e) => confirmNavigation(e)}
                                      to={props.pathFive}>{props.five}</Link>
                            </li>
                        )}
                        {props.six && (
                            <li className={styles.navItem}>
                                <Link className={styles.navLink} onClick={(e) => confirmNavigation(e)}
                                      to={props.pathSix}>{props.six}</Link>
                            </li>
                        )}
                        {props.logout && (
                            <li className={styles.navItem}>
                                <button className={`${styles.navLink} ${styles.logout}`} onClick={props.logout}>Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
