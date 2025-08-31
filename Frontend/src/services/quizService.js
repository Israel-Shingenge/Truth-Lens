import axios from 'axios';

const API_URL = `http://localhost:8000/api`

export const getQuizzes = async () => {
    const response = await axios.get(`${API_URL}/quizzes2/`);
    console.log(`Status Code - ${response.status}. Number of quizzes - ${response.data.length} \n ${response.data}`)
    return response.data;
}