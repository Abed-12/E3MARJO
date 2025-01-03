import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './NoteCustomOrders.module.css';
import Navbar from '../../../../../components/navbar/Navbar';
import Footer from '../../../../../components/footer/Footer';

function NoteCustomOrders() {

    const navigate = useNavigate();
    
    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/company-login');
        }, 500)
    }

    return(
        <section className={styles.customOrdersBody}>
            <Navbar 
                one="Home"
                pathOne="/company/home"
                two="Orders"
                two1="Under preparing orders"
                pathTwo1="/company/home/under-preparing-orders"
                two2="Pending orders"
                pathTwo2="/company/home/pending-orders"
                two3="Old orders"
                pathTwo3="/company/home/old-orders"
                three="Cement"
                pathThree="/company/home/cement-orders"
                four="Concrete"
                pathFour="/company/home/concrete-orders"
                five="Profile"
                pathFive="/company/home/profile"
                logout={handleLogout}
            />
    <div>
        <div className={styles.noteContainer}>
            <div className={styles.steps}>
                <ol>
                    <li>
                        Select a Supplier
                            <ul>
                                <li>
                                    Choose your preferred supplier from the dropdown menu
                                </li>
                            </ul>
                    </li>
                    <li>
                        Specify the Number of Concrete Pouring Locations(Number of rows):
                        <ul>
                            <li>
                                Enter the total number of concrete pouring locations you need to calculate concrete for. 
                                <br></br>
                                The form will generate the exact number of rows based on your input.
                            </li>
                        </ul>
                    </li>
                    <li>
                        Fill in the Details for Each Concrete Pouring Location(item name):
                        <ul>
                            <li>
                                Item  Name: Enter the name of the location where the concrete will be poured (e.g., foundation, column, slab).
                            </li>
                            <li>
                                Concrete Strength: Select the desired concrete strength from the dropdown menu.
                            </li>
                            <li>
                                Number of Items: Specify the number of concrete pouring locations for each row (up to a maximum of 100).
                            </li>
                            <li>
                                Dimensions: Provide the length, width, and height (in meters) of the area where the concrete will be poured (each dimension can be up to 1000 meters).
                            </li>
                        </ul>
                    </li>
                    <li>
                        Calculate the Quantity and Price
                        <ul>
                            <li>
                                Click the Calculate button to view the following:
                                <ul>
                                    <li>The concrete quantity and price for each row.</li>
                                    <li>The total quantity and total price at the bottom of the form.</li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li>Proceed to Checkout:
                        <ul>
                            <li>Once all details are correct, click the Checkout button to proceed to the bill page and finalize your order.</li>
                        </ul>
                    </li>
                </ol>
            </div>
        </div>



        <button onClick={
            ()=>{
            setTimeout(() => {
            navigate('/company/home/concrete-orders/custom-orders');
        }, 500)}}
        className='{}'
        >

            next
        </button>
    </div>   
            <Footer 
                one="Home"
                pathOne="/company/home"
                two="Orders"
                two1="Under preparing orders"
                pathTwo1="/company/home/under-preparing-orders"
                two2="Pending orders"
                pathTwo2="/company/home/pending-orders"
                two3="Old orders"
                pathTwo3="/company/home/old-orders"
                three="Cement"
                pathThree="/company/home/cement-orders"
                four="Concrete"
                pathFour="/company/home/concrete-orders"
                five="Profile"
                pathFive="/company/home/profile"
                logout={handleLogout}
            />
            <ToastContainer />
        </section>
    );
}

export default NoteCustomOrders;