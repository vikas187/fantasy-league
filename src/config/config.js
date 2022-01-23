if(process.env.NODE_ENV === 'production') {
    module.exports = {mongourl: "https://fantasy-league-server.herokuapp.com"};
} else {
    module.exports = {mongourl: "http://127.0.0.1:8080"};
}