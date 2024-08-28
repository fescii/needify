// Import find post by hash and by slug
const {
  findPostByHash
} = require('../../queries').postQueries;

const { actionQueue } = require('../../bull');


/**
 * @controller {get} /p/:slug(:hash) post
 * @name getPost
 * @description This route will render the post page for the app.
 * @returns Page: Renders post page
*/
const getPost = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  try {
    // query the database for the post
    const post = await findPostByHash(param, req?.user?.hash);

    // if there is no post, render the 404 page
    if (!post) {
      return res.status(404).render('404')
    }

    // add the job to the queue
    if (user.hash !== post.author) {
      await actionQueue.add('actionJob', {
        kind: 'view',
        hashes: {
          target: post.hash,
        },
        user: post.author,
        action: 'post',
        value: 1,
      }, { attempts: 3, backoff: 1000, removeOnComplete: true });
    }

    // add tab to the post object
    post.tab = 'replies';

    res.render('pages/post', {
      data: post
    })
  } catch (error) {
    return res.status(500).render('500')
  }
}


// Export all public content controllers
module.exports = {
  getPost
}