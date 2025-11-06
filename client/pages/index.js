import axios from "axios";

const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    // Request to fetch data made via browser/client
    axios.get('/api/users/currentuser').catch((err) => {
        console.log(err.message);
    });
    return <h1>Landing Page</h1>;
};

// Because of difference in enviornment, the request gives error when made via server
// LandingPage.getInitialProps = async () => {
//     const response = await axios.get('/api/users/currentuser');

//     return response.data;
// }

export default LandingPage;