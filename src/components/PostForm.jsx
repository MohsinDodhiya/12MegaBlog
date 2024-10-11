import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button, Select, Input, RTE } from "./index";
import appwriteService from "../appwrite/database";

// this post data object is get by database
// post.$id === slug
function PostForm({ post }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");


  const { register, handleSubmit, control, getValues, setValue, watch } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });
  const navigate = useNavigate();
  // select state from the authSlise
  const userData = useSelector((state) => state.auth.userData);

  // this submit can user all data like title content slug featuredImage
  const submit = async (data) => {
    // post object data avilable in database then ...
    if (post) {
      // if file means user can submit featuredImage  then first upload img -> data.image[0]
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;
      // second delete database img -> post.featuredImage
      if (file) {
        await appwriteService.deleteFile(post.featuredImages);
      }
      // and finally update all data passed by user
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImages: file ? file.$id : undefined,
      });
      // if post update theb navigate user is post page
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
      // post object data not avilable in database then ...
    } else {
      const file = await appwriteService.uploadFile(data.image[0]);
      // if img are not avilable then..
      if (file) {
        const fileId = file.$id; // img id passby databse
        data.featuredImages = fileId; // assign submit id by databse id
        const dbPost = await appwriteService.createPost({
          // then finally create n new post
          ...data,
          userId: userData.$id, // Ensure userId is correctly assigned
        });

        // if post create then navigate user is post page
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };
  const slugTranform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace multiple hyphens with a single one
    }
    return "";
  }, []);

  useEffect(() => {
    if (post && post.featuredImages) {
      const fetchImagePreview = async () => {
        const previewUrl = await appwriteService.getFilePreview(
          post.featuredImages
        );
        setImagePreviewUrl(previewUrl);
      };
      fetchImagePreview();
    }
  }, [post]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTranform(value.title, { shouldValidate: true }));
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTranform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTranform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          className="mb-4"
          {...register("image", { required: !post })}
        />

        {post && (
          <div className="w-full mb-4 ">
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt={post.title}
                className="rounded-xl"
              />
            )}
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
