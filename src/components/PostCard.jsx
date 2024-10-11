import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import service from "../appwrite/database.js";

function PostCard({ $id, title, featuredImages }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImagePreview = async () => {
      if (featuredImages) {
        try {
          const previewUrl = await service.getFilePreview(featuredImages);
          setImagePreviewUrl(previewUrl);
        } catch (error) {
          console.error("Error fetching image preview:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); 
      }
    };

    fetchImagePreview();
  }, [featuredImages]);

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          {loading ? (
            <div className="bg-gray-300 h-40 rounded-xl flex items-center justify-center">
              Loading...
            </div> 
          ) : (
            imagePreviewUrl && (
              <img src={imagePreviewUrl} alt={title} className="rounded-xl" />
            )
          )}
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
