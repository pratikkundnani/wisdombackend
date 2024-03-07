'use strict';
const b2CloudStorage = require('b2-cloud-storage');
const Blog = require("../models/Blog");
const User = require("../models/User");
const axios = require('axios');
const fs = require('fs');
require('dotenv').config()
const b2 = new b2CloudStorage({
	auth: {
		accountId: process.env.BACKBLAZE_ACCOUNT_ID, 
		applicationKey: process.env.BACKBLAZE_APP_KEY
	},
});

function fileUpload(filePath, bucketId, fileName, contentType) {
    return new Promise((resolve, reject) => {
        b2.authorize(function(err) {
          if(err){ reject(err); }
          b2.uploadFile(filePath, {
            bucketId: bucketId,
            fileName: fileName,
            contentType: contentType,
            onUploadProgress: function(update){
              console.log(`Progress: ${update.percent}% (${update.bytesDispatched}/${update.bytesTotal}`);
            }
          }, function(err, results) {
              if(err) {
                reject(err);
              } else {
                resolve(results.fileId);
              }
          });
      });
    });
}
function fileDownload(fileId) {
  return new Promise(async (resolve, reject) => {
    await axios.get("https://api.backblazeb2.com/b2api/v3/b2_authorize_account", {
      headers: {
        "Authorization" : 'Basic ' + `${btoa('00576cfdca7de560000000001' + ':' + 'K0050TbY+RUsURdBAx8hk2abJ0MIRBM')}`
      }
    }).then(async (response) => {
      // console.log(response.data.authorizationToken);
      //https://pbs.twimg.com/profile_images/1760011665477861377/_2srkCaq_400x400.jpg
      // "https://f005.backblazeb2.com/b2api/v3/b2_download_file_by_id?fileId=" + fileId
      // {
      //   headers: {
      //     "Authorization" : `${response.data.authorizationToken}`,
      //   }
      // }
      const resp = await axios.get("https://pbs.twimg.com/profile_images/1760011665477861377/_2srkCaq_400x400.jpg", {
        responseType: "arraybuffer"
      }).then((response) => {
        resolve(response);
      })
      .catch((error) => {
        return error;
      });
    }).catch((error) => {
      console.log(error);
      reject(error);
    });
  });
}
function toBase64(buffer) {
  return buffer.toString('base64');
}
const blogController = {
    // Create a new blog post
    createBlog: async (req, res) => {
      try {
        const { title, content, username } = req.body;
        const currentUser = await User.findOne({username:username});
        if (!process.env.BACKBLAZE_BUCKET_ID_IMAGES) {
          console.error('BACKBLAZE_BUCKET_ID is not set');
          return res.status(500).json({ error: 'Internal server error' });
        }
        const imageId = await fileUpload(req.file.path, process.env.BACKBLAZE_BUCKET_ID_IMAGES, req.file.filename, req.file.mimetype)
        const newBlog = new Blog({
          title,
          content,
          userId: currentUser._id,
          img: imageId
        });
        await newBlog.save();
        currentUser.blogs.push(newBlog._id);  
        await currentUser.save();
        var message = 'Blog post created successfully';
        res.status(201).json({ message: message, blog: newBlog });
      } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    downloadImage: async (req, res) => {
      try {
        const imageFileId = req.params.id;
        //4_z47361cef3dbcfaa78dde0516_f112eb6569cb2175d_d20240306_m110806_c005_v0501017_t0006_u01709723286994
        const imageData = await fileDownload(imageFileId); 
        const base64Data = Buffer.from(imageData.data).toString('base64')
        // const base64Image = toBase64(imageData);
        // console.log("BASE64 IMAGE: " + base64Image);
        // console.log(JSON.stringify(imageData));
        // res.setHeader('Content-Type', imageData.headers['content-type']);
        // res.setHeader('Content-Length', imageData.headers['content-length']);
        // console.log(base64Image);

        // Write a function to write the imageData to a file
        // fs.writeFileSync('/Users/pratikkundnani/Desktop/Blog App/test.txt', imageData.data, 'binary');
        // console.log(JSON.stringify(imageData.data.toString('base64')));

        res.writeHead(200, {
          'Content-Type': imageData.headers['content-type'],
          'Content-Length': base64Data.length
        });
        
        res.end(base64Data); 
        // res.status(200).send(imageData); 
      } catch (error) {
        // console.error('Error downloading image:', error);
        console.log(error);
        res.status(500).json({ 'error': `${error}`});
      }
    },
  
    // Get all blog posts
    getAllBlogs: async (req, res) => {
      try {
        console.log("Getting blog posts");
        const blogs = await Blog.find().populate('userId', 'username').populate('comments').populate('likes');
        console.log(blogs);
        res.status(200).json(blogs);
      } catch (error) {
        console.error('', error);
        res.status(500).json({error: 'Error getting blog posts' });
      }
    },
    getAllBlogsByUser: async (req, res) => {
      try {
        const username = req.params.username;
        const user = await User.findOne({username: username});
        if(!user || user.length === 0) {
          return res.status(404).json({message: 'User not found'});
        }
        const blogIds = user.blogs;
        const blogs = await Blog.find({_id: {$in: blogIds}});
        res.status(200).json(blogs);
      }
      catch(error) {
        console.error('Error getting blog posts by user:', error);
        res.status(500).json({error: 'Error getting blog posts by user' });
      }
    },
  
    // Get a single blog post by ID
    getBlogById: async (req, res) => {
      try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId).populate('userId', 'username').populate('comments').populate('likes');
        if (!blog) {
          return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json(blog);
      } catch (error) {
        console.error('Error getting blog post by ID:', error);
        res.status(500).json({ error: 'Error getting blog post by ID:'});
      }
    },
  
    // Update a blog post by ID
    updateBlogById: async (req, res) => {
      try {
        const blogId = req.params.id;
        const { title, content, tags } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, { title, content, tags, updatedAt: Date.now() }, { new: true });
        if (!updatedBlog) {
          return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json({ message: 'Blog post updated successfully', blog: updatedBlog });
      } catch (error) {
        console.error('Error updating blog post by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  
    // Delete a blog post by ID
    deleteBlogById: async (req, res) => {
      try {
        const blogId = req.params.id;
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
          return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json({ message: 'Blog post deleted successfully' });
      } catch (error) {
        console.error('Error deleting blog post by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};
  


module.exports = blogController;
