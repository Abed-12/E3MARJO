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

        <section className={'styles.'}>
                <Navbar
                Login= {Login}
                Register={Register}
                />

        <div className={styles.containerImg}>
                <div className={styles.TextContainer}>
                    <img src ="/images/logo.png"  alt="logo"/>
                    <h1 className={styles.H1Card}> E3MARJO</h1>
                    <h4 className='{styles.aboutText'>
                        The construction industry's first end-to-end digital platform to help you work faster and smarter. <br></br>
                        You place and track orders, can see the status of your orders, access records and more.<br></br>
                        E3MARJO is available in the Jordan. Click here to register for access to the platform.
                    </h4>
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={()=>changePath(1)} >Register For E3MARJO </button>
                    <button onClick={()=> changePath(2)}>  Login   </button>
                </div>
            
        </div>
        <div className={styles.container}>
        <Card
                    className={styles.companyHomeCard}
                    sx={{
                        width: {
                            xs: '100%',  // for extra small screens
                            sm: '100%',  // for small screens
                            md: '100%',  // for medium screens
                            lg: '25%'   // for large screens
                        }
                    }}
                >
                       <CardMedia
    className={styles.cementCardMedia}
    component="img"
    height="200" // Adjust height here
    sx={{
        width: {
            xs: '100%', // Full width for small screens
            sm: '100%',
            md: '100%',
            lg: '345px' // Fixed width for larger screens
        }
    }}
/>

                        <CardContent className={styles.cardContent}>
                            <Typography gutterBottom variant="h5" component="div">
                                Cement
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Click to start ordering cement for your construction.
                            </Typography>
                        </CardContent>
                </Card>

                {/* Second Card */}
                <Card
                    sx={{
                        width: {
                            xs: '100%',  // for extra small screens
                            sm: '100%',  // for small screens
                            md: '100%',  // for medium screens
                            lg: '25%'   // for large screens
                        }
                    }}
                >
                    <CardActionArea >
                        <CardMedia
                            className={styles.concreteCardMedia}
                            component="img"
                            height="170"
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

        </div>
        <Footer/>
        </section>
    )
}
export default HomePage;