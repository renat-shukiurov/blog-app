import React, {useEffect, useRef, useState} from 'react'
import '../styles/App.css'
import Pagination from "../components/UI/pagination/Pagination";
import PostList from "../components/PostList";
import Loader from "../components/UI/loader/Loader";
import PostFilter from "../components/PostFilter";
import PostForm from "../components/PostForm";
import MyModal from "../components/UI/modal/MyModal";
import MyButton from "../components/UI/button/MyButton";
import {getPagesCount} from "../utils/pages";
import PostService from "../API/PostService";
import {useFetching} from "../hooks/useFetching";
import {usePosts} from "../hooks/usePosts";
import {useObserver} from "../hooks/useObserver";
import MySelect from "../components/UI/select/MySelect";


function Posts() {

    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({sort: '', query: ''});
    const [modal, setModal] = useState(false)
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
    const lastElement = useRef();

    const [fetchPosts, isPostLoading, postError] = useFetching(async (limit, page) => {
        const response = await PostService.getAll(limit, page)
        setPosts([...posts, ...response.data]);
        const totalCount = response.headers['x-total-count'];
        setTotalPages(getPagesCount(totalCount, limit))
    })

    useObserver(lastElement, page < totalPages, isPostLoading, () => {
        setPage(page + 1)
    })

    useEffect(() => {
        fetchPosts(limit, page)
    },  [page, limit])

    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    const changePage = (page) => {
        setPage(page);
    }

    return (
        <div className="App content">

            <MyButton onClick={()=>setModal(true)}>
                Create new post
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>
            <hr style={{margin: '15px 0'}}/>
            <PostFilter filter={filter} setFilter={setFilter}/>
            {postError &&
                <h1>Something went wrong {postError}</h1>
            }
            <span>Items on page: </span>
            <MySelect
                value={limit}
                onChange={value => setLimit(value)}
                options={[
                    {value: 5, name:"5"},
                    {value: 10, name:"10"},
                    {value: 25, name:"25"},
                    {value: -1, name:"All"},
                ]}
            />
            <PostList remove={removePost} title={"List of posts about JS"} posts={sortedAndSearchedPosts}/>
            <div ref={lastElement}/>
            {isPostLoading &&
                <div style={{display: "flex", justifyContent: 'center', marginTop: "20px"}}><Loader/></div>
            }

            {/*<Pagination page={page} changePage={changePage} totalPages={totalPages}/>*/}



        </div>
    );
}

export default Posts;
