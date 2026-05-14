'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  PenLine
} from 'lucide-react'

import { supabase } from '../../lib/supabase'

export default function CreatePost() {
  const router =
    useRouter()

  const [title, setTitle] =
    useState('')

  const [body, setBody] =
    useState('')

  const [image, setImage] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const [userRole, setUserRole] =
    useState('')

  const [checkingRole, setCheckingRole] =
    useState(true)

  useEffect(() => {
    checkUserRole()
  }, [])

  async function checkUserRole() {
    const {
      data: { session }
    } =
      await supabase.auth.getSession()

    if (!session) {
      setCheckingRole(false)
      return
    }

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

    setCheckingRole(false)
  }

  async function handleCreate() {
    setMessage('')

    if (
      !title.trim() ||
      !body.trim()
    ) {
      setMessage(
        'Please add a title and your story content.'
      )
      return
    }

    const {
      data: { session }
    } =
      await supabase.auth.getSession()

    if (!session) {
      setMessage(
        'Please sign in to publish your story.'
      )
      return
    }

    setLoading(true)

    const summaryResponse =
      await fetch(
        '/api/summary',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body:
            JSON.stringify(
              {
                content:
                  body
              }
            )
        }
      )

    const summaryData =
      await summaryResponse.json()

    const summary =
      summaryData.summary ||
      ''

    const { error } =
      await supabase
        .from('posts')
        .insert([
          {
            title,
            body,
            image_url:
              image,
            summary,
            author_id:
              session.user.id
          }
        ])

    setLoading(false)

    if (error) {
      setMessage(
        error.message
      )
      return
    }

    router.push('/')
  }

  if (checkingRole) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050506] text-zinc-400">
        Preparing your workspace...
      </main>
    )
  }

  if (
    userRole ===
    'viewer'
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050506] text-red-400">
        Only writers can publish stories.
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050506] text-white">

<div className="pointer-events-none absolute inset-0 overflow-hidden">

  {/* Base */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#050506] via-[#0d0e12] to-[#050506]" />

  {/* Blob 1 */}
  <div className="animate-floatSlow absolute left-[-8%] top-[0%]">
    <div
      className="h-[560px] w-[500px] opacity-90 blur-[95px]"
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
      className="h-[520px] w-[470px] opacity-85 blur-[95px]"
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
      className="h-[460px] w-[540px] opacity-80 blur-[95px]"
      style={{
        borderRadius: '62% 38% 47% 53% / 45% 63% 37% 55%',
        background:
          'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(168,85,247,0.06) 35%, transparent 72%)'
      }}
    />
  </div>

  {/* Center haze */}
  <div
    className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[180px]"
    style={{
      background:
        'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)'
    }}
  />

</div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 py-10">

        {/* Back */}
        <button
          onClick={() =>
            router.back()
          }
          className="
          mb-8 flex items-center gap-3
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

          <ArrowLeft
            size={18}
          />

          Back

        </button>

        {/* Main card */}
        <div
          className="
            relative overflow-hidden
            rounded-[38px]
            border border-violet-400/[0.08]
            bg-white/[0.03]
            p-8 md:p-12
            backdrop-blur-[28px]
            shadow-[0_32px_80px_-20px_rgba(0,0,0,0.65)]
          "
        >
          
          <div className="absolute left-1/2 top-[18%] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[100px]" />

          {/* Inner glow */}
          <div className="pointer-events-none absolute inset-0">

            <div className="absolute left-[8%] top-[8%] h-[220px] w-[220px] rounded-full bg-violet-500/8 blur-[90px]" />

            <div className="absolute right-[8%] bottom-[8%] h-[220px] w-[220px] rounded-full bg-indigo-500/8 blur-[90px]" />

          </div>

          <div className="relative z-10">

            {/* Heading */}
            <div className="mb-12">

              <div className="mb-4 flex items-center gap-3">

                <PenLine
                  size={22}
                  className="text-violet-300"
                />

                <h1 className="text-5xl font-semibold text-zinc-100">

                Write Without Limits

                </h1>

              </div>

              <p className="text-lg text-zinc-400">

              Turn your ideas into stories worth sharing.

              </p>

            </div>

            {message && (
              <p className="mb-8 text-red-400">
                {message}
              </p>
            )}

            {/* Form */}
            <div className="space-y-8">

              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Enter your story title..."
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

              <input
                value={image}
                onChange={(e) =>
                  setImage(
                    e.target.value
                  )
                }
                placeholder="Add your cover image URL..."
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
                  setBody(
                    e.target.value
                  )
                }
                rows={14}
                placeholder="Start writing your story..."
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
                onClick={
                  handleCreate
                }
                disabled={
                  loading
                }
                className="
                  rounded-2xl
                  bg-gradient-to-b
                  from-violet-600 to-indigo-700
                  hover:shadow-[0_0_30px_rgba(139,92,246,0.18)]
                  px-8 py-4
                  font-medium
                  text-white
                  transition-all duration-300
                  hover:scale-[1.02]
                "
              >

                {loading
                  ? 'Publishing...'
                  : 'Publish Story'}

              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  )
}