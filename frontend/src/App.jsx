import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;