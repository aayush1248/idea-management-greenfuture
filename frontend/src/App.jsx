import { useState } from 'react'
import SignUpForm from './ui/signup'
import { BrowserRouter as Router, Routes,
  Route, Link } from "react-router-dom";
import LoginPage from './ui/login';
import Dashboard from './ui/dashboard';
import Ideas from './ui/ideasList';
import IdeasConfirm from './ui/ideasConfirm';
import Notifications from './ui/notification';
import 'bootstrap/dist/css/bootstrap.min.css';



 

function App() {
  const [count, setCount] = useState(0)

  const [email, setEmail] = useState('');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [isManager, setIsManager] = useState(false); // Change this based on role
  const [approvedIdeas, setApprovedIdeas] = useState([]);



  const submitIdea = async () => {
    try {
      await axios.post('http://localhost:3001/submit-idea', {
        email,
        ideaTitle,
        ideaDescription,
      });
      alert('Idea submitted successfully');
    } catch (error) {
      console.error(error);
      alert('Error submitting idea');
    }
  };

  const approveIdea = async (index) => {
    try {
      await axios.post('http://localhost:3001/approve-idea', { ideaIndex: index });
      alert('Idea approved');
      setApprovedIdeas([...approvedIdeas, index]);
    } catch (error) {
      console.error(error);
      alert('Error approving idea');
    }
  };


  return (
     
     
    <div>
      <Routes>
        <Route path="/signup"
         element={<SignUpForm />} />
        <Route path="/"
         element={<LoginPage />} />
          <Route path="/dashboard"
         element={<Dashboard />} />
         <Route path="/ideasList"
         element={<Ideas/>} />
          <Route path="/ideasConfirmedList"
         element={<IdeasConfirm/>} />
          <Route path="/notification"
         element={<Notifications/>} />
      </Routes>
    </div>
      

  
    
    
  )
}

export default App
