
const testController = (req, res) => {

    if (req.method === "GET") {
        res.json({
    "message": "ServiceHub API is working"
  })
    }

    if (req.method === "POST") {
      const body =req.body;
        res.json({
         receivedData: body
  })
    }

};

module.exports = testController;