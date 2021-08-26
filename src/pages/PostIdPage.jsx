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
        <div>
            <h1>Page of post ID = {params.id}</h1>
            {isLoading
                ? <Loader/>
                : <div>{post.id} . {post.title}</div>
            }
            <h1>Comments: </h1>
            {isComLoading
                ? <Loader/>
                : <div>
                    {comments.map(c =>
                        <div key={uuidv4()} style={{marginTop: "15px"}}>
                            <h3>{c.name}</h3>
                            <p>{c.body}</p>
                            <p>By {c.email}</p>
                        </div>
                    )

                    }
                </div>
            }
        </div>
    );
};

export default PostIdPage;