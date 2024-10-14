import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RedditUserProvider } from './components/providers/UserProvider';
import { SnoowrapProvider } from './components/providers/SnoowrapProvider';
import { ViewContentProvider } from './components/providers/ViewContentProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <SnoowrapProvider>
    <RedditUserProvider>
      <ViewContentProvider>
        <App />
      </ViewContentProvider>
    </RedditUserProvider>
  </SnoowrapProvider>
);
