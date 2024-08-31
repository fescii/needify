// Import find post by hash and by slug
const {
  findPostByHash
} = require('../../queries').postQueries;

const { viewContent } = require('../../queries').postQueries;


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

    // view the post
    await viewContent(post.hash);

    // add tab to the post object
    post.tab = 'posts';

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