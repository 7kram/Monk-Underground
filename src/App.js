import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

    const CLIENT_ID = "d0db6dd1a5ef4b7f8a493a84259ae21c"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks"
    const SCOPE = "user-top-read"

    const [ token, setToken ] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [artists, setArtists] = useState([]);

    useEffect( () => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token"); //localstorage allows us to store key value pairs even after window is closed

        if (!token && hash) { //token is empty and hash is assigned a value
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]; //& means take everything before the &, [1] means take the second part of the split
            //console.log(token);
            window.location.hash = ""; //make it empty again (WHY?)
            window.localStorage.setItem("token", token);
        }

        setToken(token);

    }, []);

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
    }

    const getTopTracks = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                limit: 10, 
                time_range: "short_term"
            }
        })
        console.log(data);
        setArtists(data.items);
    }

    const searchArtists = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })
        //console.log(data);
        setArtists(data.artists.items);
    }

    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.name}
                {artist.popularity}                
                {artist.images.length ? <img width={"60%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
            </div>
        ))
    }

    return (
        <div className="App">
            <header className="App-header">
            <h1> Spotify React</h1>
                {!token ?
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login to Spotify</a>
                : <button onClick={logout}> Logout </button>} 

                {token ?
                    <form onSubmit={getTopTracks}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                        <button type={"submit"}>tap in, b*tch</button>
                    </form>
                    : <h2>Please login</h2>
                }
                {renderArtists()}

            </header>
        </div>
    );
}

export default App;