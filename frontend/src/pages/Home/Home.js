import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

function HomePage ()
{
    const navigate = useNavigate();

    function handleSupplier(){
        navigate('/supplier-registration');
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
            
            <div className={styles.homeContainer}>
                <div className={styles.homeContent}>
                    <h1 className={styles.homeH1}>Building a Stronger Future with <span>E3MARJO</span></h1>
                    <p className={styles.homeP}>We provide contractors and suppliers with a digital platform that facilitates easy cement and concrete procurement and supply while ensuring top-quality standards and excellent services. Whether you're looking for a reliable supply partner or aiming to expand your business reach, E3MARJO is your trusted choice.</p>
                    <p className={styles.homeP}>E3MARJO is available in the Jordan. Click here to register for access to the platform.</p>
                    <div className={styles.homeButton}>
                        <button className={styles.homeButtonItem} onClick={Register}>Register For E3MARJO </button>
                        <button className={styles.homeButtonItem} onClick={Login}>Login </button>
                    </div>
                </div>
                <div className={styles.homeImageGrid}>
                    <div className={`${styles.homeImageItem} ${styles.homeImage1}`}></div>
                    <div className={`${styles.homeImageItem} ${styles.homeImage2}`}></div>
                    <div className={`${styles.homeImageItem} ${styles.homeImage3}`}></div>
                    <div className={`${styles.homeImageItem} ${styles.homeImage4}`}></div>
                </div>
            </div>

            <div className={styles.homeContainerKey}>
                <h2 className={styles.sectionTitleAlt}>Key Features</h2>
                <div className={styles.featuresContainer}>
                    <div className={styles.featureBox}>
                        <div className={styles.featureFastIcon}></div>
                        <h3 className={styles.featureTitle}>Fast Operations</h3>
                        <p className={styles.featureDescription}>Get your orders quickly and efficiently from trusted suppliers.</p>
                    </div>
                    <div className={styles.featureBox}>
                        <div className={styles.featureEaseIcon}></div>
                        <h3 className={styles.featureTitle}>Ease of Use</h3>
                        <p className={styles.featureDescription}>A convenient platform designed specifically for construction companies and suppliers.</p>
                    </div>
                    <div className={styles.featureBox}>
                        <div className={styles.featureQualityIcon}></div>
                        <h3 className={styles.featureTitle}>Quality Assurance</h3>
                        <p className={styles.featureDescription}>We provide top-quality cement and concrete materials.</p>
                    </div>
                    <div className={styles.featureBox}>
                        <div className={styles.featureCommunicationIcon}></div>
                        <h3 className={styles.featureTitle}>Instant Communication</h3>
                        <p className={styles.featureDescription}>Connect suppliers and contractors in record time.</p>
                    </div>
                </div>
            </div>

            <div className={styles.cardContainer}>
                <h1 className={styles.homeH1}>Register to Access Our Integrated Construction Services</h1>
                <div className={styles.homeContainerCard}>
                    {/* First Card - Supplier Service */}
                    <Card
                        sx={{
                            width: {
                                xs: 250,  
                                sm: 250,  
                                md: 250,  
                                lg: 345   
                            }
                        }}
                    >
                        <CardActionArea onClick={handleSupplier}>
                            <CardMedia
                                className={styles.supplierCardMedia}
                                component="img"
                                height="170"
                                image="/images/supplier.png" 
                                alt="Supplier"
                            />
                            <CardContent className={styles.cardContent}>
                                <Typography gutterBottom variant="h5" component="div">
                                    Become a Supplier of Concrete and Cement
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    As a supplier, you can list your concrete and cement products for sale on our platform. Reach multiple contracting companies in need of high-quality materials.
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    <strong>Register today to start selling and deliver to construction sites promptly.</strong>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    {/* Second Card - Contracting Company Service */}
                    <Card
                        sx={{
                            width: {
                                xs: 250,  
                                sm: 250,  
                                md: 250,  
                                lg: 345   
                            }
                        }}
                    >
                        <CardActionArea onClick={Register}>
                            <CardMedia
                                className={styles.contractingCompanyCardMedia} 
                                component="img"
                                height="170"
                                image="/images/company.jpeg"
                                alt="Contracting Company"
                            />
                            <CardContent className={styles.cardContent}>
                                <Typography gutterBottom variant="h5" component="div">
                                    Join as a Contracting Company
                                </Typography>
                                <Typography variant="body3" sx={{ color: 'text.secondary' }}>
                                    As a contracting company, you can browse multiple suppliers offering concrete and cement for your construction projects. Select the best suppliers to meet your needs.
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    <strong>Register today to gain access to various suppliers and streamline your material purchasing process.</strong>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
            </div>



            <Footer 
                Login= {Login}
                Register={Register}
            />
        </section>
    )
}
export default HomePage;