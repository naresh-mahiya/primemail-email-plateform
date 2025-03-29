import axios from 'axios'
import { setSentEmails } from '../redux/appSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const useGetSentEmails = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/v1/email/getsent', { withCredentials: true });
                dispatch(setSentEmails(res.data.emails))

            } catch (error) {
                console.log(error)
            }
        }
        fetchEmails();
    }, []);

}

export default useGetSentEmails