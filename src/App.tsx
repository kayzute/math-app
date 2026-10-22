import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/AppRoutes';
import './App.css';

export function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
