import axios from 'axios';

const API_URL = '/api/admin/ideas/';

const getAllIdeas = () => {
  return axios.get(API_URL);
};

const featureIdea = (ideaId) => {
  return axios.post(`${API_URL}${ideaId}/feature/`);
};

const changeIdeaStatus = (ideaId, status) => {
  return axios.post(`${API_URL}${ideaId}/change_status/`, { status });
};

const addFeedback = (ideaId, feedback_text) => {
  return axios.post(`${API_URL}${ideaId}/add_feedback/`, { feedback_text });
};

const updateLocation = (ideaId, location) => {
  return axios.post(`${API_URL}${ideaId}/update_location/`, { location });
};

const adminIdeaService = {
  getAllIdeas,
  featureIdea,
  changeIdeaStatus,
  addFeedback,
  updateLocation,
};

export default adminIdeaService;
