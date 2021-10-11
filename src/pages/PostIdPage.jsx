import {useEffect, useState} from "react";
import Loader from "../components/UI/loader/Loader";
import PostService from "../API/PostService";
import {useFetching} from "../hooks/useFetching";
import {useParams} from 'react-router-dom'
import {v4 as uuidv4} from "uuid";

const PostIdPage = () => {
const params = useParams();
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const [fetchPostById, isLoading, error] = useFetching(async (id) => {
        const response = await PostService.getById(id);
        setPost(response.data)
    })
    const [fetchComments, isComLoading, comError] = useFetching(async (id) => {
        const response = await PostService.getComments(id);
        setComments(response.data)
    })

    useEffect(() => {
        fetchPostById(params.id);
        fetchComments(params.id);
    }, [])

    return (
        <div className='post-id content'>
            <h1>{post.title}</h1>
            {isLoading
                ? <Loader/>
                : <>
                    <div className='text-content'>{post.body}</div>
                    <h4>Comments: </h4>
                    {isComLoading
                        ? <Loader/>
                        : <div className='comments'>
                            {comments.map(c =>
                                <div className="comment-block" key={uuidv4()} style={{marginTop: "15px"}}>
                                    <h5>{c.name}</h5>
                                    <p>{c.body}</p>
                                    <p><b>By {c.email}</b></p>
                                </div>
                            )

                            }
                        </div>
                    }
                </>
            }

        </div>
    );
};

export default PostIdPage;