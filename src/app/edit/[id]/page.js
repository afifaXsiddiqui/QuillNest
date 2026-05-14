'use client'

import {
  use,
  useEffect,
  useState
} from 'react'

import {
  useRouter
} from 'next/navigation'

import { supabase } from '../../../lib/supabase'

import {
  ArrowLeft,
  Save,
  Sparkles
} from 'lucide-react'

export default function EditPost({
  params
}) {
  const resolvedParams =
    use(params)

  const postId =
    resolvedParams.id

    const router =
  useRouter()

  const [title, setTitle] =
    useState('')

  const [body, setBody] =
    useState('')

  const [image, setImage] =
    useState('')

  const [
    allowed,
    setAllowed
  ] = useState(false)

  const [
    checking,
    setChecking
  ] = useState(true)

  const [
    updating,
    setUpdating
  ] = useState(false)

  const [message, setMessage] =
    useState('')

  useEffect(() => {
    checkAccess()
  }, [postId])

  async function checkAccess() {
    const {
      data: { session }
    } =
      await supabase.auth.getSession()

    if (!session) {
      setChecking(false)
      return
    }

    const currentUser =
      session.user

    const {
      data: userData
    } =
      await supabase
        .from('users')
        .select('role')
        .eq(
          'id',
          currentUser.id
        )
        .single()

    const {
      data: postData
    } =
      await supabase
        .from('posts')
        .select('*')
        .eq(
          'id',
          postId
        )
        .single()

    if (!postData) {
      setChecking(false)
      return
    }

    const isOwner =
      postData.author_id ===
      currentUser.id

    const isAdmin =
      userData?.role ===
      'admin'

    if (
      isOwner ||
      isAdmin
    ) {
      setAllowed(true)

      setTitle(
        postData.title || ''
      )

      setBody(
        postData.body || ''
      )

      setImage(
        postData.image_url ||
          ''
      )
    }

    setChecking(false)
  }

  async function handleUpdate() {
    setUpdating(true)

    const { error } =
      await supabase
        .from('posts')
        .update({
          title,
          body,
          image_url:
            image
        })
        .eq(
          'id',
          postId
        )

    setUpdating(false)

    if (error) {
      setMessage(
        error.message
      )
      return
    }

    setMessage(
      'Your story has been updated.'
    )

    setTimeout(() => {
      router.replace('/')
    }, 1200)
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#161616] text-zinc-400">
        Preparing your editor...
      </main>
    )
  }

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#161616] text-red-400">
        You do not have permission to edit this story.
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050506] px-5 py-10 text-white">
  
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
  
        {/* Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050506] via-[#0d0e12] to-[#050506]" />
  
        {/* Blob 1 */}
        <div className="animate-floatSlow absolute left-[-8%] top-[0%]">
          <div
            className="h-[560px] w-[500px] blur-[95px] opacity-90"
            style={{
              borderRadius: '58% 42% 63% 37% / 41% 58% 42% 59%',
              background:
                'radial-gradient(circle, rgba(139,92,246,0.24) 0%, rgba(139,92,246,0.10) 35%, transparent 72%)'
            }}
          />
        </div>
  
        {/* Blob 2 */}
        <div className="animate-floatSlow2 absolute right-[-8%] top-[18%]">
          <div
            className="h-[520px] w-[470px] blur-[95px] opacity-85"
            style={{
              borderRadius: '39% 61% 44% 56% / 58% 36% 64% 42%',
              background:
                'radial-gradient(circle, rgba(59,130,246,0.20) 0%, rgba(59,130,246,0.08) 35%, transparent 72%)'
            }}
          />
        </div>
  
        {/* Blob 3 */}
        <div className="animate-ambientFloat absolute left-[20%] bottom-[-8%]">
          <div
            className="h-[460px] w-[540px] blur-[95px] opacity-80"
            style={{
              borderRadius: '62% 38% 47% 53% / 45% 63% 37% 55%',
              background:
                'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(168,85,247,0.06) 35%, transparent 72%)'
            }}
          />
        </div>
  
      </div>
  
      <div className="relative z-10 mx-auto max-w-3xl">
  
        <button
          onClick={() =>
            router.replace('/')
          }
          className="mb-8 flex items-center gap-3 rounded-2xl
border border-white/[0.05]
bg-white/[0.02]
px-4 py-3
text-zinc-300
backdrop-blur-xl
hover:border-violet-400/15
hover:text-white
transition-all duration-300"
        >
          <ArrowLeft size={18} />
          Back
        </button>
  
        <div
          className="
            relative overflow-hidden
            rounded-[40px]
            border border-violet-400/[0.08]
            bg-white/[0.03]
            p-8 md:p-12
            backdrop-blur-[28px]
            shadow-[0_32px_80px_-20px_rgba(0,0,0,0.65)]
          "
        >
  
          {/* Spotlight */}
          <div className="absolute left-1/2 top-[18%] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-violet-400/12 animate-ambientFloat blur-[100px]" />
  
          {/* Internal glow */}
          <div className="pointer-events-none absolute inset-0">
  
            <div className="absolute left-[8%] top-[8%] h-[220px] w-[220px] rounded-full bg-violet-500/8 blur-[90px]" />
  
            <div className="absolute right-[8%] bottom-[8%] h-[220px] w-[220px] rounded-full bg-indigo-500/8 blur-[90px]" />
  
          </div>
  
          <div className="relative z-10">
  
            <div className="mb-12">
  
              <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl
font-semibold
tracking-[-0.05em]
leading-[1.05] text-zinc-100">
                Refine Your Story
              </h1>
  
              <p className="text-[17px] md:text-[18px]
leading-[1.9]
text-zinc-400
max-w-xl">
                Great stories evolve. Shape every word until it feels right.
              </p>
  
            </div>
  
            {message && (
              <p className="mb-8 text-green-400">
                {message}
              </p>
            )}
  
            <div className="space-y-8">
  
              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Update your story title..."
                className="
                  h-[62px]
                  w-full
                  rounded-2xl
                  border border-zinc-700/35
                  bg-white/[0.025]
                  px-5
                  text-white
                  outline-none
                  transition-all duration-300
                  focus:border-violet-400/20
                  focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]
                "
              />
  
              <input
                value={image}
                onChange={(e) =>
                  setImage(e.target.value)
                }
                placeholder="Update your cover image URL..."
                className="
                  h-[62px]
                  w-full
                  rounded-2xl
                  border border-zinc-700/35
                  bg-zinc-900/40
                  px-5
                  text-white
                  outline-none
                  transition-all duration-300
                  focus:border-violet-400/20
                  focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]
                "
              />
  
              <textarea
                value={body}
                onChange={(e) =>
                  setBody(e.target.value)
                }
                rows={14}
                placeholder="Continue editing your story..."
                className="
                  w-full
                  rounded-3xl
                  border border-zinc-700/35
                  bg-zinc-900/40
                  px-5 py-5
                  text-white
                  leading-8
                  outline-none
                  transition-all duration-300
                  focus:border-violet-400/20
                  focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]
                "
              />
  
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="
                  flex items-center gap-3
                  rounded-2xl
                  bg-gradient-to-b
                  from-violet-600 to-indigo-700
                  px-8 py-4
                  font-medium
                  text-white
                  transition-all duration-300
                  hover:scale-[1.02]
                  hover:shadow-[0_0_30px_rgba(139,92,246,0.18)]
                "
              >
                <Save size={18} />
  
                {updating
                  ? 'Saving...'
                  : 'Save Changes'}
  
              </button>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
  
    </main>
  )
}