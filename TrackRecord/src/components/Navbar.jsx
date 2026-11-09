import {Link} from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    TrackRecord
                </Link>

                <div className="navbar-nav ms-auto">
                    <Link className="nav-link" to="/">
                        Discover
                    </Link>

                    <Link className="nav-link" to="/my-diary">
                        My Diary
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;