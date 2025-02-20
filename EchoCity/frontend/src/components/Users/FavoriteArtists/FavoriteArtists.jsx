import { useState, useContext, useEffect } from 'react';
import Context from '../../Context';
import FavoritesAPI from '../../../api/FavoritesAPI';
import FavoriteArtistsCard from './FavoriteArtistsCard';
import './FavoriteArtists.css';

const FavoriteArtists = () => {
    const { currentUser } = useContext(Context);
    const [favroiteArtists, setFavoriteArtists] = useState([]);

    useEffect(() => {
        async function getAllFavoriteArtists() {
            try{
                const favoriteArtists = await FavoritesAPI.getAllFavoriteArtists(currentUser.id);
                setFavoriteArtists(favoriteArtists);
            } catch(err){
                console.error("Error getting favorite artists", err)
            }
        };

        getAllFavoriteArtists();
    }, [ currentUser ]);

    return (
        <div className='FavoriteArtists'>
            <div className='FavoriteArtists-header'>
                {favroiteArtists.length > 0 ? <h2>Favorite Artists</h2> : (
                    <>
                        <h3>No Favorite Artists Yet!</h3>
                        <h4>Go to the "Discover" page to find your Favorite Artists.</h4>
                    </>
                )}
            </div>
            <div className='FavoriteArtists-container'>
                <div className='FavoriteArtists-details'>
                    {favroiteArtists && favroiteArtists?.map(fa => (
                        <FavoriteArtistsCard 
                            key={fa.artistId}
                            id={fa.artistId}
                            name={fa.artistName}
                            genre={fa.genre}
                            subgenre={fa.subgenre}
                            url={fa.url}
                            imageUrl={fa.imageUrl}
                            currentUser={currentUser}
                            favoriteArtists={favroiteArtists}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FavoriteArtists;