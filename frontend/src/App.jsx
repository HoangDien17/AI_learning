import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateProfile from './pages/CreateProfile';
import Profile from './pages/Profile';
import FindMatches from './pages/FindMatches';
import Matches from './pages/Matches';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/find-matches" element={<FindMatches />} />
          <Route path="/matches/:userId" element={<Matches />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
