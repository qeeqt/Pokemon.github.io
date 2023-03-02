import React from "react";
import Card from "./components/Card";
import Pokeinfo from "./components/Pokeinfo";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import './components/style.css'

function App() {
  const [pokeData, setPokeData] = useState([]);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/")
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [pokeDex, setPokeDex] = useState();

  const pokeFun = async () => {
    const res = await axios.get(url);
    setNextUrl(res.data.next);
    setPrevUrl(res.data.previous);
    getPokemon(res.data.results);
  };

  const getPokemon = async (res) => {
    const first12 = res.slice(0, 12);
    const pokemonData = await Promise.all(first12.map(async (item) => {
      const result = await axios.get(item.url);
      return result.data;
    }));
    setPokeData(pokemonData);
  };

  useEffect(() => {
    pokeFun();
  }, [url]);

  return (
    <>
      <div className="container">
        <div className="left-content">
          {pokeData.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <>
              <Card pokemon={pokeData} infoPokemon={poke => setPokeDex(poke)} />
              <div className="btn-group">
                {prevUrl && (
                  <button
                    onClick={() => {
                      setPokeData([]);
                      setUrl(prevUrl);
                    }}
                  >
                    Previous
                  </button>
                )}

                {nextUrl && (
                  <button
                    onClick={() => {
                      setPokeData([]);
                      setUrl(nextUrl);
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        <div className="right-content">
          <Pokeinfo data={pokeDex} />
        </div>
      </div>
    </>
  );
}

export default App;
