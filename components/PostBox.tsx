import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { LinkIcon, PhotographIcon } from "@heroicons/react/outline"
import { useForm } from "react-hook-form"
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBCAPSULE } from '../graphql/mutations'
import client from "../apollo-client"
import { GET_SUBCAPSULE_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
    postTitle: string,
    postBody: string,
    postImage: string,
    subcapsule: string
}

const PostBox = () => {
    const { data: session } = useSession()
    const { register, setValue, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)
    const [addPost] = useMutation(ADD_POST)
    const [addSubcapsule] = useMutation(ADD_SUBCAPSULE)


    const onSubmit = handleSubmit(async (formData) => {
        console.log(formData);
        const notification = toast.loading("Creating new post")

        try {
            // Query for the subcapsule topic
            const { data: { getSubcapsuleListByTopic } } = await client.query({
                query: GET_SUBCAPSULE_BY_TOPIC,
                variables: {
                    topic: formData.subcapsule
                }
            })

            const subcapsuleExists = getSubcapsuleListByTopic.length > 0;

            if (!subcapsuleExists) {
                // create subcapsule
                const { data: { insertSubcapsule: newSubcapsule } } = await addSubcapsule({
                    variables: {
                        topic: formData.subcapsule,
                    }
                })

                console.log(formData)
                const image = formData.postImage || ""

                const { data: { insertPost: newPost }, } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subcapsule_id: newSubcapsule.id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    }
                })

                console.log(newPost);

            } else {
                // use existing subcapsule
                console.log(getSubcapsuleListByTopic);

                const image = formData.postImage || ""

                const { data: { insertPost: newPost }, } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subcapsule_id: getSubcapsuleListByTopic[0].id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    }
                })
                console.log("new post addded", newPost)
            }

            // after the post has been added
            setValue("postBody", "")
            setValue("postImage", "")
            setValue("postTitle", "")
            setValue("subcapsule", "")

            toast.success("New post created", {
                id: notification
            })

        } catch (error) {
            toast.error("Whoops something went wrong! ", {
                id: notification
            })
        }

    })

    return (
        <form onSubmit={ onSubmit } className="sticky top-16 z-50 bg-white border rounded-md border-gray-300 p-2" >
            <div className="flex items-center space-x-3">
                <Avatar />

                <input
                    { ...register("postTitle", { required: true }) }
                    disabled={ !session }
                    className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
                    type="text" placeholder={ session ? "Create a post by entering a title!" : "Sign In to post." } />

                <PhotographIcon onClick={ () => setImageBoxOpen(!imageBoxOpen) } className={ `h-6 text-gray-300 cursor-pointer ${imageBoxOpen && "text-blue-300"}` } />
                <LinkIcon className="h-6 text-gray-300" />
            </div>

            { !!watch("postTitle") && (
                <div className="flex flex-col py-2">
                    <div className="flex items-center px-2">
                        <p className="min-w-[90px]">Body:</p>
                        <input
                            className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                            { ...register("postBody") } type="text" placeholder="Text (optional)" />
                    </div>

                    <div className="flex items-center px-2">
                        <p className="min-w-[90px]">Subcapsule:</p>
                        <input
                            className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                            { ...register("subcapsule", { required: true }) } type="text" placeholder="i.e. reactjs" />
                    </div>

                    { imageBoxOpen && (
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Image URL:</p>
                            <input
                                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                                { ...register("postImage") } type="text" placeholder="url (optional)" />
                        </div>
                    ) }

                    {/* Errors */ }
                    { Object.keys(errors).length > 0 && (
                        <div className="space-y-2 p-2 text-red-500">
                            { errors.postTitle?.type === "required" && (
                                <p>A Post title is required</p>
                            ) }

                            { errors.subcapsule?.type === "required" && (
                                <p>A Post title is required</p>
                            ) }
                        </div>
                    ) }

                    { !!watch("postTitle") && (
                        <button type="submit" className="w-full rounded-full bg-blue-400 p-2 text-white">Create Post</button>
                    ) }


                </div>
            ) }
        </form>
    )
}

export default PostBox