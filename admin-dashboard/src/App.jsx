import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequestsList from './pages/RequestsList';
import SubmitRequest from './pages/SubmitRequest';
import RequestDetail from './pages/RequestDetail';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col" dir="rtl">
        <Header />

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<RequestsList />} />
            <Route path="/submit" element={<SubmitRequest />} />
            <Route path="/request/:id" element={<RequestDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
