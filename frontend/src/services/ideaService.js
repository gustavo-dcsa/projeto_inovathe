import axios from 'axios';

const API_URL = '/api/ideas/'; // I'm using a relative URL, which will be proxied to the backend.

const getFeaturedIdeas = () => {
  // The backend will need to be updated to support this filtering.
  // For now, I'll just fetch all ideas and the frontend will filter them.
  // Later, I will implement the filtering on the backend for efficiency.
  return axios.get(API_URL, {
    params: {
      status: 'approved',
      ordering: '-created_at', // Order by most recent
      // I will add ordering by likes later
      limit: 5
    }
  });
};

const submitIdea = (ideaData) => {
  return axios.post(API_URL, ideaData);
};

const getIdeaById = (ideaId, email) => {
  // The backend needs to be updated to validate the email.
  // For now, we just fetch by ID.
  return axios.get(`${API_URL}${ideaId}/`);
};

const submitNewIdea = (ideaData) => {
  return axios.post(API_URL, ideaData);
};

const ideaService = {
  getFeaturedIdeas,
  submitIdea,
  getIdeaById,
  submitNewIdea,
};

export default ideaService;
