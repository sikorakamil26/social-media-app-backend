const { db } = require('../util/admin')

exports.getAllPosts = (request, response) =>{
    db
        .collection('post')
        .orderBy('createdAt', 'desc') //ordering the response
        .get()
        .then(data => {
            let posts = [];
            data.forEach(doc => {
                posts.push({
                    postId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return response.json(posts)
        }).catch(err => console.error(err));
}

exports.postOnePost =  (request, response) => {
    const newPost = {
        body: request.body.body,
        userHandle: request.user.handle,
        createdAt: new Date().toISOString()
    };

    db
        .collection('post')
        .add(newPost)
        .then(doc => response.json({message: `document ${doc.id} created successfully`}))
        .catch(err => {
            response.status(500).json({error: 'something went wrong'});
            console.error(err);
        })
}