import { setSentEmails } from '../redux/appSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import api from '../api'


const useGetSentEmails = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const res = await api.get('api/v1/email/getsent', { withCredentials: true });
                dispatch(setSentEmails(res.data.emails))

            } catch (error) {
                console.log(error)
            }
        }
        fetchEmails();
    }, []);

}

export default useGetSentEmails