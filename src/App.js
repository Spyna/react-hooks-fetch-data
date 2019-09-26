import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

function useHackerNewsApi(initialSearch, initialData) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios(`http://hn.algolia.com/api/v1/search?query=${search}`);
        if (!didCancel) {
          setData(result.data);
        }
      } catch (error) {
        if (!didCancel) {
          setIsError(true);
        }
      }
      setIsLoading(false);
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [search]);

  return [{ data, isLoading, isError }, setSearch];
}

function App() {
  const [query, setQuery] = useState("redux");
  const [{ data, isLoading, isError }, doFetch] = useHackerNewsApi("redux", { hits: [] });

  function onSubmit(event) {
    event.preventDefault();
    doFetch(query);
  }

  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <input type="text" value={query} onChange={event => setQuery(event.target.value)} />
        <button type="submit" disabled={isLoading}>
          Search
        </button>
      </form>
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
