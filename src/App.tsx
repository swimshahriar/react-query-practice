import { useState } from 'react';
import { useQuery } from 'react-query';
import { client } from './reactQueryClient';

import './App.css';

type FetcherData = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const fetcher = async (url: string): Promise<FetcherData[]> => {
  const res = await fetch(url);

  const data: FetcherData[] = await res.json();
  return data;
};

const postFetcher = async (url: string): Promise<FetcherData> => {
  const res = await fetch(url);

  const data: FetcherData = await res.json();
  return data;
};

type PostProps = {
  postId: number;
  setPostId: any;
};

export const Post = ({ postId, setPostId }: PostProps) => {
  const { data, isLoading } = useQuery(
    ['post', postId],
    () => postFetcher(`https://jsonplaceholder.typicode.com/posts/${postId}`),
    {
      staleTime: 60000,
    }
  );

  if (isLoading) return <h2>Loading...</h2>;

  if (data) {
    return (
      <div className="App">
        <button onClick={() => setPostId(null)}>Go Back</button>
        <p>id: {data.id}</p>
        <h3>title: {data.title}</h3>
        <p>body: {data.body}</p>
      </div>
    );
  }

  return null;
};

function App() {
  const [postId, setPostId] = useState<number | null>(null);
  const { data, isLoading } = useQuery(
    ['posts'],
    () => fetcher('https://jsonplaceholder.typicode.com/posts'),
    {
      staleTime: 120000,
    }
  );

  if (isLoading) return <h2>Loading...</h2>;

  if (postId) {
    return <Post postId={postId} setPostId={setPostId} />;
  }

  return (
    <div className="App">
      <ul>
        {data &&
          data.map((item) => {
            const isCached = client.getQueryData(['post', item.id]);

            return (
              <li key={item.id} onClick={() => setPostId(item.id)}>
                {isCached && `(visited) -`} ({item.id}) - {item.title}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default App;
