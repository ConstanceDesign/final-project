import React from 'react';
import '../index.css';
import { useState} from "react";
import { useMutation } from '@apollo/client';
import { ADD_POST} from '../utils/mutations';
import { QUERY_POSTS, QUERY_ME } from '../utils/queries';

  const Postform = () => {
    const [postText, setText] = useState('');
      const [addPost, { error }] = useMutation(ADD_POST, {
        update(cache, { data: { addPost } }) {
          try {
            // update post array's cache
            // could potentially not exist yet, so wrap in a try/catch
            const { posts } = cache.readQuery({ query: QUERY_POSTS});
            cache.writeQuery({
              query: QUERY_POSTS,
              data: { posts: [addPost, ...posts] },
            });
          } catch (e) {
            console.error(e);
          }
    
          // update me object's cache
          const { me } = cache.readQuery({ query: QUERY_ME });
          cache.writeQuery({
            query: QUERY_ME,
            data: { me: { ...me, posts: [...me.posts, addPost] } },
          });
        },
      });
      const handleChange = (event) => {
        const { name, value } = event.target.value;
        setText({...postText, [name]: value });
      };
    
     // submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await addPost({
        variables: { postText },
      });

      // clear form value
      setText('');
      
    } catch (e) {
      console.error(e);
    }
  };

    return (
      
      <div className="create-post">
        <div className="post-container">
          <h1>Post A Good Deed</h1>
          <div className="post-body">
          <form className="post-form" 
          onSubmit={handleSubmit}>
            <h5> Share Your Story :</h5>
            <textarea
              placeholder="Share your story"
              name="post"
              type="post"
              id="post"
              value={postText.post}
              onChange={handleChange}
            ></textarea>
         
          <button className='btn' type='submit'> Submit Post</button>
          </form>

          {error && <div>Post failed</div>}
          </div>
        </div>
        
      </div>
    );
  }
  

export default Postform;