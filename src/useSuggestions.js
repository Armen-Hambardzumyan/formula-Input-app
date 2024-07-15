import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchSuggestions = async (query) => {
  const { data } = await axios.get(`https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?search=${query}`);

  // Filter out duplicate suggestions based on unique IDs
  const uniqueSuggestions = data.reduce((unique, current) => {
    if (!unique.some(item => item.id === current.id)) {
      unique.push(current);
    }
    return unique;
  }, []);

  return uniqueSuggestions;
};

const useSuggestions = (query) => {
  return useQuery({
    queryKey: ['suggestions', query],
    queryFn: () => fetchSuggestions(query),
    enabled: !!query,
  });
};

export default useSuggestions;
