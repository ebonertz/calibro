process.env["NODE_ENV"] = "development";

var SphereRest = require('sphere-node-sdk').Rest;
var config = require ("../config/config")

var restClient = new SphereRest({
    config: {
        project_key: config.sphere.project_key,
        client_id: config.sphere.client_id,
        client_secret: config.sphere.client_secret
    },
    host: config.sphere.api_host,
    oauth_host: config.sphere.oauth_url,
    user_agent: 'sphere-node-sdk'
});


restClient.POST("/states", {
    "key": "declined",
    "type": "PaymentState",
    "name": {en: "declined"},
    "description": {en:"The processor declined the transaction."}
}, function (err, res, body) {
    if (err) {
        console.log("Error: " + err);
    } else {
        if (res.statusCode !== 201) {
            console.log("Error creating the custom type: Status Code: " + res.statusCode + " Message: "
                + res.body.message)
        } else {
            console.log("State created successfully");
        }
    }
});

restClient.POST("/states", {
    "key": "rejected",
    "type": "PaymentState",
    "name": {en: "rejected"},
    "description": {en:"The gateway rejected the transaction because AVS, CVV, duplicate, or fraud checks failed, or because you have reached the processing limit on your provisional merchant account."}
}, function (err, res, body) {
    if (err) {
        console.log("Error: " + err);
    } else {
        if (res.statusCode !== 201) {
            console.log("Error creating the custom type: Status Code: " + res.statusCode + " Message: "
                + res.body.message)
        } else {
            console.log("State created successfully");
        }
    }
});

restClient.POST("/states", {
    "key": "submitted_for_settlement",
    "type": "PaymentState",
    "name": {en: "submitted for settlement"},
    "description": {en:"The transaction has been submitted for settlement and will be included in the next settlement batch"}
}, function (err, res, body) {
    if (err) {
        console.log("Error: " + err);
    } else {
        if (res.statusCode !== 201) {
            console.log("Error creating the custom type: Status Code: " + res.statusCode + " Message: "
                + res.body.message)
        } else {
            console.log("State created successfully");
        }
    }
});

restClient.POST("/states", {
    "key": "settlement_declined",
    "type": "PaymentState",
    "name": {en: "settlement declined"},
    "description": {en:"The processor declined to settle the sale or refund request, and the result is unsuccessful."}
}, function (err, res, body) {
    if (err) {
        console.log("Error: " + err);
    } else {
        if (res.statusCode !== 201) {
            console.log("Error creating the custom type: Status Code: " + res.statusCode + " Message: "
                + res.body.message)
        } else {
            console.log("State created successfully");
        }
    }
});


restClient.POST("/states", {
    "key": "authorized",
    "type": "PaymentState",
    "name": {en: "authorized"}
}, function (err, res, body) {
    if (err) {
        console.log("Error: " + err);
    } else {
        if (res.statusCode !== 201) {
            console.log("Error creating the custom type: Status Code: " + res.statusCode + " Message: "
                + res.body.message)
        } else {
            console.log("State created successfully");
        }
    }
});

restClient.POST("/states", {
    "key": "captured",
    "type": "PaymentState",
    "name": {en: "captured"}
}, function (err, res, body) {
    if (err) {
        console.log("Error: " + err);
    } else {
        if (res.statusCode !== 201) {
            console.log("Error creating the custom type: Status Code: " + res.statusCode + " Message: "
                + res.body.message)
        } else {
            console.log("State created successfully");
        }
    }
});

restClient.POST("/states", {
    "key": "settled",
    "type": "PaymentState",
    "name": {en: "settled"}
}, function (err, res, body) {
    if (err) {
        console.log("Error: " + err);
    } else {
        if (res.statusCode !== 201) {
            console.log("Error creating the custom type: Status Code: " + res.statusCode + " Message: "
                + res.body.message)
        } else {
            console.log("State created successfully");
        }
    }
});

restClient.POST("/states", {
    "key": "refund",
    "type": "PaymentState",
    "name": {en: "refund"}
}, function (err, res, body) {
    if (err) {
        console.log("Error: " + err);
    } else {
        if (res.statusCode !== 201) {
            console.log("Error creating the custom type: Status Code: " + res.statusCode + " Message: "
                + res.body.message)
        } else {
            console.log("State created successfully");
        }
    }
});

restClient.POST("/states", {
    "key": "void",
    "type": "PaymentState",
    "name": {en: "void"}
}, function (err, res, body) {
    if (err) {
        console.log("Error: " + err);
    } else {
        if (res.statusCode !== 201) {
            console.log("Error creating the custom type: Status Code: " + res.statusCode + " Message: "
                + res.body.message)
        } else {
            console.log("State created successfully");
        }
    }
});

