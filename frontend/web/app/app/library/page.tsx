const LibraryPage = () => (
	<div className="bg-neutral text-neutral-content w-screen h-screen justify-center items-center">
		<h1 className="text-3xl font-bold m-5">My Workflows</h1>
		<span></span>
		<div className="overflow-x-auto">
			<table className="table">
				{/* head */}
				<thead className="text-neutral-content">
					<tr>
						<th>
							<label>
								<input type="checkbox" className="checkbox border-primary" />
							</label>
						</th>
						<th></th>
						<th>Name</th>
						<th>Running</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{/* row 1 */}
					<tr>
						<th>
							<label>
								<input type="checkbox" className="checkbox border-primary" />
							</label>
						</th>
						<td>
							<div className="flex items-center space-x-3">
								<div className="avatar">
									<div className="mask mask-squircle w-12 h-12">
										<img
											src="https://daisyui.com/tailwind-css-component-profile-2@56w.png"
											alt="Avatar Tailwind CSS Component"
										/>
									</div>
								</div>
								<div className="avatar">
									<div className="mask mask-squircle w-12 h-12">
										<img
											src="https://daisyui.com/tailwind-css-component-profile-2@56w.png"
											alt="Avatar Tailwind CSS Component"
										/>
									</div>
								</div>
								<div className="avatar">
									<div className="mask mask-squircle w-12 h-12">
										<img
											src="https://daisyui.com/tailwind-css-component-profile-2@56w.png"
											alt="Avatar Tailwind CSS Component"
										/>
									</div>
								</div>
							</div>
						</td>
						<td>Zemlak, Daniel and Leannon</td>
						<td>
							<input type="checkbox" className="toggle toggle-success" />
						</td>
						<th>
							<button className="btn btn-ghost btn-xs">details</button>
						</th>
					</tr>
					{/* row 2 */}
					<tr>
						<th>
							<label>
								<input type="checkbox" className="checkbox border-primary" />
							</label>
						</th>
						<td>
							<div className="flex items-center space-x-3">
								<div className="avatar">
									<div className="mask mask-squircle w-12 h-12">
										<img
											src="https://daisyui.com/tailwind-css-component-profile-3@56w.png"
											alt="Avatar Tailwind CSS Component"
										/>
									</div>
								</div>
							</div>
						</td>
						<td>Carroll Group</td>
						<td>
							<input type="checkbox" className="toggle toggle-success" />
						</td>
						<th>
							<button className="btn btn-ghost btn-xs">details</button>
						</th>
					</tr>
					{/* row 3 */}
					<tr>
						<th>
							<label>
								<input type="checkbox" className="checkbox border-primary" />
							</label>
						</th>
						<td>
							<div className="flex items-center space-x-3">
								<div className="avatar">
									<div className="mask mask-squircle w-12 h-12">
										<img
											src="https://daisyui.com/tailwind-css-component-profile-4@56w.png"
											alt="Avatar Tailwind CSS Component"
										/>
									</div>
								</div>
							</div>
						</td>
						<td>Rowe-Schoen</td>
						<td>
							<input type="checkbox" className="toggle toggle-success" />
						</td>
						<th>
							<button className="btn btn-ghost btn-xs">details</button>
						</th>
					</tr>
					{/* row 4 */}
					<tr>
						<th>
							<label>
								<input type="checkbox" className="checkbox border-primary" />
							</label>
						</th>
						<td>
							<div className="flex items-center space-x-3">
								<div className="avatar">
									<div className="mask mask-squircle w-12 h-12">
										<img
											src="https://daisyui.com/tailwind-css-component-profile-5@56w.png"
											alt="Avatar Tailwind CSS Component"
										/>
									</div>
								</div>
							</div>
						</td>
						<td>Wyman-Ledner</td>
						<td>
							<input type="checkbox" className="toggle toggle-success" />
						</td>
						<th>
							<button className="btn btn-ghost btn-xs">details</button>
						</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
);

export default LibraryPage;
