import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Header.css";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const handleNavigate = (path: string) => {
        navigate({
            pathname: path,
            search: location.search
        });
    };

    return (
        <header className="app-header">
            <h1>
                <span className="netflix-title">netflix</span>
                <span>roulette</span>
            </h1>
            {
                params.movieId ?
                <button className='back-to-search' onClick={() => handleNavigate("/")}>
                    <svg viewBox="0 0 512 512">
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>
                </button> 
                : <button data-cy="add-movie-button" className="add-movie-button" onClick={() => handleNavigate("/new")}>
                    &#43; Add Movie
                </button>
            }
        </header>
    );
}

export default Header;