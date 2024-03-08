import './App.css';
/**
 * Import necessary components and functions from the Apollo Client library
 * ApolloClient - used to configure the GraphQL client
 * InMemoryCache - normalized data store that for caching data
 * ApolloProvider - React component that provides the Apollo Client access to child components
 */
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom';


import Navbar from './components/Navbar';
/**
 * Initialize an ApolloClient instance
 * uri is graphql endpoint
 * cache to store data locally
 */
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
