import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
	faGithub,
	faLinkedin,
	faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import INFO from "../../data/user";

import "./styles/socials.css";

const socialItems = [
	{
		href: INFO.socials.github,
		icon: faGithub,
		label: "GitHub",
		text: "Code, experiments, and repositories",
	},
	{
		href: INFO.socials.linkedin,
		icon: faLinkedin,
		label: "LinkedIn",
		text: "Professional profile and network",
	},
	{
		href: INFO.socials.twitter,
		icon: faTwitter,
		label: "Twitter",
		text: "Short thoughts and updates",
	},
].filter((item) => item.href);

const Socials = () => {
	return (
		<div className="socials">
			{socialItems.map((item) => (
				<div className="social" key={item.label}>
					<a href={item.href} target="_blank" rel="noreferrer">
						<div className="social-icon">
							<FontAwesomeIcon icon={item.icon} className="social-icon" />
						</div>
						<div className="social-copy">
							<div className="social-label">{item.label}</div>
							<div className="social-text">{item.text}</div>
						</div>
					</a>
				</div>
			))}

			<div className="email">
				<div className="email-wrapper">
					<a
						href={`mailto:${INFO.main.email}`}
						target="_blank"
						rel="noreferrer"
					>
						<div className="social-icon">
							<FontAwesomeIcon icon={faEnvelope} />
						</div>

						<div className="social-copy">
							<div className="social-label">Email</div>
							<div className="social-text">{INFO.main.email}</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	);
};

export default Socials;
