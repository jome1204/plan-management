import React from "react";
import { Link } from "react-router-dom";

import INFO from "../../data/user";

import "./styles/footer.css";

const Footer = () => {
	return (
		<React.Fragment>
			<div className="footer">
				<div className="footer-brand">
					<div className="footer-brand-title">{INFO.main.name}</div>
					<div className="footer-brand-copy">
						Full-stack software development with a focus on product
						quality, clarity, and dependable delivery.
					</div>
				</div>

				<div className="footer-links">
					<ul className="footer-nav-link-list">
						<li className="footer-nav-link-item">
							<Link to="/">Home</Link>
						</li>
						<li className="footer-nav-link-item">
							<Link to="/about">About</Link>
						</li>
						<li className="footer-nav-link-item">
							<Link to="/projects">Projects</Link>
						</li>
						<li className="footer-nav-link-item">
							<Link to="/articles">Writing</Link>
						</li>
						<li className="footer-nav-link-item">
							<Link to="/contact">Contact</Link>
						</li>
					</ul>
				</div>

				<div className="footer-credits">
					<div className="footer-credits-text">
						© 2026 {INFO.main.name}. Built with React.
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Footer;
