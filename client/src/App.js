import {Routes,Route} from 'react-router-dom'
import './App.css';
import Homepage from "./pages/Home";
import { SocketProvider } from './providers/socket';
import { PeerProvider } from './providers/peer';
import Roompage from './pages/Room';

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path='/room/:roomId' element={<Roompage/>}/>
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
