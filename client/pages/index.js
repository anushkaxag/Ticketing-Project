import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
    return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
    // console.log(currentUser);
    // // // Request to fetch data made via browser/client
    // // axios.get('/api/users/currentuser').catch((err) => {
    // //     console.log(err.message);
    // // });
    // return <h1>Landing Page</h1>;
};

// Because of difference in enviornment, the request gives error when made via server
LandingPage.getInitialProps = async (context) => {
    console.log("LANDING PAGE");
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    return data;
    // // console.log(req.headers);
    // if (typeof window === 'undefined') {
    //     // we are on the server!
    //     // requests should be made to http://ingress-nginx-controller
    //     const { data } = await axios.get(
    //         'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
    //         headers: req.headers
    //     }
    //     );
    //     return data;
    // } else {
    //     // we are on the browser!
    //     // requests can be made with base url of ''
    //     const { data } = await axios.get('/api/users/currentuser');
    //     return data;
    // }
    // return {};
}

export default LandingPage;