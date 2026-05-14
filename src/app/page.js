'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '../lib/supabase'

import {
  Menu,
  Home,
  FileText,
  Heart,
  HeartIcon,
  MessageCircle,
  Plus,
  Search,
  LogOut,
  User,
  RefreshCcw,
MoreVertical,
Pencil,
Trash2
} from 'lucide-react'

export default function HomePage() {
  const router =
  useRouter()

  const [showDeleteModal, setShowDeleteModal] =
  useState(false)

const [postToDelete, setPostToDelete] =
  useState(null)

  const [profile, setProfile] =
    useState(null)

  const [showProfileMenu, setShowProfileMenu] =
    useState(false)

  const [posts, setPosts] =
    useState([])

  const [search, setSearch] =
    useState('')

  const [searchInput, setSearchInput] =
    useState('')

  const [sidebarOpen, setSidebarOpen] =
    useState(false)
    const [likedPosts, setLikedPosts] =
    useState([])
  
  const [likeCounts, setLikeCounts] =
    useState({})

    const [commentCounts, setCommentCounts] =
    useState({})

    const [activeSection, setActiveSection] =
  useState('Home')

  const [userRole, setUserRole] =
  useState('')

const [openPostMenu, setOpenPostMenu] =
  useState(null)

  const [
    userCommentedPosts,
    setUserCommentedPosts
  ] = useState([])

    useEffect(() => {
      fetchInitialData()
    }, [search])

    useEffect(() => {
      fetchProfile()
      fetchUserRole()
    }, [])

  async function fetchInitialData() {
    await fetchPosts()
    await fetchLikes()
    await fetchCommentsCount()
    await fetchUserComments()
  }
  
  async function fetchLikes() {
    const {
      data: { session }
    } =
      await supabase.auth.getSession()
  
    if (!session) return
  
    const { data: userLikes } =
      await supabase
        .from('likes')
        .select('post_id')
        .eq(
          'user_id',
          session.user.id
        )
  
    setLikedPosts(
      userLikes?.map(
        (like) =>
          like.post_id
      ) || []
    )
  
    const { data: allLikes } =
      await supabase
        .from('likes')
        .select('post_id')
  
    const counts = {}
  
    allLikes?.forEach(
      (like) => {
        counts[
          like.post_id
        ] =
          (counts[
            like.post_id
          ] || 0) + 1
      }
    )
  
    setLikeCounts(
      counts
    )
  }

  async function fetchCommentsCount() {
    const { data } =
      await supabase
        .from('comments')
        .select('post_id')
  
    const counts = {}
  
    data?.forEach(
      (comment) => {
        counts[
          comment.post_id
        ] =
          (counts[
            comment.post_id
          ] || 0) + 1
      }
    )
  
    setCommentCounts(
      counts
    )
  }
  
  async function fetchUserComments() {
    const {
      data: { session }
    } =
      await supabase.auth.getSession()
  
    if (!session) return
  
    const { data } =
      await supabase
        .from('comments')
        .select('post_id')
        .eq(
          'user_id',
          session.user.id
        )
  
    setUserCommentedPosts(
      data?.map(
        (comment) =>
          comment.post_id
      ) || []
    )
  }

  async function toggleLike(
    postId
  ) {
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
  
    const alreadyLiked =
      likedPosts.includes(
        postId
      )
  
    if (alreadyLiked) {
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
  
    fetchLikes()
  }

  async function deletePost(
    postId
  ) {
    // delete comments first
    await supabase
      .from('comments')
      .delete()
      .eq(
        'post_id',
        postId
      )
  
    // delete likes
    await supabase
      .from('likes')
      .delete()
      .eq(
        'post_id',
        postId
      )
  
    // now delete post
    const { error } =
      await supabase
        .from('posts')
        .delete()
        .eq(
          'id',
          postId
        )
  
    if (!error) {
      fetchInitialData()
    }
  }
  async function fetchProfile() {
    const {
      data: { session }
    } =
      await supabase.auth.getSession()

    if (!session) return

    const { data } =
      await supabase
        .from('users')
        .select('*')
        .eq(
          'id',
          session.user.id
        )
        .single()

    setProfile(data)
  }

  async function fetchUserRole() {
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

  async function fetchPosts() {
    let query = supabase
      .from('posts')
      .select(`
        *,
users!posts_author_id_fkey (
  id,
  name,
  avatar_url,
  bio
)
      `)
      .order('created_at', {
        ascending: false
      })

    if (search.trim()) {
      query = query.or(
        `title.ilike.%${search}%,summary.ilike.%${search}%`
      )
    }

    const { data } =
      await query

    setPosts(data || [])
  }

  function handleSearch() {
    setSearch(searchInput)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href =
      '/auth'
  }

  async function handleSwitchAccount() {
    await supabase.auth.signOut()
    window.location.href =
      '/auth'
  }

  const navItems = [
    
    {
      name: 'Home',
      icon: Home
    },
    {
      name: 'My Blogs',
      icon: FileText
    },
    {
      name: 'Liked',
      icon: Heart
    },
    {
      name: 'Comments',
      icon: MessageCircle
    }
  ]

  const sectionContent = {
    Home: {
      badge: 'FEATURED STORIES',
      title:
        'Discover stories, ideas, and perspectives.'
    },
  
    'My Blogs': {
      badge: 'YOUR STORIES',
      title:
        'Everything you have published.'
    },
  
    Liked: {
      badge: 'LIKED STORIES',
      title:
        'Stories that caught your attention.'
    },
  
    Comments: {
      badge: 'YOUR INTERACTIONS',
      title:
        'Stories where you joined the conversation.'
    }
  }

  function preview(text) {
    if (!text) return ''

    return text.length > 120
      ? text.slice(0, 120) + '...'
      : text
  }

  function canManagePost(
    post
  ) {
    const isOwner =
      profile?.id ===
      post.author_id
  
    const isAdmin =
      userRole ===
      'admin'
  
    return (
      isOwner ||
      isAdmin
    )
  }


  let filteredPosts =
  posts

if (
  activeSection ===
    'My Blogs' &&
  profile
) {
  filteredPosts =
    posts.filter(
      (post) =>
        post.author_id ===
        profile.id
    )
}

if (
  activeSection ===
    'Liked'
) {
  filteredPosts =
    posts.filter(
      (post) =>
        likedPosts.includes(
          post.id
        )
    )
}

if (
  activeSection ===
  'Comments' &&
  profile
) {
  filteredPosts =
    posts.filter(
      (post) =>
        userCommentedPosts.includes(
          post.id
        )
    )
}

const featuredPost =
  filteredPosts[0]

const remainingPosts =
  filteredPosts.slice(1)

  return (
    <main className="relative z-10 flex min-h-screen bg-[#050506] text-white selection:bg-slate-800/40">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

{/* Luxury dark base */}
<div className="absolute inset-0 min-h-full bg-[#040405]" />

{/* Main cinematic layer */}
<div
  className="absolute inset-0 min-h-full"
  style={{
    background: `
      linear-gradient(
        180deg,
        #040405 0%,
        #0b0c11 18%,
        #12141a 40%,
        #0d0e13 68%,
        #040405 100%
      )
    `
  }}
/>

{/* Visible light bloom */}
<div
  className="absolute inset-0 min-h-full"
  style={{
    background: `
      radial-gradient(circle at 12% 20%, rgba(139,92,246,0.14), transparent 22%),
      radial-gradient(circle at 85% 28%, rgba(99,102,241,0.12), transparent 24%),
      radial-gradient(circle at 50% 72%, rgba(59,130,246,0.08), transparent 28%),
      radial-gradient(circle at 22% 92%, rgba(168,85,247,0.08), transparent 22%)
    `
  }}
/>

{/* Left giant orb */}
<div className="absolute -left-[18%] top-[0%] opacity-90">
  <div
    className="h-[1200px] w-[1000px] rounded-full blur-[120px]"
    style={{
      background:
        'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(148,163,184,0.14) 35%, transparent 72%)'
    }}
  />
</div>

{/* Right orb */}
<div className="auth-orb-slow-delayed absolute -right-[15%] top-[28%]">
  <div
    className="h-[1100px] w-[900px] rounded-full blur-[120px]"
    style={{
      background:
        'radial-gradient(circle, rgba(148,163,184,0.20) 0%, rgba(71,85,105,0.12) 35%, transparent 72%)'
    }}
  />
</div>

{/* Bottom cinematic glow */}
<div className="auth-orb-slow absolute left-[15%] bottom-[-10%]">
  <div
    className="h-[1000px] w-[800px] rounded-full blur-[120px]"
    style={{
      background:
        'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(90,90,110,0.08) 35%, transparent 72%)'
    }}
  />
</div>

{/* Center spotlight */}
<div
  className="absolute left-1/2 top-[38%] h-[900px] w-[900px] -translate-x-1/2 rounded-full blur-[100px]"
  style={{
    background:
      'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 72%)'
  }}
/>

<div className="absolute left-[30%] top-[1200px]">
  <div
    className="h-[900px] w-[900px] rounded-full blur-[120px]"
    style={{
      background:
        'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)'
    }}
  />
</div>

</div>

<div className="auth-grain pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay" />

      {/* Sidebar */}
      <aside
  className={`
    relative z-20
    flex-shrink-0
    border-r border-white/[0.06]
    bg-white/[0.03] backdrop-blur-[24px]
    shadow-[inset_1px_0_rgba(255,255,255,0.03)]
    overflow-hidden
    ${
      sidebarOpen
        ? 'w-[250px]'
        : 'w-[96px]'
    }
  `}
  style={{
    transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)'
  }}
>
        <div className="p-6 transition-transform duration-300 ease-out">

          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            className="mb-8"
          >
            <Menu size={28} />
          </button>

          <div className="mb-12 flex items-center gap-4">

            <Image
              src="/icon1.png"
              alt="QuillNest"
              width={48}
              height={48}
              className="rounded-full"
            />

            {sidebarOpen && (
              <div>

<h2
  className="
  brand-text
    text-[1.15rem]
    font-semibold
    tracking-[-0.04em]
    text-zinc-100
    bg-gradient-to-r
    from-zinc-100
    via-zinc-300
    to-zinc-500
    bg-clip-text
    text-transparent
    drop-shadow-[0_0_14px_rgba(255,255,255,0.08)]
  "
>
  QuillNest
</h2>

<p
  className="
    text-[11px]
    font-medium
    tracking-[0.18em]
    text-zinc-500
  "
>
Beyond Words
</p>

              </div>
            )}

          </div>

          <div className="space-y-4">

            {navItems.map(
              (
                item,
                index
              ) => {
                const Icon =
                  item.icon

                return (
<button
  key={
    item.name
  }
  onClick={() =>
    setActiveSection(
      item.name
    )
  }
  className={`
    group
    flex w-full items-center gap-4
    rounded-2xl
    px-4 py-4
    transition-all duration-300
  
    ${
      activeSection === item.name
        ? `
          border-l-2
          border-violet-400
          bg-violet-500/[0.08]
          text-violet-200
          shadow-[0_0_18px_rgba(139,92,246,0.05)]
        `
        : `
          text-zinc-400
          hover:bg-white/[0.03]
          hover:text-zinc-200
        `
    }
  `}
                  >
<Icon
  size={20}
  className="
    transition-all duration-300
    group-hover:scale-[1.04]
  "
/>

                    {sidebarOpen && (
                      <span
  className="
    text-[15px]
    font-medium
    tracking-[-0.02em]
  "
>
  {item.name}
</span>
                    )}

                  </button>
                )
              }
            )}

          </div>

        </div>
      </aside>

      {/* Main */}
      <section className="relative z-10 flex-1 px-6 py-8 md:px-10">

        {/* Top Bar */}
        <div className="mb-10 flex items-center justify-between gap-6">

          <div className="relative w-full max-w-[720px]">

            <input
              type="text"
              placeholder="Search stories, ideas, thoughts..."
              value={
                searchInput
              }
              onChange={(e) => {
                const value =
                  e.target.value
              
                setSearchInput(
                  value
                )
              
                if (
                  !value.trim()
                ) {
                  setSearch('')
                  setActiveSection(
                    'Home'
                  )
                }
              }}
              onKeyDown={(
                e
              ) => {
                if (
                  e.key ===
                  'Enter'
                ) {
                  handleSearch()
                }
              }}
              className="
              h-[62px]
              w-full
              rounded-2xl
border-violet-400/15
bg-white/[0.03]
backdrop-blur-[22px]
focus:border-violet-400/30
focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]
              px-7 pr-16
              text-[15px]
              text-zinc-100
              shadow-[inset_0_1px_2px_rgba(0,0,0,0.28)]
              outline-none
              placeholder:text-zinc-500
              "
            />

            <button
              onClick={
                handleSearch
              }
              className="
                absolute right-5 top-1/2
                -translate-y-1/2
                text-zinc-400
                hover:text-white
              "
            >
              <Search
                size={20}
              />
            </button>

          </div>

          {/* Profile */}
          <div className="relative z-[100]">

            <button
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
              className="
              flex h-16 w-16 items-center justify-center
              rounded-full
              border border-white/10
              bg-zinc-900/70
              backdrop-blur-xl
              text-xl font-semibold text-zinc-100
              shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]
              "
            >
              {profile?.avatar_url ? (

                <img
                  src={
                    profile.avatar_url
                  }
                  alt="Profile"
                  className="
                    h-full w-full rounded-full object-cover
                  "
                />

              ) : (

                <span>
                  {profile?.name?.[0] || 'A'}
                </span>

              )}

            </button>

            {showProfileMenu && (

              <div
              className="
              absolute right-0 top-[76px]
              z-[999]
              overflow-hidden
              w-[220px]
              rounded-2xl
              border border-white/10
              bg-zinc-950/95
              p-2
              shadow-[0_30px_70px_-10px_rgba(0,0,0,0.85)]
              backdrop-blur-xl
            "
              >

                <Link
                  href="/profile"
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3
                    text-zinc-300
                    hover:bg-white/[0.04]
                  "
                >

                  <User size={18} />

                  Profile

                </Link>

                <button
                  onClick={handleSwitchAccount}
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3
                    text-zinc-300
                    hover:bg-white/[0.04]
                  "
                >

                  <RefreshCcw size={18} />

                  Switch Account

                </button>

                <button
                  onClick={handleLogout}
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3
                    text-red-300
                    hover:bg-red-500/10
                  "
                >

                  <LogOut size={18} />

                  Logout

                </button>

              </div>

            )}

          </div>

        </div>

        <div className="mb-6">

<p className="mb-2 text-xs uppercase tracking-[5px] text-zinc-500">

  {search.trim() &&
  filteredPosts.length === 0

    ? 'RESULTS'

    : sectionContent[
        activeSection
      ]?.badge}

</p>

<h2 className="text-2xl font-semibold text-[#ece7df]">

  {search.trim() &&
  filteredPosts.length === 0

    ? `No results for "${search}"`

    : sectionContent[
        activeSection
      ]?.title}

</h2>

</div>

        {/* Posts */}

        {!featuredPost ? (

<div
  className="
    mt-20 flex flex-col items-center justify-center
    rounded-[36px]
    border border-white/5
    bg-white/[0.02]
    px-8 py-20
    text-center
  "
>

  <h3 className="mb-3 text-2xl font-semibold text-[#ece7df]">

  Nothing to show yet

  </h3>

  <p className="max-w-md text-zinc-500">

    {activeSection ===
    'My Blogs'
      ? 'Your published stories will appear here.'

      : activeSection ===
        'Liked'
      ? 'Stories you love will appear here.'

      : activeSection ===
        'Comments'
      ? 'Stories you interacted with will appear here.'

      : 'No stories available right now.'}

  </p>

</div>

) : (

<Link
  href={`/post/${featuredPost.id}`}
  className="
    mb-10 block overflow-hidden
rounded-[34px]
border border-white/[0.06]
bg-white/[0.03]
backdrop-blur-[26px]
shadow-[0_32px_70px_-16px_rgba(0,0,0,0.8)]
transition-all duration-500
hover:-translate-y-1
hover:shadow-[0_40px_90px_-20px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.08)]
  "
>

  {featuredPost.image_url && (
    <img
      src={
        featuredPost.image_url
      }
      alt={
        featuredPost.title
      }
      className="
      h-[380px]
      w-full
      object-cover
      brightness-[0.88]
      contrast-[1.08]
      saturate-[0.9]
    "
    />
  )}

  <div className="p-7">

  <div className="mb-4 flex items-start justify-between text-base text-zinc-500">

<div className="flex items-center gap-4">

<button
onClick={(e) => {
  e.preventDefault()
  e.stopPropagation()

  router.push(
    `/writer/${featuredPost.users?.id}`
  )
}}
className="
flex items-center gap-3
transition-all duration-300
hover:opacity-90
hover:scale-[1.01]
"
>

    <div
      className="
        flex h-10 w-10
        items-center justify-center
        overflow-hidden
        rounded-full
        bg-gradient-to-br from-violet-200 to-indigo-300
        text-sm font-semibold
        text-black
      "
    >

      {featuredPost.users
        ?.avatar_url ? (

        <img
          src={
            featuredPost.users.avatar_url
          }
          alt="writer"
          className="
            h-full w-full object-cover
          "
        />
        

      ) : (

        featuredPost.users?.name?.[0] ||
        'W'

      )}

    </div>

    <div className="mb-4 flex items-center gap-5 text-sm text-zinc-400">

<span>
  By {featuredPost.users?.name?.trim() || 'Writer'}
</span>

<span>
  {new Date(featuredPost.created_at).toLocaleDateString(
    'en-GB',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  )}
</span>

</div>
  </button>

</div>

{canManagePost(
  featuredPost
) && (

  <div className="relative">

    <button
      onClick={(e) => {
        e.preventDefault()

        setOpenPostMenu(
          openPostMenu === featuredPost.id
            ? null
            : featuredPost.id
        )
      }}
      className="text-zinc-500 hover:text-white"
    >

      <MoreVertical size={18} />

    </button>

    {openPostMenu === featuredPost.id && (

      <div
        className="
          absolute right-0 top-8 z-30
          w-[160px]
          rounded-2xl
          border border-white/5
          bg-zinc-900
          p-2
        "
      >

<button
  onClick={(e) => {
    e.preventDefault()

    window.location.href =
      `/edit/${featuredPost.id}`
  }}
  className="
    flex w-full items-center gap-3
    rounded-xl px-4 py-3
    text-zinc-300
    hover:bg-white/[0.04]
  "
>

  <Pencil size={16} />

  Edit

</button>

        <button
          onClick={(e) => {
            e.preventDefault()

            setPostToDelete(
              featuredPost.id
            )
            
            setShowDeleteModal(
              true
            )
          }}
          className="
            flex w-full items-center gap-3
            rounded-xl px-4 py-3
            text-red-400
            hover:bg-red-500/10
          "
        >

          <Trash2 size={16} />

          Delete

        </button>

      </div>

    )}

  </div>

)}

</div>

<h2 className="mb-4 text-4xl font-semibold tracking-[-0.04em] text-zinc-100">
      {featuredPost.title}
    </h2>

    <div>

      <p className="mb-4 text-zinc-400">
        {preview(
          featuredPost.body
        )}
      </p>

      <div className="space-y-2">

        <button
          onClick={(e) => {
            e.preventDefault()

            toggleLike(
              featuredPost.id
            )
          }}
          className="
            flex items-center gap-2
            text-zinc-400
            hover:text-white
          "
        >

          <HeartIcon
            className="
              transition-all duration-300
              hover:scale-110
            "
            size={25}
            fill={
              likedPosts.includes(
                featuredPost.id
              )
                ? '#ef4444'
                : 'none'
            }
            stroke={
              likedPosts.includes(
                featuredPost.id
              )
                ? '#ef4444'
                : 'currentColor'
            }
          />

          <span>
            {likeCounts[
              featuredPost.id
            ] || 0}
          </span>

        </button>

        <p className="text-sm text-zinc-500">

          {commentCounts[
            featuredPost.id
          ] || 0}{' '}

          {(commentCounts[
            featuredPost.id
          ] || 0) === 1
            ? 'thought shared'
            : 'thoughts shared'}

        </p>

      </div>

    </div>

  </div>

</Link>

)}

{
  activeSection ===
    'Home' &&

  !search.trim() &&

  remainingPosts.length > 0 && (

    <div className="mb-6 mt-14">

      <p className="mb-2 text-xs uppercase tracking-[5px] text-zinc-500">
        EXPLORE MORE
      </p>

      <h2 className="text-2xl font-semibold text-[#ece7df]">
        More stories from creators across QuillNest.
      </h2>

    </div>

  )
}

<div className="mb-28 grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-3">

          {remainingPosts.map(
            (post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="
                overflow-hidden
                rounded-[30px]
                border border-white/[0.06]
                bg-zinc-950/35
                backdrop-blur-sm
                shadow-[0_20px_50px_-12px_rgba(0,0,0,0.75)]
                transition-all duration-500
                hover:-translate-y-1
              "
              >

                {post.image_url && (
                  <img
                    src={
                      post.image_url
                    }
                    alt={
                      post.title
                    }
                    className="
                      h-[260px]
                      w-full
                      object-cover
                    "
                  />
                )}

                <div className="p-6">

                <div className="mb-4 flex items-start justify-between text-sm text-zinc-500">

                <div className="flex items-center gap-4">

                <button
onClick={(e) => {
  e.preventDefault()
  e.stopPropagation()

  router.push(
    `/writer/${post.users?.id}`
  )
}}
className="
flex items-center gap-3
transition-all duration-300
hover:opacity-90
hover:scale-[1.01]
"
>

  <div
    className="
      flex h-9 w-9
      items-center justify-center
      overflow-hidden
      rounded-full
      bg-[#ece7df]
      text-sm font-semibold
      text-black
    "
  >

    {post.users
      ?.avatar_url ? (

      <img
        src={
          post.users.avatar_url
        }
        alt="writer"
        className="
          h-full w-full object-cover
        "
      />

    ) : (

      post.users?.name?.[0] ||
      'W'

    )}

  </div>

  <span>
    {post.users?.name?.trim() ||
      'Writer'}
  </span>

</button>

<span>
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
</span>

</div>

{canManagePost(
  post
) && (

  <div className="relative">

    <button
      onClick={(e) => {
        e.preventDefault()

        setOpenPostMenu(
          openPostMenu === post.id
            ? null
            : post.id
        )
      }}
      className="text-zinc-500 hover:text-white"
    >

      <MoreVertical size={16} />

    </button>

    {openPostMenu === post.id && (

      <div
        className="
          absolute right-0 top-8 z-30
          w-[160px]
          rounded-2xl
          border border-white/5
          bg-zinc-900
          p-2
        "
      >

        <button
          onClick={(e) => {
            e.preventDefault()

            window.location.href =
              `/edit/${post.id}`
          }}
          className="
            flex w-full items-center gap-3
            rounded-xl px-4 py-3
            text-zinc-300
            hover:bg-white/[0.04]
          "
        >

          <Pencil size={16} />

          Edit

        </button>

        <button
          onClick={(e) => {
            e.preventDefault()

            setPostToDelete(
              post.id
            )
            
            setShowDeleteModal(
              true
            )
          }}
          className="
            flex w-full items-center gap-3
            rounded-xl px-4 py-3
            text-red-400
            hover:bg-red-500/10
          "
        >

          <Trash2 size={16} />

          Delete

        </button>

      </div>

    )}

  </div>

)}

</div>

<h3 className="mb-4 text-[1.6rem] font-semibold tracking-[-0.03em] text-zinc-100">
                    {post.title}
                  </h3>

                  <div>

<p className="mb-4 text-zinc-400">
  {preview(post.body)}
</p>

<div className="space-y-2">

  {/* Like */}
  <button
    onClick={(e) => {
      e.preventDefault()

      toggleLike(
        post.id
      )
    }}
    className="
      flex items-center gap-2
      text-zinc-400
      hover:text-white
    "
  >

    <HeartIcon
      className="
        transition-all duration-300
        hover:scale-110
      "
      size={25}
      fill={
        likedPosts.includes(
          post.id
        )
          ? '#ef4444'
          : 'none'
      }
      stroke={
        likedPosts.includes(
          post.id
        )
          ? '#ef4444'
          : 'currentColor'
      }
    />

    <span>
      {likeCounts[
        post.id
      ] || 0}
    </span>

  </button>

  {/* Comments */}
  <p className="text-sm text-zinc-500">

  {commentCounts[
  post.id
] || 0}{' '}

{(commentCounts[
  post.id
] || 0) === 1
  ? 'thought shared'
  : 'thoughts shared'}

  </p>

</div>
</div>

                </div>

              </Link>
            )
          )}

        </div>

      </section>

      {/* Floating Create */}
      <Link
        href="/create"
        className="
        fixed bottom-8 right-8 z-30
        flex h-20 w-20 items-center justify-center
        rounded-full
        border border-white/10
        bg-gradient-to-b
from-violet-950 via-indigo-900 to-slate-900
        text-zinc-200
        shadow-[0_16px_40px_-8px_rgba(0,0,0,0.75)]
        transition-all duration-300
        hover:scale-105
        hover:-translate-y-1
        hover:shadow-[0_0_15px_rgba(139,92,246,0.25)]
        "
      >
        <Plus size={28} />
      </Link>

      {showDeleteModal && (

<div
  className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/70
    backdrop-blur-md
  "
>

  <div
    className="
      w-full max-w-md
      rounded-[30px]
      border border-white/5
      bg-zinc-950/90
      p-8
    "
  >

    <h2 className="mb-3 text-2xl font-semibold">

      Delete Story?

    </h2>

    <p className="mb-8 text-zinc-400">

      This action cannot be undone.

    </p>

    <div className="flex gap-4">

      <button
        onClick={() =>
          setShowDeleteModal(
            false
          )
        }
        className="
        rounded-2xl
        border border-white/[0.06]
        bg-white/[0.02]
        px-5 py-3
        text-zinc-300
      
        transition-all duration-300
      
        hover:-translate-y-[1px]
        hover:bg-white/[0.04]
        hover:border-white/[0.10]
        hover:text-white
      "
      >

        Cancel

      </button>

      <button
        onClick={() => {
          deletePost(
            postToDelete
          )

          setShowDeleteModal(
            false
          )
        }}
        className="
        rounded-2xl
        bg-red-500/90
        px-5 py-3
        text-white
      
        transition-all duration-300
      
        hover:-translate-y-[1px]
        hover:bg-red-400
        hover:shadow-[0_8px_20px_rgba(239,68,68,0.15)]
      "
      >

        Delete

      </button>

    </div>

  </div>

</div>

)}

    </main>
  )
}