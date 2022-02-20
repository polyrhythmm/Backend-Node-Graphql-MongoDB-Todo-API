const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./server/schema/schema');

const url = `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoPassword}@cluster0.rvrgr.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`;
const port = process.env.PORT || 4000;
//const cors = require('cors');

const app = express();
//app.use(cors);

app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log('listening', port);
    });
  })
  .catch((err) => console.log(err));
