import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setInboxEmails } from '../redux/appSlice'
import api from '../api'

const useGetInboxEmails = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const res = await api.get('api/v1/email/getinbox', {
                    withCredentials: true
                });

                dispatch(setInboxEmails(res.data.emails))

            } catch (error) {
                console.log(error)
            }
        }
        fetchEmails();
    }, []);
}


export default useGetInboxEmails