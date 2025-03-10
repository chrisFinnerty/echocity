import { Link } from "react-router-dom";

const HomeCard = ({ artistId, artistName, artistImageUrl, events }) => {
    return (
        <div key={artistId} className='Home-favorites-artist-concert'>
            <div className='Home-artist-img-container'>
                <img src={artistImageUrl} alt={`${artistName}'s profile picture`} />
            </div>
            <h3>{artistName}</h3>
            <div className="Home-concerts-list" key={artistId}>
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event.eventId} className="Home-concert-item">
                            <Link to={`/concerts/${event.eventId}`}>
                                <ul>
                                    <li>{event.venueName}</li>
                                    <li>{new Date(event.eventDate).toLocaleDateString()}</li>
                                    <li>{event.city}, {event.state}</li>
                                </ul>
                            </Link>
                        </div>
                    ))
                    
                ) : (
                    <p>No upcoming events for this artist.</p>
                )}
                <Link to={`/artists/${artistId}`}><h5>View all concerts</h5></Link>
            </div>
        </div>
    )
}

export default HomeCard;