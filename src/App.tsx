import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar as páginas migradas
import ProviderProfile from './pages/provider/ProviderProfile';
import ClientProfile from './pages/client/ClientProfile';
import Chat from './pages/shared/Chat';
import AdvancedSearch from './pages/shared/AdvancedSearch';
import AuctionServices from './pages/shared/AuctionServices';

// Importar a página principal (Home)
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        {/* Rota principal */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
        {/* Rotas do Provider */}
        <Route path="/provider/profile" element={<ProviderProfile />} />
        
        {/* Rotas do Client */}
        <Route path="/client/profile" element={<ClientProfile />} />
        <Route path="/profile" element={<ClientProfile />} />
        
        {/* Rotas Compartilhadas */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/search" element={<AdvancedSearch />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/auctions" element={<AuctionServices />} />
        <Route path="/leilao" element={<AuctionServices />} />
        
        {/* Rotas de desenvolvimento/placeholder */}
        <Route path="/back" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/settings" element={<Home />} />
        <Route path="/menu" element={<Home />} />
        <Route path="/preferences" element={<Home />} />
        <Route path="/documents" element={<Home />} />
        <Route path="/reviews" element={<Home />} />
        <Route path="/history" element={<Home />} />
        <Route path="/social/*" element={<Home />} />
        
        {/* Rota 404 - redireciona para home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
