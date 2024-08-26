import './App.css';
import { BrowserRouter, Routes, Route, Router, RouterProvider } from 'react-router-dom';
import router from './Router';

function App() {
    return (
      <RouterProvider router={router}/>
    )
}

export default App;
