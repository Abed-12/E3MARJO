import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './ConcreteOrders.module.css';
import Navbar from '../../../../components/navbar/Navbar';
import Footer from '../../../../components/footer/Footer';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

function ConcreteOrders() {

    const navigate = useNavigate();
    
    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/company-login');
        }, 500)
    }

    // for card
    const handleExpressOrders = (e) => {
        e.preventDefault();
        setTimeout(() => { 
            navigate('/company/home/concrete-orders/express-orders') 
        }, 500)
    }

    // for card
    const handleCustomOrders = (e) => {
        e.preventDefault();
        setTimeout(() => { 
            navigate('/company/home/concrete-orders/custom-orders') 
        }, 500)
    }

    return(
        <section className={styles.concreteOrdersBody}>
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

            <div className={styles.concreteOrdersContainerCard}>
                
                {/* First Card */}
                <Card
                    className={styles.concreteOrdersCard}
                    sx={{
                        width: {
                            xs: 250,  // for extra small screens
                            sm: 250,  // for small screens
                            md: 250,  // for medium screens
                            lg: 345   // for large screens
                        }
                    }}
                >
                    <CardActionArea onClick={handleExpressOrders}>
                        <CardMedia
                            className={styles.expressOrdersCardMedia}
                            component="img"
                            height="170"
                        />
                        <CardContent className={styles.cardContent}>
                            <Typography gutterBottom variant="h5" component="div">
                                Express Orders
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Click to start express ordering Concrete for your construction
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                {/* Second Card */}
                <Card
                    sx={{
                        width: {
                            xs: 250,  // for extra small screens
                            sm: 250,  // for small screens
                            md: 250,  // for medium screens
                            lg: 345   // for large screens
                        }
                    }}
                >
                    <CardActionArea onClick={handleCustomOrders}>
                        <CardMedia
                            className={styles.customOrdersCardMedia} 
                            component="img"
                            height="170"
                        />
                        <CardContent className={styles.cardContent}>
                            <Typography gutterBottom variant="h5" component="div">
                                Custom Orders
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Click to start custom ordering Concrete for your construction
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
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

export default ConcreteOrders;