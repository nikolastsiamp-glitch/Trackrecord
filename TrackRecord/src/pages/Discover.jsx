import {useState, useEffect} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
function Discover() {
//allows navigation to other pages
    const navigate = useNavigate();
    //gets information about the current location, including the state passed from the previous page
    const location = useLocation();
    //state variables to store the search term, albums, saved albums, and loading state
    const [search,setSearch] = useState('');
    const [albums,setAlbums] = useState([]);
    //list of featured albums to display on the Discover page
    const featuredAlbums = ['After Laughter','1989','Black Holes and Revelations','Abbey Road','GNX','Kiitos ei ole kirosana','Demon Days','Back in Black'];
    //load the saved albums from local storage when the component mounts or when the location changes
    const [savedAlbums, setSavedAlbums] = useState([]);
    useEffect(() => {
        const albums = JSON.parse(localStorage.getItem('myDiary')) || [];
        setSavedAlbums(albums);
    }, [location.key]);
    //function to search for albums using the iTunes API based on the search term entered by the user
    async function searchAlbums() {
        setLoading(true);
        //fetch the albums from the iTunes API based on the search term entered by the user
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(search)}&entity=album&limit=20`);
        //convert the response to JSON and set the albums state variable with the results
        const data = await response.json();
        setAlbums(data.results);
        setLoading(false);
    }
    //controls the loading message displayed
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        //fetches the featured albums from the iTunes API 
        async function fetchFeaturedAlbums() {
            setLoading(true);
            const results =[];//array for storing the featured album results
            for (const album of featuredAlbums) {//fetches the album details from the iTunes API for each featured album
                const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(album)}&entity=album&limit=1`);
                const data = await response.json();
                //if the album is found, add it to the results array
                if (data.results.length > 0) {
                    results.push(data.results[0]);
                }
            }//display the featured albums on the Discover page
            setAlbums(results);
            //stops loading message once the featured albums are fetched and displayed
            setLoading(false);
        }
        fetchFeaturedAlbums();//runs when the component mounts or when the location changes to fetch the featured albums from the iTunes API
    }, [location.key]);
    //checks if the user pressed the Enter key in the search input field and triggers the searchAlbums function if they did
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchAlbums();
        }
    };
    
  return (//display the Discover page with a search input field, a button to trigger the search, and a list of featured albums fetched from the iTunes API
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