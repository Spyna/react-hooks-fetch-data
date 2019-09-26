import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState("redux");
  const [search, setSearch] = useState("redux");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios(`http://hn.alsgolia.com/api/v1/search?query=${search}`);
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [search]);

  return (
    <Fragment>
      <input type="text" value={query} onChange={event => setQuery(event.target.value)} />
      <button type="button" onClick={() => setSearch(query)} disabled={isLoading}>
        Search
      </button>
      {isLoading && <div className="loading">Loading ...</div>}
      {isError && <div className="error">Something went wrong ...</div>}
      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
export default App;
