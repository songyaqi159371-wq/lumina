import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Symbols from './pages/Symbols';
import Practice from './pages/Practice';
import Divination from './pages/Divination';
import { initStorage } from './services/storage';

const App: React.FC = () => {
  
  useEffect(() => {
    // Attempt to persist storage on app launch
    initStorage();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/symbols" element={<Symbols />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/divination" element={<Divination />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;