import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { apiURL } from 'utils/baseurl';
import { UserTypes } from 'types/users.types';

const useSuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<UserTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('Token not found');

        const response = await axios.get(`${apiURL}suggest`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          setSuggestedUsers(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching suggested users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  return { suggestedUsers, isLoading };
};

export default useSuggestedUsers;
