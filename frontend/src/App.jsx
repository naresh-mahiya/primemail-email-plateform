import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'


import Inbox from './components/Inbox'
import Body from './components/Body'
import SendEmail from './components/SendEmail'
import Login from './components/Login'
import SignUp from './components/SignUp'
import { Toaster } from 'react-hot-toast'
import SentBox from './components/SentBox'
import InboxMail from './components/inboxMail'
import SentMail from './components/sentMail'
import StarredMail from './components/StarredMail'
import AICompose from './components/AICompose'
import { useState } from 'react'  
import { useEffect } from 'react'




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
      {
        path: 'starred',
        element: <StarredMail />
      },
      {
        path: 'starred/mail/:id',
        element: <StarredMail />
      }
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

  const [showAICompose, setShowAICompose] = useState(false);
  const [aiComposeText, setAiComposeText] = useState('');


  return (

    <div className='bg-[#F8FAFD]'>

      <RouterProvider router={appRouter} />


      {/* AI Compose popup */}
      {showAICompose && (
        <div className="absolute w-[30%] bottom-0 right-[calc(20%+32%)] z-20">
          <AICompose
            onInsert={(text) => {
              setAiComposeText(text);
              setShowAICompose(false);
            }}
            onClose={() => setShowAICompose(false)}
          />
        </div>
      )}

       {/* Compose popup */}
      <div className='absolute w-[30%] bottom-0 right-20 z-10'>
        <SendEmail setShowAICompose={setShowAICompose} aiComposeText={aiComposeText} />
      </div>
      <Toaster />


    </div>
  )
}

export default App
