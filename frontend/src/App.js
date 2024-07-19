
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import AddUser from './users/AddUser';
import ViewUser from './users/ViewUser';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import RequestEmail from './pages/RequestEmail';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path='/adduser' element={<AddUser/>}/>
          <Route exact path="/viewuser/login" element={<ViewUser/>} />
          <Route exact path="/viewuser/forgot" element={<ForgotPassword/>} />
          <Route exact path='/viewuser/changePassword' element={<ChangePassword/>} />
          <Route exact path='/viewuser/requestEmail' element={<RequestEmail/>} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
