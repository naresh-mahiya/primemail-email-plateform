import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'


import Inbox from './components/Inbox'
import Body from './components/Body'
import SendEmail from './components/SendEmail'
import Login from './components/Login'
import SignUp from './components/SignUp'
import {Toaster} from 'react-hot-toast'
import SentBox from './components/SentBox'
import InboxMail from './components/inboxMail'
import SentMail from './components/sentMail'



const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Body />,
    children: [
      {
        path: '/',
        element: <Inbox />
      },
      {
        path: '/sent',
        element: <SentBox />
      },
      {
        path: 'inbox/mail/:id',
        element: <InboxMail />
      },
      {
        path: 'sent/mail/:id',
        element: <SentMail />
      },

    ]

  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  }
])


function App() {

  
  return (

    <div className='bg-[#F8FAFD]'>
     
      <RouterProvider router={appRouter} />
      <div className='absolute w-[30%] bottom-0 right-20 z-10'>
        <SendEmail />
      </div>
      <Toaster/>


    </div>
  )
}

export default App
