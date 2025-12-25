"use client";

import Link from "next/link";
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
		<nav className="sticky top-0 z-40 w-full border-b border-slate-700 bg-slate-900/90 backdrop-blur">
			<div className="mx-0 max-w-full px-4 sm:px-6 lg:px-8">
				<div className="flex h-[15vh] items-center justify-between  ">
					{/* Brand */}
					<div className="flex items-center gap-2">
						<Link href="/" className="flex items-center gap-2">
							<span className="inline-block h-6 w-6 rounded-md bg-blue-500" />
							<span className="text-white font-bold md:text-3xl">Finance Tracker</span>
						</Link>
					</div>

					{/* Desktop nav */}
					<div className="hidden md:flex items-center gap-2">
						{navLink("/dashboard", "Dashboard")}
						{navLink("/transactions", "Transactions")}
					</div>

					{/* Right side */}
					<div className="hidden md:flex items-center gap-3">
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
						className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
						onClick={() => setOpen((v) => !v)}
					>
						<svg
							className="h-6 w-6"
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

			{/* Mobile menu */}
			{open && (
				<div className="md:hidden border-t border-slate-700 bg-slate-900">
					<div className="space-y-1 px-2 pt-2 pb-3">
						{navLink("/dashboard", "Dashboard")}
						{navLink("/transactions", "Transactions")}
						{isAuthenticated ? (
							<button
								onClick={handleLogout}
								className="mt-1 w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
							>
								Logout
							</button>
						) : (
							<>
								{navLink("/login", "Login")}
								{navLink("/register", "Sign up")}
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}

