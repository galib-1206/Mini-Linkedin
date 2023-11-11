import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {useState,useContext,useEffect} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../Editor";
import {UserContext} from "../UserContext";

export default function CreatePost() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  const {setUserInfo,userInfo} = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost/user/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  const username = userInfo?.username;

  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('username',userInfo?.username);
    data.set('file', files[0]);
    ev.preventDefault();
    const response = await fetch('http://localhost/post/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (response) {
      setRedirect(true);
    }
  }



  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form onSubmit={createNewPost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{marginTop:'5px'}}>Create post</button>
    </form>
  );
}