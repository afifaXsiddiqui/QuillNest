'use client'

import {
  use,
  useEffect,
  useState
} from 'react'

import Link from 'next/link'

import { supabase } from '../../../lib/supabase'

import {
  ArrowLeft,
  BookOpen,
  CalendarDays
} from 'lucide-react'

export default function WriterPage({
  params
}) {
  const resolvedParams =
    use(params)

  const writerId =
    resolvedParams.id

  const [writer, setWriter] =
    useState(null)

  const [posts, setPosts] =
    useState([])

  useEffect(() => {
    fetchWriter()
  }, [])

  async function fetchWriter() {
    const {
      data: writerData
    } =
      await supabase
        .from('users')
        .select('*')
        .eq(
          'id',
          writerId
        )
        .single()

    const {
      data: postData
    } =
      await supabase
        .from('posts')
        .select('*')
        .eq(
          'author_id',
          writerId
        )
        .order(
          'created_at',
          {
            ascending: false
          }
        )

    setWriter(
      writerData
    )

    setPosts(
      postData || []
    )
  }

  const joinedDate =
    writer?.created_at
      ? new Date(
          writer.created_at
        ).toLocaleDateString(
          'en-US',
          {
            month: 'short',
            year: 'numeric'
          }
        )
      : 'Recently'

  if (!writer) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050506] text-zinc-400">

        <div className="absolute inset-0 bg-gradient-to-b from-[#050506] via-[#0d0e12] to-[#050506]" />

        <p className="relative z-10 text-lg">
        Loading profile...
        </p>

      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050506] px-6 py-10 text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-[#050506] via-[#0d0e12] to-[#050506]" />

        <div className="animate-floatSlow absolute left-[-8%] top-[0%]">
          <div
            className="h-[560px] w-[500px] blur-[95px] opacity-90"
            style={{
              borderRadius: '58% 42% 63% 37% / 41% 58% 42% 59%',
              background:
                'radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 72%)'
            }}
          />
        </div>

        <div className="animate-floatSlow2 absolute right-[-8%] top-[20%]">
          <div
            className="h-[520px] w-[470px] blur-[95px] opacity-85"
            style={{
              borderRadius: '39% 61% 44% 56% / 58% 36% 64% 42%',
              background:
                'radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 72%)'
            }}
          />
        </div>

      </div>

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Back */}
        <button
          onClick={() =>
            history.back()
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

          <ArrowLeft size={18} />

          Back

        </button>

        {/* Hero */}
        <div
          className="
            relative mb-14 overflow-hidden
            rounded-[40px]
            border border-violet-400/[0.08]
            bg-white/[0.03]
            p-8 md:p-12
            backdrop-blur-[28px]
          "
        >

          <div className="absolute left-1/2 top-[20%] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[100px]" />

          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-6">

              <div className="relative">

                <div className="absolute inset-[-12px] rounded-full bg-violet-500/10 blur-xl" />

                <div
                  className="
                    relative flex h-24 w-24
                    items-center justify-center
                    overflow-hidden rounded-full
                    bg-gradient-to-br
                    from-violet-200
                    to-indigo-300
                    text-3xl font-semibold
                    text-black
                    ring-2 ring-violet-400/30
                  "
                >

                  {writer.avatar_url ? (

                    <img
                      src={
                        writer.avatar_url
                      }
                      alt="writer"
                      className="
                        h-full w-full object-cover
                      "
                    />

                  ) : (

                    writer.name?.[0] || 'W'

                  )}

                </div>

              </div>

              <div>

                <h1 className="mb-2 text-4xl md:text-5xl font-semibold tracking-[-0.05em]">

                  {writer.name}

                </h1>

                <p className="max-w-xl text-zinc-400 leading-8">

                  {writer.bio || ' '}

                </p>

              </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">

                <div className="mb-2 flex items-center gap-2 text-violet-300">

                  <BookOpen size={16} />

                  <span className="text-sm">
                  Published
                  </span>

                </div>

                <p className="text-2xl font-semibold">

                  {posts.length}

                </p>

              </div>

              <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">

                <div className="mb-2 flex items-center gap-2 text-violet-300">

                  <CalendarDays size={16} />

                  <span className="text-sm">
                    Joined
                  </span>

                </div>

                <p className="text-sm font-medium text-zinc-300">

                  {joinedDate}

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Posts */}
        <div
  className="
    rounded-[40px]
    border border-violet-400/[0.06]
    bg-white/[0.02]
    p-6 md:p-8
    backdrop-blur-[24px]
  "
>

  <div className="mb-8 flex items-center justify-between">

    <h2 className="text-2xl font-semibold tracking-[-0.04em]">

    Stories by this Writer

    </h2>

    <p className="text-sm text-zinc-400">

      {posts.length} stories

    </p>

  </div>

  {posts.length === 0 ? (

<div
  className="
    flex min-h-[260px]
    items-center justify-center
    rounded-[28px]
    border border-white/[0.04]
    bg-white/[0.015]
    text-center
  "
>

  <div>

    <p className="mb-2 text-lg font-medium text-zinc-200">

      No stories yet

    </p>

    <p className="text-sm text-zinc-500">

      This writer hasn't published any stories yet.

    </p>

  </div>

</div>

) : (

<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

  {posts.map(
    (post) => (

      <Link
        key={post.id}
        href={`/post/${post.id}`}
        className="
          group overflow-hidden
          rounded-[26px]
          border border-white/[0.04]
          bg-white/[0.02]
          transition-all duration-300
          hover:-translate-y-1
          hover:border-violet-400/[0.08]
        "
      >

        {post.image_url && (

          <div className="relative overflow-hidden">

            <img
              src={post.image_url}
              alt={post.title}
              className="
                h-[180px]
                w-full
                object-cover
                transition-transform duration-500
                group-hover:scale-[1.02]
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          </div>

        )}

        <div className="p-5">

          <h2 className="mb-2 text-xl font-semibold tracking-[-0.03em] leading-tight">

            {post.title}

          </h2>

          <p className="line-clamp-3 text-sm leading-7 text-zinc-400">

            {post.body}

          </p>

        </div>

      </Link>

    )
  )}

</div>

)}

</div>

      </div>

    </main>
  )
}