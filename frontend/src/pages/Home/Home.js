import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

function HomePage ()
{
    const navigate = useNavigate();
    function changePath(c){
        if (c == 2){
            {
                navigate('/company-login');
            }
        }
        if(c == 1) {
            {
                navigate('/company-registration');
            }
        }
    }

    function Login()
    { 
        navigate('/company-login');
    }
function Register()
    { 
        navigate('/company-registration');
    }
    return(

        <section className={styles.homeBody}>
                <Navbar
                Login= {Login}
                Register={Register}
                />

        <div className={styles.containerImg}>
                <div className={styles.TextContainer}>
                    <img className={styles.img} src ="/images/logo.png"  alt="logo"/>
                    <h1 className={styles.homeTitle}> E3MARJO</h1>
                    <h4>
                        The construction industry's first end-to-end digital platform to help you work faster and smarter. <br></br>
                        You place and track orders, can see the status of your orders, access records and more.
                    </h4>
                    <div >
                        E3MARJO is available in the Jordan. Click here to register for access to the platform.
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={()=>changePath(1)} >Register For E3MARJO </button>
                    <button onClick={()=> changePath(2)}>  Login   </button>
                </div>
            
        </div>

        <div>
            <h1 className={styles.homeH1}>ldkjh</h1>
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
                            <CardActionArea>
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
                            <CardActionArea>
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
                    </div>

        <Footer/>
        </section>
    )
}
export default HomePage;