'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const avatars = [
  '/avatars/avatarA.png',
  '/avatars/avatarB.png',
  '/avatars/avatarC.png',
  '/avatars/avatarD.png',
  '/avatars/avatarE.png',
  '/avatars/avatarF.png',
  '/avatars/avatarG.png',
  '/avatars/avatarH.png'
]

export default function ProfilePage() {
  const router =
  useRouter()

  const [role, setRole] =
  useState('author')

  const [loading, setLoading] =
    useState(true)

  const [userId, setUserId] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [name, setName] =
    useState('')

  const [bio, setBio] =
    useState('')

  const [selectedAvatar, setSelectedAvatar] =
    useState('')

  const [message, setMessage] =
    useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)

    const {
      data: { session }
    } =
      await supabase.auth.getSession()

    if (!session) {
      window.location.href =
        '/auth'
      return
    }

    setUserId(
      session.user.id
    )

    setEmail(
      session.user.email
    )

    const {
      data
    } = await supabase
      .from('users')
      .select('*')
      .eq(
        'id',
        session.user.id
      )
      .single()

    if (data) {
      setName(
        data.name ||
          ''
      )

      setBio(
        data.bio ||
          ''
      )

      setSelectedAvatar(
        data.avatar_url ||
          avatars[0]
      )
      setRole(
        data.role ||
        'author'
      )
    }

    setLoading(false)
  }

  async function saveProfile() {
    setMessage('Saving...')
  
    const {
      data: { session }
    } =
      await supabase.auth.getSession()
  
    if (!session) {
      setMessage('Session expired.')
      return
    }
  
    const currentUser =
      session.user
  
    const { error } =
      await supabase
        .from('users')
        .upsert({
          id: currentUser.id,
          email: currentUser.email,
          name: name.trim(),
          bio: bio.trim(),
          avatar_url:
          selectedAvatar,
        
        role
        })
  
    if (error) {
      setMessage(
        error.message
      )
      return
    }
  
    setMessage(
      'Saved successfully.'
    )
  
    setTimeout(() => {
      window.location.href =
        '/'
    }, 800)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#161616] p-8 text-white">
        Loading...
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050506] px-5 py-10 text-white">
<div className="pointer-events-none absolute inset-0 overflow-hidden">

{/* Base */}
<div className="absolute inset-0 bg-gradient-to-b from-[#050506] via-[#111216] to-[#050506]" />

{/* Big left silver glow */}
<div
  className="auth-orb-slow absolute left-[-8%] top-[0%] h-[700px] w-[700px] rounded-full blur-[90px]"
  style={{
    background:
      'radial-gradient(circle, rgba(139,92,246,0.20) 0%, rgba(99,102,241,0.08) 30%, transparent 72%)'
  }}
/>

{/* Right blue steel glow */}
<div
  className="auth-orb-slow-delayed absolute right-[-8%] top-[25%] h-[620px] w-[620px] rounded-full blur-[90px]"
  style={{
    background:
      'radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(51,65,85,0.14) 35%, transparent 72%)'
  }}
/>

{/* Bottom glow */}
<div
  className="auth-orb-slow absolute left-[25%] bottom-[-10%] h-[520px] w-[520px] rounded-full blur-[90px]"
  style={{
    background:
      'radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(39,39,42,0.10) 35%, transparent 72%)'
  }}
/>

{/* Center aura */}
<div
  className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
  style={{
    background:
      'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)'
  }}
/>

</div>

      <div
        className="
          mx-auto max-w-3xl 
          relative z-10
rounded-[32px]
border border-white/[0.08]
bg-zinc-950/40
backdrop-blur-xl
shadow-[0_30px_80px_-18px_rgba(0,0,0,0.85)]
px-10 py-12 md:px-12 md:py-14
        "
      >
<button
  onClick={() =>
    router.replace('/')
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
        {/* Heading */}
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-zinc-100">
          My Profile
        </h1>
        <p className="mb-8 text-zinc-400">
        Build your profile and let readers know your story.
</p>

        {/* Current Avatar */}
        <div className="relative">
  <div className="absolute inset-[-25%] rounded-full bg-violet-500/15 blur-[50px]" />

          <Image
            src={
              selectedAvatar
            }
            alt="Avatar"
            width={130}
            height={130}
            className="
rounded-full
object-cover
ring-4 ring-violet-400/40
shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)]
mb-8 
"
          />

        </div>

        {/* Avatar Options */}
        <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 justify-items-center">

          {avatars.map(
            (
              avatar
            ) => (
              <button
                key={
                  avatar
                }
                onClick={() =>
                  setSelectedAvatar(
                    avatar
                  )
                }
                className={`
                    flex h-[96px] w-[96px]
                    items-center justify-center
                    rounded-full
                    border border-white/5
                    bg-zinc-900/40
                    transition-all duration-300
                    hover:scale-105
                    hover:border-zinc-400/30
                    ${
                      selectedAvatar === avatar
                        ? 'ring-2 ring-violet-400 ring-offset-4 ring-offset-[#050506] scale-105'
                        : ''
                    }
                  `}
              >

                <Image
                  src={
                    avatar
                  }
                  alt="Avatar"
                  width={
                    90
                  }
                  height={
                    90
                  }
                  className="rounded-full object-cover"
                />

              </button>
            )
          )}

        </div>

        {/* Email */}
        <div className="mb-7 ">

          <label className="mb-2 block text-sm font-medium tracking-[-0.01em] text-zinc-200 drop-shadow-[0_0_10px_rgba(139,92,246,0.08)]">
            Email
          </label>
          <div className="mb-8 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />
          <input
            value={
              email
            }
            disabled
            className="
            focus:border-violet-400/25
focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]
transition-all duration-300
              h-[56px]
              w-full
              rounded-2xl
              border border-zinc-700/30
bg-zinc-900/50
backdrop-blur-sm
              px-5
              text-zinc-400
              outline-none
            "
          />

        </div>

        {/* Name */}
        <div className="mb-7">

          <label className="mb-2 block text-sm font-medium tracking-[-0.01em] text-zinc-200">
            Name
          </label>
          <div className="mb-8 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />
          <input
            value={
              name
            }
            onChange={(
              e
            ) =>
              setName(
                e.target
                  .value
              )
            }
            placeholder="Enter your display name"
            className="
            focus:border-violet-400/25
focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]
transition-all duration-300
              h-[56px]
              w-full
              rounded-2xl
              border border-zinc-700/30
bg-zinc-900/50
backdrop-blur-sm
              px-5
              text-white
              outline-none
            "
          />

        </div>

        {/* Bio */}
        <div className="mb-10">

          <label className="mb-2 block text-sm font-medium tracking-[-0.01em] text-zinc-200">
            Bio
          </label>
          <div className="mb-8 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />
          <textarea
            value={bio}
            onChange={(
              e
            ) =>
              setBio(
                e.target
                  .value
              )
            }
            rows={4}
            placeholder="Tell readers a little about yourself..."
            className="
            focus:border-violet-400/25
focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]
transition-all duration-300
              w-full
              rounded-2xl
              border border-zinc-700/30
bg-zinc-900/50
backdrop-blur-sm
              px-5 py-4
              text-white
              outline-none
            "
          />

        </div>

        <div className="mb-10">

<label className="mb-2 block text-sm font-medium text-zinc-200">

How you contribute

</label>

<div className="mb-8 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />

<div
  className="
    relative grid grid-cols-2 gap-1
    rounded-2xl
    border border-white/[0.06]
    bg-black/35
    p-1
    shadow-inner shadow-black/70
  "
>

  <div
    className="
      pointer-events-none absolute bottom-1 top-1
      w-[calc(50%-4px)]
      rounded-xl
      bg-gradient-to-b
      from-violet-600/80
      to-indigo-950/95
      ring-1 ring-zinc-500/20
      transition-transform duration-300
    "
    style={{
      transform:
        role === 'author'
          ? 'translateX(0)'
          : 'translateX(calc(100% + 4px))'
    }}
  />

  <button
    type="button"
    onClick={() =>
      setRole('author')
    }
    className={`
      relative z-[1]
      rounded-xl py-3
      text-sm font-medium
      transition-colors duration-300
      ${
        role === 'author'
          ? 'text-white'
          : 'text-zinc-500 hover:text-zinc-300'
      }
    `}
  >
    Writer
  </button>

  <button
    type="button"
    onClick={() =>
      setRole('viewer')
    }
    className={`
      relative z-[1]
      rounded-xl py-3
      text-sm font-medium
      transition-colors duration-300
      ${
        role === 'viewer'
          ? 'text-white'
          : 'text-zinc-500 hover:text-zinc-300'
      }
    `}
  >
    Reader
  </button>

</div>

</div>

        {/* Save */}
        <div className="flex justify-start pt-2">
        <button
          onClick={
            saveProfile
          }
          className="
          group
          rounded-2xl
          bg-gradient-to-b
          from-violet-950 via-indigo-900 to-slate-900
          px-8 py-4
          font-semibold
          tracking-[-0.01em]
          text-zinc-200
          border border-zinc-600/25
          shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7)]
          transition-all duration-300
          hover:-translate-y-[2px]
          hover:scale-[1.02]
          hover:shadow-[0_0_30px_rgba(139,92,246,0.20)]
          min-w-[180px]
          "
        >
          Update Profile
        </button>
</div>

        {message && (
          <p className="mt-5 text-zinc-400">
            {message}
          </p>
        )}

      </div>

    </main>
  )
}