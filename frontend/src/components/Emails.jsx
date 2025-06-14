import React, { useEffect, useState } from 'react'
import Email from './Email'
import useGetInboxEmails from '../hooks/useGetInboxEmails'
import useGetSentEmails from '../hooks/useGetSentEmails'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // Import axios

const Emails = ({ setSelectedEmails, selectedEmails=[], refresh }) => {

  const location = useLocation();//gives current route
  const isInbox = location.pathname === '/';
  const isSent = location.pathname === '/sent';

  if (isInbox) useGetInboxEmails();
  if (isSent) useGetSentEmails();

  // useEffect(() => {
  //   if (isInbox) useGetInboxEmails();
  //   if (isSent) useGetSentEmails();
  // }, [refresh]); // Trigger fetching emails when refresh changes

  const { sentEmails, inboxEmails, searchText } = useSelector(store => store.app)

  const emails = isInbox ? inboxEmails || [] : isSent ? sentEmails || [] : [];

  const [filterEmail, setFilterEmail] = useState([]);//no filter then show all emails..so initially emails

  const toggleEmailSelection = (emailId) => {
    setSelectedEmails(prevSelected =>
      prevSelected.includes(emailId)
        ? prevSelected.filter(id => id !== emailId)
        : [...prevSelected, emailId]
    );
  };



  useEffect(() => {
    if (!emails || emails.length === 0) {
      console.log("Emails not available yet");
      return;
    }
    const filteredEmail = emails.filter((email) => {
      return email.subject.toLowerCase().includes(searchText.toLowerCase()) || email.to.toLowerCase().includes(searchText.toLowerCase());
    })
    setFilterEmail(filteredEmail);
  }, [searchText,inboxEmails])

  return (
    <div>
      {
        filterEmail.length > 0 ?
          (filterEmail.map((email) => <Email key={email._id} email={email} onSelect={toggleEmailSelection} isSelected={selectedEmails.includes(email._id)} />))
          :
          (<p className='text-centre text-gray-500'>No emails found</p>)
      }
    </div>
  )
}

export default Emails
