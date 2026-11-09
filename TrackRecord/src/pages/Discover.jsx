import {useState, useEffect} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
function Discover() {
    const navigate = useNavigate();
    const location = useLocation();
    const [search,setSearch] = useState('');
    const [albums,setAlbums] = useState([]);
    const featuredAlbums = ['After Laughter','1989','Black Holes and Revelations','Abbey Road','GNX','Kiitos ei ole kirosana','Demon Days','Back in Black'];
    const [savedAlbums, setSavedAlbums] = useState([]);
    useEffect(() => {
        const albums = JSON.parse(localStorage.getItem('myDiary')) || [];
        setSavedAlbums(albums);
    }, [location.key]);
    async function searchAlbums() {
        setLoading(true);

        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(search)}&entity=album&limit=20`);
        const data = await response.json();
        setAlbums(data.results);
        setLoading(false);
    }
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchFeaturedAlbums() {
            setLoading(true);
            const results =[];
            for (const album of featuredAlbums) {
                const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(album)}&entity=album&limit=1`);
                const data = await response.json();
                if (data.results.length > 0) {
                    results.push(data.results[0]);
                }
            }
            setAlbums(results);
            setLoading(false);
        }
        fetchFeaturedAlbums();
    }, [location.key]);
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchAlbums();
        }
    };
    
  return (
    <div className="container mt-5">
        <div className="discover-header">
            <h1>Discover Music.</h1>
            <p className="discover-subtitle">Explore and find your favorite albums!</p>
        </div>
        <div className="search-container">
            <input
            type="text"
            placeholder="Search for albums..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            />
            <button  onClick={searchAlbums}>
            Search
            </button>
        </div>
        <h2 className="featured-title">Featured Albums</h2>
    
    {loading && <p>Loading...</p>}
    {!loading &&(
    <div className="row">
        {albums.map((album) => {
            const savedAlbum = savedAlbums.find(saved => saved.collectionId === album.collectionId);

            return (
            <div className="col-6 col-md-4 col-lg-3 mb-4" key={album.collectionId}>

                <div className="card h-100" 
                    onClick={() => navigate('/album', { state: { album } })}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src={album.artworkUrl100.replace('100x100bb.jpg', '300x300bb.jpg')}
                        alt={album.collectionName}
                        className="card-img-top"
                    />

                    <div className="card-body">
                        <h6 className="card-title">{album.collectionName}</h6>
                        <p className="card-text">{album.artistName}</p>

                        {savedAlbum && savedAlbum.rating !=='' &&(
                            <div className="album-rating">
                            
                                {savedAlbum.rating}

                            </div>
                        )}
                    </div>
                </div>
            </div>
            );}
        )}
    </div>
    )}

    </div>
  );
}
export default Discover;