"use client";

import Link from "next/link";;
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/features/auth/authSlice";

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { isAuthenticated, user } = useAppSelector((s) => s.auth);
	const [open, setOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await dispatch(logoutUser());
			// AuthProvider handles redirect logic
			router.push("/login");
		} catch (e) {}
	};

	const navLink = (
		href: string,
		label: string
	) => (
		<Link
			href={href}
			className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
				pathname === href
					? "text-white bg-slate-700"
					: "text-slate-300 hover:text-white hover:bg-slate-700/60"
			}`}
			onClick={() => setOpen(false)}
		>
			{label}
		</Link>
	);

	return (
		<nav className="sticky top-0 z-[100] w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur-md shadow-lg">
			<div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
				<div className="flex h-16 sm:h-20 lg:h-24 items-center justify-between">
					{/* Brand */}
					<div className="relative z-10 flex items-center flex-shrink-0">
						<Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
							<img
								src="/navImage.png"
								alt="Finance Tracker"
								className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto"
							/>
						</Link>
					</div>

					{/* Desktop nav */}
					<div className="relative z-10 hidden md:flex items-center gap-2">
						{isAuthenticated && (
							<>
								{navLink("/dashboard", "Dashboard")}
								{navLink("/transactions", "Transactions")}
								{navLink("/categories", "Categories")}
								{navLink("/aifeatures", "AI Features")}
							</>
						)}
					</div>

					{/* Right side */}
					<div className="relative z-10 hidden md:flex items-center gap-3">
						{isAuthenticated ? (
							<>
								<span className="text-slate-300">{user?.name}</span>
								<button
									onClick={handleLogout}
									className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
								>
									Logout
								</button>
							</>
						) : (
							<div className="flex items-center gap-2">
								{navLink("/login", "Login")}
								<Link
									href="/register"
									className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
								>
									Sign up
								</Link>
							</div>
						)}
					</div>

					{/* Mobile toggle */}
					<button
						aria-label="Toggle Menu"
						aria-expanded={open}
						className="relative z-10 md:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
						onClick={() => setOpen((v) => !v)}
					>
						<svg
							className="h-7 w-7"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							{open ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile drawer backdrop */}
			<div 
				className={`fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
					open ? 'opacity-100 z-[9998]' : 'opacity-0 pointer-events-none -z-10'
				}`}
				onClick={() => setOpen(false)}
				aria-hidden="true"
			/>

			{/* Mobile drawer menu */}
			<div 
				className={`md:hidden fixed top-0 left-0 bottom-0 z-[9999] w-72 bg-slate-900 border-r border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out ${
					open ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				{/* Drawer header */}
				<div className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-slate-700 bg-slate-900">
					<div className="flex items-center gap-2">
						<img
							src="/navImage.png"
							alt="Finance Tracker"
							className="h-10 w-auto"
						/>
					</div>
					<button
						onClick={() => setOpen(false)}
						className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
						aria-label="Close menu"
					>
						<svg
							className="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Drawer content */}
				<div className="relative z-10 flex flex-col h-[calc(100%-4rem)] overflow-y-auto bg-slate-900">
					<div className="flex-1 px-4 py-6">
						{/* User info */}
						{isAuthenticated && user && (
							<div className="px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700">
								<p className="text-xs text-slate-400 mb-1">Signed in as</p>
								<p className="text-base font-semibold text-white truncate">{user.name}</p>
							</div>
						)}

						{/* Navigation links */}
						<nav className="space-y-2">
							<p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Menu
							</p>
							{isAuthenticated ? (
								<>
									{navLink("/dashboard", "Dashboard")}
									{navLink("/transactions", "Transactions")}
									{navLink("/categories", "Categories")}
									{navLink("/aifeatures", "AI Features")}
								</>
							) : (
								<p className="px-3 py-2 text-sm text-slate-400">
									Please log in to access features
								</p>
							)}
						</nav>
					</div>

					{/* Drawer footer */}
					<div className="relative z-10 border-t border-slate-700 px-4 py-4 bg-slate-900">
						{isAuthenticated ? (
							<button
								onClick={handleLogout}
								className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-colors"
							>
								<svg
									className="h-5 w-5"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								Logout
							</button>
						) : (
							<div className="space-y-2">
								<Link
									href="/login"
									onClick={() => setOpen(false)}
									className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-600 text-white hover:bg-slate-800 transition-colors"
								>
									Login
								</Link>
								<Link
									href="/register"
									onClick={() => setOpen(false)}
									className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
								>
									Sign up
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}

