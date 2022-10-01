import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import image from './tapped_in_fasho.jpg';

function App() {

    const CLIENT_ID = "d0db6dd1a5ef4b7f8a493a84259ae21c"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "user-top-read"

    const [ token, setToken ] = useState("");
    const [artists, setArtists] = useState([]);
    const [obscure, setObscure] = useState([]);
    const [lowID, setLowID] = useState("");
    const [artistsFound, setArtistsFound] = useState(false);
    const [idFound, setIDFound] = useState(false);
    const [obscureFound, setObscureFound] = useState(false);

    //let lowName = ""; //for debugging
    //let lowID = ""; //for get artist endpoint
    let ignore = false; //don't call useeffect functions when it's true
    //let artistsFound = false;
    //let idFound = false;

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
        //console.log(token);

    }, []);

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
    }

    useEffect(() => {
        if (token){
            const getTopArtists = async () => {
                try {
                    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        params: {
                            limit: 30, 
                            time_range: "short_term"
                        }
                    })
                    //console.log(data);
                    setArtists(data.items);
                    setArtistsFound(true);
                }
                catch {
                    logout(); //logs you out if token expired
                }
            };
            getTopArtists();
            //ignore = true; //JUST FOR NOW, REMOVE WHEN GETOBSCURE ARTIST IS DONE
        }
    }, [token]);

    useEffect(() => {
        if (artistsFound) {
            let lowScore = 101;
            const getLowID = () => {
                //console.log("GET LOW ID called");
                //console.log(artists);
                artists.map(getLowScore); //does this for each item
                function getLowScore(item) {
                    if (item.popularity < lowScore) {
                                lowScore = item.popularity;
                                //console.log(lowScore);
                                //lowName = item.name;
                                setLowID(item.id);
                            }
                        }
                //console.log(lowName);
                //console.log(100 - lowScore); //undrgrnd score
                setIDFound(true);
            };
            getLowID();
        }
    }, [artistsFound, artists]);

    useEffect(() => {
        if (idFound){
            const getObscureArtist = async () => {
                const {data} = await axios.get(`https://api.spotify.com/v1/artists/${lowID}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setObscure(data);
                    setObscureFound(true);
                    //console.log(obscure);
                };
            getObscureArtist();
            //ignore = true;
        }
    }, [idFound, lowID, token]);

    useEffect(() => { //TESTING
        console.log(obscure);

    }, [obscureFound, obscure]);


    const renderObscure = () => {
        if (obscure.length != 0){
        return (

            <div className='headtext'>
                <div className='headimage'>
                    <img src={image} alt="My Top Underground Artist" /> <img/>
                </div>
                <div className='selection' key={obscure.id}>
                    <div className="artistname">
                        {obscure.name}
                    </div>
                    <div className='score'>
                    {100 - obscure.popularity + "%"}  
                    </div>  

                    <div class = 'image-container'>

                        <div className='artistcover'>          
                        {obscure.images.length ? <img className='artistcover' width={"30%"} src={obscure.images[0].url} alt=""/> : <div>No Image</div>}
                        </div> 

                    </div>
                </div>
                {/* <h2>Your Top Artists</h2> */}
            </div>
        )
        }
    }
        

//    const renderArtists = () => {
//         return artists.map(artist => (
//             <div className='selection' key={artist.id}>
//                 <div className="artistname">
//                 {artist.name}
//                 </div>
//                 {100 - artist.popularity}             
//                 {artist.images.length ? <img width={"30%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
//             </div>
//         ))
//     }


    return (
        <div className="App">
            <header className="App-header">
                <h1>monk<span className='smaller'>:underground</span>
                </h1>
                    {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login to Spotify</a>
                    :
                      <button className='logout' onClick={logout}> Logout </button>} 
                    

                        {renderObscure()} 


                        {/* {renderArtists()} */}


            </header>
        </div>
    );
}

export default App; 