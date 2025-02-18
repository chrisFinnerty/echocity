import { useContext } from 'react';
import Context from '../Context';
import { Link } from 'react-router-dom'
import { Form, Button } from 'reactstrap';
import './Home.css';

const Home = () => {
    const { currentUser } = useContext(Context);
    
    return (
        <div className="Home">
            {currentUser ? 
                <h1>Welcome, {currentUser.username}!</h1>
                :
                <Form>
                    <h1>Login to Echocity!</h1>
                    <Button><Link to='/signup'>Sign Up</Link></Button>
                    <Button><Link to='/login'>Login</Link></Button>
                </Form>
            }
        </div>
        )
}

export default Home;