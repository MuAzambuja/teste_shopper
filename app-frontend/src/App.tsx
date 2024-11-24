import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RequestRide from './pages/RequestRide';
import RideOptions from './pages/RideOptions';
import RideHistory from './pages/RideHistory';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RequestRide />} />
          <Route path="/options" element={<RideOptions />} />
          <Route path="/history" element={<RideHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;