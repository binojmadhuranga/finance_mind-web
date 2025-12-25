export default function Footer() {
	return (
		<footer className="border-t border-slate-700 bg-slate-900">
			<div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-400 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-between gap-3 md:flex-row">
					<p>
						© {new Date().getFullYear()} Finance Tracker. All rights reserved.
					</p>
					<div className="flex items-center gap-4">
						<a
							href="https://github.com/"
							target="_blank"
							rel="noreferrer"
							className="hover:text-white"
						>
							GitHub
						</a>
						<a href="#" className="hover:text-white">
							Privacy
						</a>
						<a href="#" className="hover:text-white">
							Terms
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

