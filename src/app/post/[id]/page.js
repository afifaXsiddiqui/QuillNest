'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

import {
  ArrowLeft,
  Sparkles,
  Send,
  Trash2,
  Heart
} from 'lucide-react'

export default function PostDetails({ params }) {
  const resolvedParams = use(params)
  const postId = resolvedParams.id
  const router = useRouter()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [liked, setLiked] = useState(false)

  const [mouse, setMouse] = useState({
    x: 50,
    y: 30
  })

const [likeCount, setLikeCount] = useState(0)

useEffect(() => {
  fetchPost()
  fetchComments()
  checkUserRole()
  fetchLikeData()
}, [postId])

  async function checkUserRole() {
    const {
      data: { session }
    } =
      await supabase.auth.getSession()

    if (!session) return

    const { data } =
      await supabase
        .from('users')
        .select('role')
        .eq(
          'id',
          session.user.id
        )
        .single()

    setUserRole(
      data?.role || ''
    )
  }

  async function fetchPost() {
    const {
      data,
      error
    } =
      await supabase
        .from('posts')
        .select(`
          *,
          users (
            id,
            name,
            avatar_url,
            bio
          )
        `)
        .eq(
          'id',
          postId
        )
        .single()

    if (error) {
      setError(
        error.message
      )
    } else {
      setPost(data)
    }

    setLoading(false)
  }

  async function fetchComments() {
    const { data } =
      await supabase
        .from('comments')
        .select(`
          *,
          users (
            id,
            name,
            avatar_url
          )
        `)
        .eq(
          'post_id',
          postId
        )

    setComments(
      data || []
    )
  }

  async function fetchLikeData() {
    const {
      data: { session }
    } =
      await supabase.auth.getSession()
  
    const { data: likes } =
      await supabase
        .from('likes')
        .select('*')
        .eq(
          'post_id',
          postId
        )
  
    setLikeCount(
      likes?.length || 0
    )
  
    if (!session) return
  
    const userLiked =
      likes?.find(
        (like) =>
          like.user_id ===
          session.user.id
      )
  
    setLiked(
      !!userLiked
    )
  }
  
  async function toggleLike() {
    const {
      data: { session }
    } =
      await supabase.auth.getSession()
  
    if (!session) {
      alert(
        'Please login first'
      )
      return
    }
  
    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq(
          'user_id',
          session.user.id
        )
        .eq(
          'post_id',
          postId
        )
    } else {
      await supabase
        .from('likes')
        .insert([
          {
            user_id:
              session.user.id,
            post_id:
              postId
          }
        ])
    }
  
    fetchLikeData()
  }

  async function handleComment() {
    if (
      !commentText.trim()
    )
      return

    const {
      data: { session }
    } =
      await supabase.auth.getSession()

    if (!session) {
      alert(
        'Please login first'
      )
      return
    }

    await supabase
      .from('comments')
      .insert([
        {
          post_id:
            postId,
          user_id:
            session.user.id,
          comment_text:
            commentText
        }
      ])

    setCommentText('')
    fetchComments()
  }

  async function deleteComment(
    commentId
  ) {
    await supabase
      .from('comments')
      .delete()
      .eq(
        'id',
        commentId
      )

    fetchComments()
  }

  if (loading) {
    return (
<main
  onMouseMove={(e) => {
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100

    setMouse({ x, y })
  }}
  className="relative min-h-screen bg-[#050506] text-white"
>
  <div className="pointer-events-none fixed inset-0">
    
    <div className="absolute inset-0 bg-[#050506]" />

    <div
      className="absolute inset-0 transition-all duration-300"
      style={{
        background: `
          radial-gradient(
            circle at ${mouse.x}% ${mouse.y}%,
            rgba(139,92,246,0.12) 0%,
            rgba(59,130,246,0.08) 18%,
            transparent 38%
          )
        `
      }}
    />

  </div>

  <div className="relative z-10 flex min-h-screen items-center justify-center">
    <p className="text-zinc-300 text-lg">
      Loading story...
    </p>
  </div>
</main>
    )
  }

  if (error) {
    return (
<main
  onMouseMove={(e) => {
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100

    setMouse({ x, y })
  }}
  className="relative min-h-screen bg-[#050506] text-white"
>
  <div className="pointer-events-none fixed inset-0">

    <div className="absolute inset-0 bg-[#050506]" />

    <div
      className="absolute inset-0 transition-all duration-300"
      style={{
        background: `
          radial-gradient(
            circle at ${mouse.x}% ${mouse.y}%,
            rgba(139,92,246,0.10) 0%,
            rgba(59,130,246,0.06) 18%,
            transparent 38%
          )
        `
      }}
    />

  </div>

  <div className="relative z-10 flex min-h-screen items-center justify-center">
    <p className="text-red-300 text-lg">
      {error}
    </p>
  </div>
</main>
    )
  }

  if (!post) {
    return null
  }

  return (
    <main
  onMouseMove={(e) => {
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100

    setMouse({ x, y })
  }}
  className="relative min-h-screen text-white"
>

      {/* Premium Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
{/* Base */}
<div className="absolute inset-0 bg-[#050506]" />

{/* Gradient foundation */}
<div
  className="absolute inset-0"
  style={{
    background: `
      linear-gradient(
        180deg,
        #050506 0%,
        #090911 20%,
        #0d0d18 50%,
        #08080d 100%
      )
    `
  }}
/>

{/* Left aurora */}
<div className="absolute left-[-12%] top-[10%]">
  <div
    className="h-[700px] w-[700px] rounded-full blur-[120px]"
    style={{
      background:
        'radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(99,102,241,0.08) 35%, transparent 70%)'
    }}
  />
</div>

{/* Right aurora */}
<div className="absolute right-[-12%] top-[45%]">
  <div
    className="h-[650px] w-[650px] rounded-full blur-[120px]"
    style={{
      background:
        'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)'
    }}
  />
</div>

{/* Bottom glow */}
<div className="absolute left-[20%] bottom-[-10%]">
  <div
    className="h-[600px] w-[600px] rounded-full blur-[120px]"
    style={{
      background:
        'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)'
    }}
  />
</div>

<div
  className="absolute inset-0 transition-all duration-150"
  style={{
    background: `
      radial-gradient(
        circle at ${mouse.x}% ${mouse.y}%,
        rgba(139,92,246,0.22) 0%,
        rgba(59,130,246,0.08) 18%,
        transparent 38%
      )
    `
  }}
/>

{/* Grain */}
<div className="absolute inset-0 auth-grain opacity-[0.025] mix-blend-overlay" />

</div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-14">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <Link
          href="/"
          className="
  mb-8 inline-flex items-center gap-3
  rounded-2xl
  border border-white/[0.05]
  bg-white/[0.02]
  px-4 py-3
  text-zinc-300
  backdrop-blur-xl
  transition-all duration-300
  hover:border-violet-400/15
  hover:text-white
"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        {/* Cover */}
        {post.image_url && (
          <div className="relative mb-12 overflow-hidden rounded-[36px] border border-white/[0.06] shadow-[0_20px_80px_rgba(0,0,0,0.5)]">

            <img
              src={
                post.image_url
              }
              alt={
                post.title
              }
              className="h-[420px] w-full object-cover"
            />

<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          </div>
        )}

        {/* Author */}
        <div className="mb-8 flex items-start justify-between gap-6">

{/* Author */}
<button
  onClick={() =>
    router.push(
      `/writer/${post.users?.id}`
    )
  }
  className="
    flex items-center gap-4
    transition-all duration-300
    hover:opacity-90
    hover:scale-[1.01]
  "
>

  {post.users?.avatar_url ? (

    <img
      src={post.users.avatar_url}
      alt="Author"
      className="
        h-14 w-14 rounded-full object-cover
        transition-all duration-300
      "
    />

  ) : (

    <div
      className="
        flex h-14 w-14 items-center justify-center
        rounded-full bg-gradient-to-br from-violet-200 to-indigo-300
        font-semibold text-black
      "
    >

      {post.users?.name?.[0] || 'A'}

    </div>

  )}

  <div className="text-left">

    <p className="text-lg font-medium text-[#ece7df]">

      {post.users?.name || 'Writer'}

    </p>

    <p className="text-sm text-zinc-500">

      {new Date(
        post.created_at
      ).toLocaleDateString(
        'en-GB',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }
      )}

    </p>

  </div>

</button>

{/* Like */}
<button
  onClick={toggleLike}
  className="
    mt-2
    flex items-center gap-3
    text-zinc-400
    hover:text-white
    transition-all duration-300
    hover:text-violet-300
  "
>

  <Heart
    size={25}
    className="transition-all duration-300 hover:scale-110"
    fill={
      liked
        ? '#ef4444'
        : 'none'
    }
    stroke={
      liked
        ? '#ef4444'
        : 'currentColor'
    }
  />

  <span className="text-sm">
    {likeCount} readers loved this story
  </span>

</button>

</div>

        {/* Title */}
        <h1 className="mb-8 max-w-4xl text-4xl md:text-6xl lg:text-7xl tracking-[-0.05em]">

          {post.title}

        </h1>

        {/* Summary */}   
        {post.summary && (

          <div className="mb-10">

            <button
              onClick={() =>
                setShowSummary(
                  !showSummary
                )
              }
              className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-violet-200 hover:border-violet-400/20"
            >

              <Sparkles
                size={18}
              />

              Quick Reflection

            </button>

            {showSummary && (

              <div className="mt-4 rounded-3xl border border-white/5 bg-white/[0.03] p-6 text-zinc-300 leading-8">

                {post.summary}

              </div>

            )}

          </div>

        )}

        {/* Body */}
        <div className="mb-20 max-w-3xl whitespace-pre-line text-[18px] md:text-[20px]
leading-[2.3]
tracking-[0.01em] text-zinc-300">

          {post.body}

        </div>

        {/* Comments */}
        <div className="rounded-[36px] border border-white/5 bg-white/[0.03] backdrop-blur-[20px] p-8 shadow-[0_0_80px_rgba(255,255,255,0.02)]">

          <h2 className="mb-6 text-2xl font-semibold">

          Reader Thoughts ({comments.length})

          </h2>

          <textarea
            value={
              commentText
            }
            onChange={(
              e
            ) =>
              setCommentText(
                e.target
                  .value
              )
            }
            rows={4}
            placeholder="Share your thoughts about this story..."
            className="
              mb-5
              w-full
              rounded-3xl
              border border-white/5
              bg-zinc-900
              px-5 py-4
              text-white
              outline-none
            "
          />

          <button
            onClick={
              handleComment
            }
            className="
              mb-8
              flex items-center gap-3
              rounded-2xl
              bg-gradient-to-r from-violet-500 to-indigo-500 text-white
              px-6 py-3
              text-black
            "
          >

            <Send
              size={16}
            />

            Add Comment

          </button>

          <div className="space-y-4">

            {comments.map(
              (
                comment
              ) => (
                <div
                  key={
                    comment.id
                  }
                  className="
                    rounded-3xl
                    border border-white/5
                    bg-black/20
                    p-5
                  "
                >

<div className="mb-4 flex items-center gap-3">

  {comment.users?.avatar_url ? (

    <img
      src={
        comment.users.avatar_url
      }
      alt="Reader"
      className="
        h-11 w-11 rounded-full object-cover
      "
    />

  ) : (

    <div
      className="
        flex h-11 w-11 items-center justify-center
        rounded-full
        bg-gradient-to-br
        from-violet-200
        to-indigo-300
        text-sm font-semibold
        text-black
      "
    >

      {comment.users?.name?.[0] || 'R'}

    </div>

  )}

  <p className="font-medium text-zinc-100">

    {comment.users?.name || 'Reader'}

  </p>

</div>

<p className="text-zinc-300 leading-8">

  {comment.comment_text}

</p>

                  {userRole ===
                    'admin' && (

                    <button
                      onClick={() =>
                        deleteComment(
                          comment.id
                        )
                      }
                      className="
                        mt-4
                        flex items-center gap-2
                        text-red-400
                      "
                    >

                      <Trash2
                        size={
                          15
                        }
                      />

                      Delete

                    </button>

                  )}

                </div>
              )
            )}

          </div>

        </div>
        </div>

      </div>

    </main>
  )
}