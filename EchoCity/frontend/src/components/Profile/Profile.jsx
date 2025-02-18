import { useEffect, useState, useContext } from 'react';
import Context from '../Context';
import { useParams } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import UsersAPI from '../../api/UsersAPI';
import { formatDateMY } from '../../../helpers/formatDate';
import './Profile.css';

const Profile = () => {
    const {id} = useParams();
    const {currentUser} = useContext(Context);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try{
                const res = await UsersAPI.getUserById(id);
                console.log(res);
                setUser(res);
                setIsLoading(false);
            } catch(err){
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        getUser();
    }, [ id ]);


    if(isLoading) return <div>Loading profile...</div>
    if(error) return <div>Sorry, an error occurred: {error}</div>

    return (
        <div className='Profile'>
            <div className='Profile-container'>
                <h2>{user.username}'s Profile</h2>
                <div className='Profile-details'>
                <img src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Concert Image" />
                    <ul>
                        <li>Name: {user.firstName} {user.lastName}</li>
                        <li>Email: {user.email}</li>
                        <li>Location: {user.city} {user.state}</li>
                        <li>Echocity Enjoyer Since {formatDateMY(user.createdAt)}</li>
                    </ul>
                </div>
                    <div className='Profile-btn-container'>
                        {currentUser && 
                            <button onClick={() => navigate(`/users/${id}/edit`)}>Edit</button>
                        }
                    </div>
            </div>
        </div>
    )
};

export default Profile;