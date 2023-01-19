import "./LoadingSpinner.css";
export const LoadingSpinner = () => {
	return (
		<div className="overlay">
			<div className="overlay__inner">
				<div className="overlay__content">
					<span className="spinner"></span>
				</div>
			</div>
		</div>
	);
};
