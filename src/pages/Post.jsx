import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import service from "../appwrite/database";
import { Container, Button } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isAuther = post && userData ? post.userId === userData.$id : false;
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  useEffect(() => {
    if (post && post.featuredImages) {
      const fetchImagePreview = async () => {
        const previewUrl = await service.getFilePreview(post.featuredImages);
        setImagePreviewUrl(previewUrl);
      };
      fetchImagePreview();
    }
  }, [post]);

  useEffect(() => {
    if (slug) {
      service.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  const deletePost = () => {
    service.deletePost(post.$id).then((status) => {
      if (status) {
        service.deleteFile(post.slug);
        navigate("/");
      }
    });
  };
  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          {imagePreviewUrl && (
            <img
              src={imagePreviewUrl}
              alt={post.title}
              className="rounded-xl"
            />
          )}

          {isAuther && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post?.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="mb-4 w-full">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
        <div className="browser-css">{parse(post.content)}</div>
      </Container>
    </div>
  ) : null;
}

export default Post;
