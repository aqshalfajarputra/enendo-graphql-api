const express = require('express');
const graphqlHTTP = require('express-graphql');
const models = require('../models')
const bodyParser = require('body-parser');
const { graphqlUploadExpress } = require('graphql-upload');

// Construct a schema, using GraphQL schema language
const {schema} = require('./schema');
// The root provides a resolver function for each API endpoint
const {resolvers} = require('./resolvers');

// const {resolvers} = require('./test');


const app = express();
app.use(bodyParser.json());

//notification midtrans
app.post('/notification_payment', async function(req, res, next) {
  let status = true;
  let message = "Request Success"
  if (req.body.status == '200'){
    const updatePayment = await models.Payment.update({status : req.body.transaction_status},
      { where : { transaction_id : req.body.transaction_id}});
      if (!updatePayment){
          status = false
          message = "Server Request Failed"
    }
    const payment = await models.Payment.findOne({ where:{
      transaction_id : req.body.transaction_id
    }});

    const updateOrder = await models.Order.update({status : "2"},
      { where : { id : payment.order_id}
    });

    if (!updateOrder){
      status = false
      message = "Server Request Failed"
    }
  }

  console.log(req.body)
  let response = {
    status : status,
    message : message
  }
  res.send(response);
});


app.use(
  '/graphql', 
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP((req, res, graphQLParams)=>({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
    context: { 
      models,
      req 
    },

  }))
);

app.use('/assets', express.static('assets'))

app.listen(4001);
console.log('Running a GraphQL API server at http://localhost:4001/graphql');