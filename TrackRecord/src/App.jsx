import {HashRouter, Routes, Route} from 'react-router-dom';
import Discover from './pages/Discover.jsx';
import MyDiary from './pages/MyDiary.jsx';
import AlbumDetails from './pages/AlbumDetails.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/my-diary" element={<MyDiary />} />
        <Route path="/album" element={<AlbumDetails />} />
      </Routes>
    </HashRouter>
  );
}

export default App;