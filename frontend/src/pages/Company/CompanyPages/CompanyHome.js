import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../../utils/utils';
import { ToastContainer } from 'react-toastify';
import styles from './CompanyHome.module.css';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

function CompanyHome() {
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
    const handleConcrete = async (e) => {
        e.preventDefault();
        setTimeout(() => { 
            navigate('/company/home/concrete-orders') // (function) سيتم تنفيذها بعد انتهاء الوقت
        }, 500)
    }
    
    // for card
    const handleCement = (e) => {
        e.preventDefault();
        setTimeout(() => { 
            navigate('/company/home/cement-orders') // (function) سيتم تنفيذها بعد انتهاء الوقت
        }, 500)
    }

    const handleWood = (e) => {
        e.preventDefault();
        setTimeout(() => { 
            navigate('/company/home/wood-orders') // (function) سيتم تنفيذها بعد انتهاء الوقت
        }, 500)
    }

    return(
        <section className={styles.companyBody}>
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
            
            <div className={styles.companyHomeContainerCard}>
                {/* First Card */}
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
                    <CardActionArea onClick={handleCement}>
                        <CardMedia
                            className={styles.cementCardMedia}
                            component="img"
                            height="170"
                            image="/images/cement.jpg"
                            alt="Cement Card"
                        />
                        <CardContent className={styles.cardContent}>
                            <Typography gutterBottom variant="h5" component="div">
                                Cement
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Click to start ordering cement for your construction.
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
                    <CardActionArea onClick={handleConcrete}>
                        <CardMedia
                            className={styles.concreteCardMedia}
                            component="img"
                            height="170"
                            image="/images/concrete.jpg"
                            alt="Concrete Card"
                        />
                        <CardContent className={styles.cardContent}>
                            <Typography gutterBottom variant="h5" component="div">
                                Concrete
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Click to start ordering concrete for your construction.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                {/* Third Card */}
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
                    <CardActionArea onClick={handleWood}>
                        <CardMedia
                            className={styles.concreteCardMedia}
                            component="img"
                            height="170"
                            image="/images/wood.png"
                            alt="Concrete Card"
                        />
                        <CardContent className={styles.cardContent}>
                            <Typography gutterBottom variant="h5" component="div">
                                Wood
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Click to start ordering wood for your  <br></br>construction.
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
export default CompanyHome;