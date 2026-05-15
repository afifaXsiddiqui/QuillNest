"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabase";

export default function AuthPage() {
	const [selectedRole, setSelectedRole] = useState("author");

	const [activeTab, setActiveTab] = useState("login");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	const [mouse, setMouse] = useState({
		x: 0,
		y: 0,
	});

	const mainRef = useRef(null);

	const handleSignup = async () => {
		if (!email.trim() || !password.trim()) return;

		setLoading(true);
		setErrorMsg("");
		setSuccessMsg("");

		try {
			const { data, error } = await supabase.auth.signUp({
				email: email.trim(),
				password,
			});

			if (error) {
				setErrorMsg(error.message);
				return;
			}

			if (data?.user) {
				await supabase.from("users").upsert([
					{
						id: data.user.id,
						email: data.user.email,
						name: data.user.email,
						role: selectedRole,
					},
				]);
			}

			setSuccessMsg("Your account is ready.");
			setActiveTab("login");
		} finally {
			setLoading(false);
		}
	};

	const handleLogin = async () => {
		if (!email.trim() || !password.trim()) return;

		setLoading(true);
		setErrorMsg("");
		setSuccessMsg("");

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email.trim(),
				password,
			});

			if (error) {
				setErrorMsg(error.message);
				return;
			}

			if (data?.session) {
				window.location.href = "/";
			}
		} finally {
			setLoading(false);
		}
	};
	const createUserIfNeeded = async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
	
		if (!session) return;
	
		const user = session.user;
	
		const { data: existingUser } = await supabase
			.from("users")
			.select("id")
			.eq("id", user.id)
			.single();
	
		if (!existingUser) {
			await supabase.from("users").insert([
				{
					id: user.id,
					email: user.email,
					name:
						user.user_metadata?.full_name ||
						user.user_metadata?.name ||
						"Writer",
					role: "author",
					avatar_url:
						user.user_metadata?.avatar_url ||
						user.user_metadata?.picture ||
						"",
				},
			]);
		}
	};
	const signInWithGoogle = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",

			options: {
				queryParams: {
					prompt: "select_account",
				},
			},
		});

		setTimeout(() => {
			createUserIfNeeded();
		}, 3000);
	};

	const moveMouse = (e) => {
		const el = mainRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const px = ((e.clientX - r.left) / r.width) * 100;
		const py = ((e.clientY - r.top) / r.height) * 100;
		el.style.setProperty("--spot-x", `${px}%`);
		el.style.setProperty("--spot-y", `${py}%`);
		const x = (e.clientX - r.left) / r.width - 0.5;
		const y = (e.clientY - r.top) / r.height - 0.5;
		setMouse({ x, y });
	};

	const resetAmbientPointer = () => {
		const el = mainRef.current;
		if (el) {
			el.style.setProperty("--spot-x", "50%");
			el.style.setProperty("--spot-y", "32%");
		}
		setMouse({ x: 0, y: 0 });
	};

	const darkSphereSurface = {
		background:
			"radial-gradient(circle at 30% 22%, rgba(255,255,255,0.035) 0%, transparent 28%), radial-gradient(circle at 72% 72%, rgba(0,0,0,0.42) 0%, transparent 46%), radial-gradient(circle at 50% 50%, #1f1f23 0%, #121214 48%, #0b0b0f 100%)",
		boxShadow:
			"inset 0 -12px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03), 0 40px 80px -24px rgba(0,0,0,0.65)",
	};

	return (
		<main
			ref={mainRef}
			onMouseMove={moveMouse}
			onMouseLeave={resetAmbientPointer}
			style={{
				"--spot-x": "50%",
				"--spot-y": "32%",
			}}
			className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#050506] px-4 py-14 font-sans antialiased selection:bg-indigo-950/35 selection:text-zinc-200 sm:px-8 sm:py-16">
			{/* Rich dark foundation */}
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-20%,rgba(39,39,42,0.45),transparent_55%),radial-gradient(ellipse_80%_55%_at_100%_80%,rgba(24,24,27,0.9),transparent_50%),radial-gradient(ellipse_60%_45%_at_0%_60%,rgba(9,9,11,0.95),transparent_45%)]"
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900/20 via-transparent to-black"
				aria-hidden
			/>

			{/* Floating dark spheres — matte depth */}
			<div
				className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
				aria-hidden>
				<div className="auth-sphere-1 absolute left-[4%] top-[18%] sm:left-[8%] sm:top-[14%] opacity-[0.32]">
					<div
						className="h-[220px] w-[220px] rounded-full blur-3xl sm:h-[260px] sm:w-[260px]"
						style={darkSphereSurface}
					/>
				</div>
				<div className="auth-sphere-2 absolute right-[2%] top-[32%] opacity-[0.28] sm:right-[6%]">
					<div
						className="h-[200px] w-[200px] rounded-full blur-3xl sm:h-[240px] sm:w-[240px]"
						style={darkSphereSurface}
					/>
				</div>
				<div className="auth-sphere-3 absolute bottom-[10%] left-[22%] opacity-[0.26] sm:bottom-[14%] sm:left-[28%]">
					<div
						className="h-[180px] w-[180px] rounded-full blur-3xl sm:h-[210px] sm:w-[210px]"
						style={darkSphereSurface}
					/>
				</div>
			</div>

			{/* Static depth orbs — slow drift only, no cursor parallax */}
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				aria-hidden>
				<div className="auth-orb-slow absolute -left-[30%] top-[0%] h-[min(110vw,640px)] w-[min(110vw,640px)] rounded-full bg-gradient-to-br from-zinc-600/12 via-zinc-800/8 to-transparent blur-[140px]" />
				<div className="auth-orb-slow-delayed absolute -right-[25%] bottom-[-5%] h-[min(100vw,560px)] w-[min(100vw,560px)] rounded-full bg-gradient-to-tl from-zinc-700/10 via-zinc-900/6 to-transparent blur-[150px]" />
				<div className="auth-orb-slow absolute left-[25%] top-[50%] h-[min(50vw,380px)] w-[min(55vw,420px)] rounded-full bg-zinc-800/8 blur-[130px] [animation-delay:-12s]" />
			</div>

			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.88)_100%)]"
				aria-hidden
			/>

			{/* Premium background objects */}
			<div
				className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
				aria-hidden>
				{/* Left sphere */}
				<div
					className="absolute left-[-4rem] top-[18%] h-[340px] w-[340px] rounded-full animate-floatSlow"
					style={{
						background:
							"radial-gradient(circle at 35% 30%, rgba(255,255,255,0.08), rgba(35,35,40,0.95) 45%, rgba(0,0,0,1) 100%)",
						opacity: 0.85,
					}}
				/>

				{/* Right sphere */}
				<div
					className="absolute right-[-4rem] top-[45%] h-[280px] w-[280px] rounded-full animate-floatSlow2"
					style={{
						background:
							"radial-gradient(circle at 35% 30%, rgba(255,255,255,0.06), rgba(28,28,32,0.95) 45%, rgba(0,0,0,1) 100%)",
						opacity: 0.7,
					}}
				/>

				{/* Bottom sphere */}
				<div
					className="absolute bottom-[-4rem] left-[20%] h-[220px] w-[220px] rounded-full animate-floatSlow"
					style={{
						background:
							"radial-gradient(circle at 35% 30%, rgba(255,255,255,0.05), rgba(24,24,28,0.95) 45%, rgba(0,0,0,1) 100%)",
						opacity: 0.6,
					}}
				/>

				{/* Glass panels */}
				<div
					className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-20"
					style={{
						background:
							"radial-gradient(circle, rgba(70,70,90,0.25) 0%, transparent 70%)",
					}}
				/>
			</div>

			{/* Cursor-led ambient light — editorial “studio” feel, not 3D gimmicks */}
			<div
				className="pointer-events-none absolute inset-0 z-[1] opacity-[0.85]"
				style={{
					background: `
          radial-gradient(
          ellipse 90vw 75vh
          at var(--spot-x, 50%) var(--spot-y, 32%),
          rgba(139,92,246,0.10) 0%,
          rgba(99,102,241,0.08) 20%,
          rgba(59,130,246,0.05) 35%,
          transparent 60%
          )
          `,
				}}
				aria-hidden
			/>

			<div
				className="auth-grain pointer-events-none absolute inset-0 z-[1] opacity-[0.025] mix-blend-overlay"
				aria-hidden
			/>

			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-violet-300/40 blur-sm animate-pulse" />

				<div className="absolute right-[18%] top-[28%] h-3 w-3 rounded-full bg-indigo-300/30 blur-sm animate-pulse" />

				<div className="absolute bottom-[22%] left-[22%] h-2 w-2 rounded-full bg-blue-300/30 blur-sm animate-pulse" />
			</div>

			{/* Glass card — whisper of parallax (translate only, no tilt) */}
			<div
				className="relative z-10 w-full max-w-[400px] transition-[transform] duration-500 ease-out will-change-transform sm:max-w-[420px]"
				style={{
					transform: `
translate3d(${mouse.x * 10}px, ${mouse.y * 10}px, 0)
scale(${1 + Math.abs(mouse.x + mouse.y) * 0.015})
`,
				}}>
				<div className="relative overflow-hidden rounded-[22px] border border-white/[0.065] bg-zinc-950/35 px-8 py-6 shadow-[0_0_0_1px_rgba(255,255,255,0.035)_inset,0_1px_0_rgba(255,255,255,0.07)_inset,0_32px_64px_-12px_rgba(0,0,0,0.75),0_64px_128px_-32px_rgba(0,0,0,0.45)] backdrop-blur-[28px] backdrop-saturate-150 sm:rounded-3xl sm:px-10 sm:py-7">
					<div
						className="pointer-events-none absolute inset-0 opacity-40"
						style={{
							background:
								"linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.06) 35%, transparent 50%)",
							transform: `translateX(${mouse.x * 20}px)`,
						}}
					/>
					<div
						className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/25 to-transparent sm:inset-x-8"
						aria-hidden
					/>
					<div
						className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-400/[0.10] via-transparent to-transparent"
						aria-hidden
					/>
					<div
						className="pointer-events-none absolute -inset-px rounded-[22px] opacity-[0.38] [background:linear-gradient(165deg,rgba(148,163,184,0.08),transparent_44%,transparent_56%,rgba(99,102,241,0.10))] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:xor] [-webkit-mask-composite:xor] p-px sm:rounded-3xl"
						aria-hidden
					/>

					<div className="relative space-y-6">
						<header className="space-y-4 text-center">
							<div className="flex justify-center">
								<div className="relative">
									<div
										className="pointer-events-none absolute inset-[-40%] rounded-full bg-violet-500/15 blur-[60px]   blur-3xl"
										aria-hidden
									/>
									<Image
										src="/icon1.png"
										alt="QuillNest"
										width={124}
										height={124}
										priority
										sizes="124px"
										className="relative h-[108px] w-[108px] object-contain sm:h-[124px] sm:w-[124px] [filter:drop-shadow(0_12px_32px_rgba(0,0,0,0.65))_drop-shadow(0_0_1px_rgba(148,163,184,0.12))]"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<h1
									className="
  brand-text
    text-[1.9rem]
    sm:text-[2.1rem]
    font-semibold
    tracking-[-0.06em]
    bg-gradient-to-r
    from-zinc-100
    via-violet-100
    to-indigo-200
    bg-clip-text
    text-transparent
    drop-shadow-[0_0_18px_rgba(139,92,246,0.08)]
  ">
									QuillNest
								</h1>
								<p className="text-[15px] leading-relaxed text-zinc-400">
									Where stories come to life.
								</p>
							</div>
						</header>

						<div
							role="tablist"
							aria-label="Sign in or create account"
							className="relative grid grid-cols-2 gap-1 rounded-xl border border-white/[0.06] bg-black/50 p-1 shadow-inner shadow-black/80">
							<div
								className="pointer-events-none absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-lg bg-gradient-to-b from-violet-600/80 to-indigo-950/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-zinc-500/20 transition-[transform] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
								style={{
									transform:
										activeTab === "login"
											? "translateX(0)"
											: "translateX(calc(100% + 4px))",
								}}
								aria-hidden
							/>
							<button
								type="button"
								role="tab"
								aria-selected={activeTab === "login"}
								onClick={() => setActiveTab("login")}
								className={`relative z-[1] rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/35 ${
									activeTab === "login"
										? "text-zinc-200"
										: "text-zinc-500 hover:text-indigo-200/45"
								}`}>
								Login
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={activeTab === "signup"}
								onClick={() => setActiveTab("signup")}
								className={`relative z-[1] rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/35 ${
									activeTab === "signup"
										? "text-zinc-200"
										: "text-zinc-500 hover:text-indigo-200/45"
								}`}>
								Sign Up
							</button>
						</div>

						<div className="space-y-5">
							{errorMsg && (
								<p className="rounded-xl border border-red-500/20 bg-red-950/25 px-4 py-3 text-sm text-red-200/95 backdrop-blur-sm">
									{errorMsg}
								</p>
							)}

							{successMsg && (
								<p className="rounded-xl border border-emerald-500/15 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-100/95 backdrop-blur-sm">
									{successMsg}
								</p>
							)}

							<div className="space-y-2.5">
								<label className="sr-only" htmlFor="auth-email">
									Email
								</label>
								<input
									id="auth-email"
									type="email"
									placeholder="Email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									autoComplete="email"
									className="w-full rounded-xl border border-violet-400/15 bg-zinc-900/50 px-4 py-3.5 text-[15px] text-zinc-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.28)] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-zinc-500 focus:border-slate-500/50 focus:bg-zinc-900/60 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.18),inset_0_1px_2px_rgba(0,0,0,0.28)]"
								/>

								<label className="sr-only" htmlFor="auth-password">
									Password
								</label>
								<input
									id="auth-password"
									type="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete={
										activeTab === "login" ? "current-password" : "new-password"
									}
									className="w-full rounded-xl border border-zinc-600/35 bg-zinc-900/50 px-4 py-3.5 text-[15px] text-zinc-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.28)] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-zinc-500 focus:border-slate-500/50 focus:bg-zinc-900/60 focus:shadow-[0_0_0_3px_rgba(71,85,105,0.22),inset_0_1px_2px_rgba(0,0,0,0.28)]"
								/>

								{activeTab === "signup" && (
									<div className="space-y-3 pt-2">
										<p className="text-sm text-zinc-400">
											How would you like to join?
										</p>

										<div
											className="
    relative grid grid-cols-2 gap-1
    rounded-xl
    border border-white/[0.06]
    bg-black/40
    p-1
    shadow-inner shadow-black/80
  ">
											<div
												className="
      pointer-events-none absolute bottom-1 top-1
      w-[calc(50%-4px)]
      rounded-lg
      bg-gradient-to-b
      from-violet-600/80
      to-indigo-950/95
      ring-1 ring-zinc-500/20
      transition-transform duration-300
    "
												style={{
													transform:
														selectedRole === "author"
															? "translateX(0)"
															: "translateX(calc(100% + 4px))",
												}}
											/>

											<button
												type="button"
												onClick={() => setSelectedRole("author")}
												className={`
      relative z-[1]
      rounded-lg py-3
      text-sm font-medium
      transition-colors duration-300
      ${
				selectedRole === "author"
					? "text-white"
					: "text-zinc-500 hover:text-zinc-300"
			}
    `}>
												Writer
											</button>

											<button
												type="button"
												onClick={() => setSelectedRole("viewer")}
												className={`
      relative z-[1]
      rounded-lg py-3
      text-sm font-medium
      transition-colors duration-300
      ${
				selectedRole === "viewer"
					? "text-white"
					: "text-zinc-500 hover:text-zinc-300"
			}
    `}>
												Reader
											</button>
										</div>
									</div>
								)}
							</div>

							<button
								type="button"
								onClick={activeTab === "login" ? handleLogin : handleSignup}
								disabled={loading}
								className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-b from-violet-950 via-indigo-900 to-slate-900 py-3.5 text-[15px] font-semibold tracking-[-0.01em] text-zinc-300 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] ring-1 ring-zinc-600/25 transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.55),0_0_24px_-10px_rgba(139,92,246,0.25)] hover:ring-slate-500/30 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/35 active:translate-y-0 disabled:pointer-events-none disabled:opacity-40">
								<span
									className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
									aria-hidden
								/>
								<span className="relative">
									{loading
										? "Please wait..."
										: activeTab === "login"
											? "Login"
											: "Create Account"}
								</span>
							</button>
							{/* Google Auth */}
							<div className="space-y-4 pt-4">
								<div className="flex items-center gap-4">
									<div className="h-px flex-1 bg-white/10" />

									<p className="text-sm text-zinc-500">or continue with</p>

									<div className="h-px flex-1 bg-white/10" />
								</div>

								<button
									type="button"
									onClick={signInWithGoogle}
									className="
    flex w-full items-center justify-center gap-3
    rounded-xl
    border border-zinc-600/35
    bg-zinc-900/40
    py-3.5
    text-zinc-200
    transition
    hover:bg-zinc-800/50
  ">
									<img
										src="https://www.google.com/favicon.ico"
										alt="Google"
										className="h-5 w-5"
									/>
									Sign in with Google
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
