import {useLocation, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
function AlbumDetails() {
  const location = useLocation();
  const  album  = location.state?.album;
  const [albumDetails, setAlbumDetails] = useState(null);
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [trackRatings, setTrackRatings] = useState({});
  useEffect(() => {
    async function fetchAlbumDetails() {
      const response = await fetch(`https://itunes.apple.com/lookup?id=${album.collectionId}&entity=song`);
      const data = await response.json();
      setAlbumDetails(data.results);
    }
    if (album) {
        const savedAlbums = JSON.parse(localStorage.getItem('myDiary')) || [];
        const existingAlbum = savedAlbums.find(
            a => a.collectionId === album.collectionId
        );
        if (existingAlbum) {
            setRating(existingAlbum.rating);
            setReview(existingAlbum.review);
            setTrackRatings(existingAlbum.trackRatings || {});
        }else {
            setRating('');
            setReview('');
            setTrackRatings({});
        }
      fetchAlbumDetails();
    }
  }, [album]);
  function saveToDiary() {
    const savedAlbums = JSON.parse(localStorage.getItem('myDiary')) || [];

    const existingAlbum = savedAlbums.find(
        a => a.collectionId === album.collectionId
    );

    const updatedAlbum = savedAlbums.filter(
        a => a.collectionId !== album.collectionId
    );

    updatedAlbum.push({
        collectionId: album.collectionId,
        title: album.collectionName,
        artist: album.artistName,
        cover: album.artworkUrl100,
        rating: rating,
        review: review,
        trackRatings: trackRatings,
        dateAdded: existingAlbum
            ? existingAlbum.dateAdded
            : new Date().toISOString()
    });

    localStorage.setItem('myDiary', JSON.stringify(updatedAlbum));

    alert('Album saved to My Diary!');
  }

  if (!album) {
    return(
        <p>No album selected.</p>
    )
  }

  return (
    <div className="container mt-4">
        <Link to="/" className="btn btn-secondary mb-3">Back to Discover</Link>
        <div className="mt-4">
            <img
                src={album.artworkUrl100.replace('100x100bb.jpg', '300x300bb.jpg')}
                alt={album.collectionName}
            />
            <h1>{album.collectionName}</h1>
            <h3>{album.artistName}</h3>
            <p>Genre: {album.primaryGenreName}</p>
            <p>Release Date: {album.releaseDate}</p>
            <h3>Track List:</h3>
            <ol>
                {albumDetails?.slice(1).map((track) => (
                    <li key={track.trackId} className="track-item">
                        <span>{track.trackName}</span>
                        <input
                            type="text"
                            placeholder="Rate this track (0-100)"
                            value={trackRatings[track.trackId] ?? ''}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0 && value <= 100) {
                                    setTrackRatings(prev => ({
                                        ...prev,
                                        [track.trackId]: value
                                    }));

                                }else if (e.target.value === '') {
                                    setTrackRatings(prev => ({
                                        ...prev,
                                        [track.trackId]: ''
                                    }));
                                }
                            }}
                        />
                    </li>
                ))}
            </ol>
            <h3>Rate this Album:</h3>
            <div className="rating-input">

            <input
                type="text"
                placeholder="Enter rating (0-100)"
                min="0"
                max="100"
                value={rating===0 ? '' : rating}
                onChange={(e) => {
                    const value= Number(e.target.value);
                    if (value >= 0 && value <= 100) {
                        setRating(value);
                    }
                }}
            />
            </div>
            <h2>Your Rating: {rating}</h2>
            <div style={{
                width: '200px', 
                backgroundColor: '#ddd', 
                height: '10px', 
                borderRadius: '10px'
                }}>
                <div style={{
                    width: `${rating}%`, 
                    backgroundColor: rating === '' ? 'transparent' :rating<50 ? 'red' : rating<70 ? 'yellow' : 'green', 
                    height: '100%', 
                    borderRadius: '10px'
                }}></div>
            </div>
            <h3>My Review:</h3>
            <textarea className="review-input"
                placeholder="What do you think about this album?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />
            <button className="save-button" onClick={saveToDiary}>Save to My Diary</button>
        </div>
        <div className="mt-4">
            <Link to="/my-diary" className="btn btn-success">Go to My Diary</Link>
        </div>
    </div>
  );
}
export default AlbumDetails;