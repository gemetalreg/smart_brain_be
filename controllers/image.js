const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const handleImage = (req, res, db) => {
    const {id} = req.body;
    db('users')
    .where({id: id})
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'));
}


const handleApiCall = (req, res) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = process.env.PAT_CLARIFAI;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = process.env.USER_ID_CLARIFAI;       
    const APP_ID = 'facedet';

    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
    const IMAGE_URL = req.body.input;

    const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }
    
            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }
    
            // Since we have one input, one output will exist here    
            res.json(response);
        }
    
    );
    }

module.exports = {
    handleImage,
    handleApiCall
}