import React, { useEffect, useState } from 'react'
import Email from './Email'
import useGetInboxEmails from '../hooks/useGetInboxEmails'
import useGetSentEmails from '../hooks/useGetSentEmails'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Emails = () => {

  const location = useLocation();//gives current route
  const isInbox = location.pathname === '/';
  const isSent = location.pathname === '/sent';

  if (isInbox) useGetInboxEmails();
  if (isSent) useGetSentEmails();


  const { sentEmails, inboxEmails, searchText } = useSelector(store => store.app)



  const emails = isInbox ? inboxEmails || [] : isSent ? sentEmails || [] : [];



  //we will not disturb original emails state so..make new for filtered
  const [filterEmail, setFilterEmail] = useState([]);//no filter then show all emails..so initially emails

  useEffect(() => {

    
    if (!emails || emails.length === 0) {
      console.log("Emails not available yet");
      return;
    }
    const filteredEmail = emails.filter((email) => {
      return email.subject.toLowerCase().includes(searchText.toLowerCase()) || email.to.toLowerCase().includes(searchText.toLowerCase());
    })
    setFilterEmail(filteredEmail);
  }, [searchText,inboxEmails])//sentEmails nhi laga ra,sent kholke compose karna try???hihihihhaa


  return (
    <div>
      {
        filterEmail.length > 0 ?
          (filterEmail.map((email) => <Email key={email._id} email={email} />))
          :
          (<p className='text-centre text-gray-500'>No emails found</p>)
      }
    </div>
  )
}

export default Emails
