import { Link } from 'react-router-dom';
import { Form, Button } from 'reactstrap';
import { FaArrowRight } from "react-icons/fa6";
import './WelcomePage.css';

const WelcomePage = () => {
    document.title = "Echocity | Welcome";
    return (
        <div className="WelcomePage">
            <section className='WelcomePage-intro-container'>
                <div className='WelcomePage-intro'>
                    <h1>Discover Alt Rock Concerts & Artists</h1>
                    <h2>Do you call yourself "edgy"? We do, too.</h2>
                    <p>Create an account today to search for the right shows and artists all across the US.</p>
                    <div className='WelcomePage-cta-signup-container'>
                        <Button className='WelcomePage-cta-button'>
                            <Link className='WelcomePage-cta' to='/signup'>Sign Up <FaArrowRight /></Link>
                        </Button>
                        <Button className='WelcomePage-cta-button'>
                            <Link className='WelcomePage-cta' to='/login'>Login <FaArrowRight /></Link>
                        </Button>
                        <div className='WelcomePage-cta-login-container'>
                            <p>Have an account already?</p>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className='WelcomePage-features-container'>
                    <div className='WelcomePage-features-header'>
                        <h3>How Fans Can Use Echocity</h3>
                    </div>
                    <div className='WelcomePage-features-row'>
                        <div className='WelcomePage-features-concerts'>
                            <div className='WelcomePage-features-header'>
                                <h3>Concerts</h3>
                            </div>
                            <p>Enjoy browsing through hundrends of Alternative Rock concerts across the US.</p>
                            <p>You can search for artists and filter by major metropolitan areas, state, artist, and more.</p>
                        </div>
                        <div className='WelcomePage-features-artists'>
                            <div className='WelcomePage-features-header'>
                                <h3>Artists</h3>
                            </div>
                            <p>Favorite all your rock n roll artists so you can stay up-to-date on their tours.</p>
                            <p>Each artist page allows you to add the artist to your profile, track concerts, and view upcoming shows!</p>
                        </div>
                        <div className='WelcomePage-features-tracking'>
                            <div className='WelcomePage-features-header'>
                                <h3>Track Concerts</h3>
                            </div>
                            <p>Mark concerts as Interested so you can keep track of upcoming shows.</p>  
                            <p>Ended up attending a concert? You can mark the concert as Attended, and begin building a history of concerts you can look back on!</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default WelcomePage;