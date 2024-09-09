import axios from 'axios';

// const API_URL = 'https://deveviusapi.geniality.com.co/api';
// const API_URL = 'http://127.0.0.1:8000/api';
const API_URL = 'http://localhost:5000/api';
// const API_URL = 'https://back-certificados.vercel.app/api';

const TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6ImNlMzcxNzMwZWY4NmViYTI5YTUyMTJkOWI5NmYzNjc1NTA0ZjYyYmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXV0aC1ldml1cyIsImF1ZCI6ImF1dGgtZXZpdXMiLCJhdXRoX3RpbWUiOjE3MjMxNTE3OTEsInVzZXJfaWQiOiJHNzdLb1p2SURCZGxWZ1V0REtPeDA1MElXWTYzIiwic3ViIjoiRzc3S29adklEQmRsVmdVdERLT3gwNTBJV1k2MyIsImlhdCI6MTcyMzI0MDEzOCwiZXhwIjoxNzIzMjQzNzM4LCJlbWFpbCI6ImFjZUBldml1cy5jbyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhY2VAZXZpdXMuY28iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.MrS2DPJe_mPwxmvLbs3ypFqoyVMHkS26tSFDmRMhMjEQad_TyDt52mIpZniUl46A1vZZPzunlZlgWWR38KN0q4_gg5tim_iQVmCdSqu8S8cMKCsEQ5CMKqK4uf0R8oi1r098B2mFMltVxM_BBWh9SGZ45Stm8orx-YSarvZIFzp80qA49Ax0ULM_U8og-EiHS-sYk1uPp2awtnlv1o7szva8g0bqmnBiSc2JEASD4RV3COX7BogCpFTkUSWAEr-UDHIFQh9jazx_511aqCDnkFmTZ9DSANwoubJGryEGPHNsjCaqokkKa8Du4tNmLaZX5crcBAzudNWgf1QzyUQKnA';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// API para busqueda global
export const fetchFilteredGlobal = async (colection, filters) => {
  try {
    const response = await axiosInstance.get(`/search/${colection}`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered attendees:', error.message);
  }
};

// API para eventos
export const fetchAllsEvents = async () => {
  const response = await axiosInstance.get('/events');
  return response.data;
};

export const fetchEventById = async (eventId) => {
  const response = await axiosInstance.get(`/events/${eventId}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await axiosInstance.post('/events', eventData);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await axiosInstance.delete(`/events/${eventId}`);
  return response.data;
};

// API para certificados
export const createCertificate = async (eventId, elements) => {
  const response = await axiosInstance.post(`/certificates`, { elements, eventId });
  return response.data;
};

export const updateCertificate = async (certificateId, elements) => {
  const response = await axiosInstance.put(`/certificates/${certificateId}`, { elements });
  return response.data;
};

// API para asistentes
export const addAttendee = async (attendeeData) => {
  const response = await axiosInstance.post(`/attendees`, attendeeData);
  return response.data;
};

export const updateAttendee = async (attendeeId, attendeeData) => {
  const response = await axiosInstance.put(`/attendees/${attendeeId}`, attendeeData);
  return response.data;
};

export const deleteAttendee = async (attendeeId) => {
  const response = await axiosInstance.delete(`/attendees/${attendeeId}`);
  return response.data;
};

// no usado
export const fetchEventProperties = async () => {
  const response = await axiosInstance.get('/events/66d22e8b2fbc531777a7a053', {
    params: {
      token: TOKEN,
    },
  });
  return response.data;
};

export const postEventUser = async (userData) => {
  const response = await axiosInstance.post('/eventUsers/createUserAndAddtoEvent/66c50f374954890f9a07c832/', userData);
  return response.data;
};

export const updateEventUser = async (eventId, eventUserId, userData) => {
  const response = await axiosInstance.put(`/events/${eventId}/eventuserscertificate/${eventUserId}`, userData, {
    params: {
      token: TOKEN,
    },
  });
  return response.data;
};

export const deleteEventUser = async (eventId, eventUserId) => {
  const response = await axiosInstance.delete(`/events/${eventId}/eventuserscertificate/${eventUserId}`, {
    params: {
      token: TOKEN,
    },
  });
  return response.data;
};
