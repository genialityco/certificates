import axios from 'axios';

const API_URL = 'https://deveviusapi.geniality.com.co/api';
const TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6ImNlMzcxNzMwZWY4NmViYTI5YTUyMTJkOWI5NmYzNjc1NTA0ZjYyYmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXV0aC1ldml1cyIsImF1ZCI6ImF1dGgtZXZpdXMiLCJhdXRoX3RpbWUiOjE3MjMxNTE3OTEsInVzZXJfaWQiOiJHNzdLb1p2SURCZGxWZ1V0REtPeDA1MElXWTYzIiwic3ViIjoiRzc3S29adklEQmRsVmdVdERLT3gwNTBJV1k2MyIsImlhdCI6MTcyMzI0MDEzOCwiZXhwIjoxNzIzMjQzNzM4LCJlbWFpbCI6ImFjZUBldml1cy5jbyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhY2VAZXZpdXMuY28iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.MrS2DPJe_mPwxmvLbs3ypFqoyVMHkS26tSFDmRMhMjEQad_TyDt52mIpZniUl46A1vZZPzunlZlgWWR38KN0q4_gg5tim_iQVmCdSqu8S8cMKCsEQ5CMKqK4uf0R8oi1r098B2mFMltVxM_BBWh9SGZ45Stm8orx-YSarvZIFzp80qA49Ax0ULM_U8og-EiHS-sYk1uPp2awtnlv1o7szva8g0bqmnBiSc2JEASD4RV3COX7BogCpFTkUSWAEr-UDHIFQh9jazx_511aqCDnkFmTZ9DSANwoubJGryEGPHNsjCaqokkKa8Du4tNmLaZX5crcBAzudNWgf1QzyUQKnA';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const fetchEventUsersData = async (page, pageSize, filters) => {
  const response = await axiosInstance.get('/events/66c50f374954890f9a07c832/eventusers', {
    params: {
      token: TOKEN,
      page,
      pageSize,
      filtered: JSON.stringify(filters),
    },
  });
  return response.data;
};

export const fetchEventProperties = async () => {
  const response = await axiosInstance.get('/events/66c50f374954890f9a07c832/userproperties', {
    params: {
      token: TOKEN,
    },
  });
  return response.data;
};
