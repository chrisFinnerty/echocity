import { useState } from 'react';
import FavoriteArtists from './FavoriteArtists';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import FavoritesAPI from '../../../api/FavoritesAPI';
import './FavoriteArtistsCard.css';

const FavoriteArtistsCard = ({ id, name, genre, subgenre, url, imageUrl, currentUser, favoriteArtists }) => {
    const isFavorited = favoriteArtists.some(a => a.artistId === id);
    const [favorite, setFavorite] = useState(isFavorited)

    const toggleFavoriteArtist = async () => {
        try{
            if(!favorite){
                await FavoritesAPI.addFavoriteArtist(currentUser.id, id);
                setFavorite(true);
            } else {
                await FavoritesAPI.deleteFavoriteArtist(currentUser.id, id);
                setFavorite(false);
            }
        } catch(err){
            console.error("Toggle Favorite Artist failed", err);
        }
    };

    return (
        <div className='FavoriteArtistsCard'>
            <div className='FavoriteArtistsCard-header'>
                <div className='FavoriteArtistsCard-img-container'>
                    <img className='FavoriteArtistsCard-artist-image' src={imageUrl} alt={`${name}'s Profile Picture`} />
                    <div className='FavoriteArtistsCard-favorite'>
                        {favorite ? <span>Favorited!</span> : <span>Add to Favorites</span>}
                        <button onClick={toggleFavoriteArtist} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            {favorite ? <FaHeart color='red' /> : <FaRegHeart color='red' /> }
                        </button>
                    </div>
                </div>
                <div className='FavoriteArtistsCard-name'>
                    <h2><Link to={`/artists/${id}`}>{name}</Link></h2>
                </div>
                <div className='FavoriteArtistsCard-details'>
                    <p>Genres: {genre.map(genre => genre)}</p>
                    <p>Subgenres: {subgenre.map(subgenre => subgenre)}</p>
                    <p><a href={url}>Ticketmaster Profile</a></p>
                </div>
            </div>
        </div>
    )
}

export default FavoriteArtistsCard;