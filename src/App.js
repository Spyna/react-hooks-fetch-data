import React, { Fragment, useState, useEffect,useReducer } from "react";
import axios from "axios";

const dataFetchReducer = (state, action) => {
  //...
};

function useHackerNewsApi(initialSearch, initialData) {
  const [search, setSearch] = useState(initialSearch);
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const result = await axios(`http://hn.algolia.com/api/v1/search?query=${search}`);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [search]);

  return [state, setSearch];
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
