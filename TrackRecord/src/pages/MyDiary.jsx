import {useState, useEffect} from 'react';
function MyDiary() {
    //store the saved albums in state
    const [savedAlbums, setSavedAlbums] = useState([]);
    //Runs when the mydiary page is loaded 
    useEffect(() => {
        //gets saved albums from localStorage
        const albums = JSON.parse(localStorage.getItem('myDiary')) || [];
        //updates savedAldums state
        setSavedAlbums(albums);
    }, []);
    //deletes an album from mydiary using its collection id
    function deleteAlbum(collectionId) {
        //creates a nre arrat witgout the selected album
        const updatedAlbums = savedAlbums.filter(album => album.collectionId !== collectionId);
        localStorage.setItem('myDiary', JSON.stringify(updatedAlbums));
        setSavedAlbums(updatedAlbums);
    }
    
    return (
        <div className="container mt-4">
            <h1>My Diary</h1>
            //checks wether user has any albums
            {savedAlbums.length === 0 ? (
                <p>No albums saved yet.</p>
            ) : (savedAlbums.map((album) => (//displays card for each album
                <div className="card mb-3" key={album.collectionId}>
                    <div className="card-body">
                        <img
                            src={album.cover}
                            alt={album.title}
                            className="img-fluid"
                        />
                        <h3> {album.title}</h3>
                        <p>{album.artist}</p>
                        <h4>{album.rating}</h4>
                        <div style ={{width: '150px', 
                            height: '10px', 
                            backgroundColor: '#ddd',
                            borderRadius: '10px',}}>  
                            <div style={{
                                width: `${album.rating}%`, 
                                height: '100%', 
                                backgroundColor: album.rating===''? "transparent" : album.rating < 50 ? 'red' : 
                                album.rating <70 ? 'yellow' : 'green',
                                borderRadius: '10px'
                            }}></div>
                        </div>
                        <p>{album.review}</p>
                        <p>Added on {new Date(album.dateAdded).toLocaleDateString()}</p>
                        <button className="btn btn-danger" onClick={() => deleteAlbum(album.collectionId)}>
                            Delete
                        </button>
                    </div>
                </div>
            )))}
        </div>
    );
}
export default MyDiary;