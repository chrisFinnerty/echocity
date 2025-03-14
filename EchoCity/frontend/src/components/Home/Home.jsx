import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Context from '../Context';
import Loader from '../Loader/Loader.jsx';
import HomeCard from './HomeCard.jsx';
import TicketMasterAPI from '../../api/ticketmasterAPI.js';
import FavoritesAPI from '../../api/FavoritesAPI.js';
import './Home.css';

const Home = () => {
    const { currentUser } = useContext(Context);
    const [favoriteArtistsWithEvents, setFavoriteArtistsWithEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    document.title = "Echocity | Home";
    
    useEffect(() => {
        const getData = async () => {
            if(!currentUser) return;

            try{
                setIsLoading(true);
                setError(null);

                const favoriteArtists = await FavoritesAPI.getAllFavoriteArtists(currentUser.id);

                let artistsWithEvents = [];
                if(favoriteArtists.length > 0){
                    const artistPromists = favoriteArtists.map( async(fav) => {
                        try{
                            const artist = await TicketMasterAPI.getArtist(fav.artistId);
                            const events = await TicketMasterAPI.getEventsByArtistId(fav.artistId);

                            return { artist, events };
                        } catch(err){
                            console.error(`Error getting data for artist ${fav.artistId}`, err);
                            return null;
                        }
                    });

                    const artistResults = await Promise.allSettled(artistPromists);
                    artistsWithEvents = artistResults.filter(res => res.status === 'fulfilled' && res.value !== null).map(res => res.value);
                }

                setFavoriteArtistsWithEvents(artistsWithEvents);
            } catch(err){
                setError(err);
                console.error("Error fetching data:", err);
            } finally{
                setIsLoading(false);
            }
        }
        
        getData();
    }, [ currentUser ]);

    const itemsPerPage = 4;
    const totalPages = Math.ceil(favoriteArtistsWithEvents.length / itemsPerPage);
    
    const handlePrev = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
    };

    const displayedArtists = favoriteArtistsWithEvents.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    if(isLoading) return <Loader />;

    if(error) return <div className='error'>Error: {error}</div>;
    
    return (
        <div className="Home" data-testid="home-container">
            <div className="Home-header">
                <h1>Welcome, {currentUser.username}!</h1>
            </div>
            <div className="Home-favorites-concerts-container">
                <div className="Home-favorites-concerts-header">
                    <h3>Upcoming Concerts From Your Favorite Artists</h3>
                    {favoriteArtistsWithEvents.length === 0 ? (
                        <div className="Home-favorites-concerts-info">
                            <p>No artists favorited yet?</p>
                            <p>Head over to the <Link to='/concerts'>Discover</Link> page!</p>
                        </div>
                    ) : null}
                </div>
                <div className="favorites-slider">
                {favoriteArtistsWithEvents.length > itemsPerPage && (
                    <div className="favorites-slider-nav">
                        <button onClick={handlePrev} disabled={currentPage === 0}>Prev
                        ←
                        </button>
                        <button onClick={handleNext} disabled={currentPage >= totalPages - 1}>
                        Next→
                        </button>
                    </div>
                    )}
                    <div className="Home-favorites-concerts-row">
                        {displayedArtists.map(({ artist, events }) => (
                            <HomeCard 
                                key={artist.id}
                                artistId={artist.id}
                                artistName={artist.name}
                                artistImageUrl={artist.imageUrl}
                                events={events}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
  
  export default Home;
  