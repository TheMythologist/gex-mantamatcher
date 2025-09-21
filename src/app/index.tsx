import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import RootPage from './RootPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={RootPage} />
      </Routes>
    </Router>
  );
}
