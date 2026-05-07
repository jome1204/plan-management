import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";

import INFO from "../../data/user";

import "./styles/project.css";

const Project = (props) => {
	const { logo, title, description, linkText, link, stack, outcome } = props;

	const content = (
		<div className="project-container">
			<div className="project-logo">
				<img src={logo} alt={`${title} logo`} />
			</div>
			<div className="project-title">{title}</div>
			<div className="project-description">{description}</div>
			<div className="project-stack">
				{stack.map((item) => (
					<span className="project-stack-item" key={item}>
						{item}
					</span>
				))}
			</div>
			<div className="project-outcome">{outcome}</div>
			<div className="project-link">
				<div className="project-link-icon">
					<FontAwesomeIcon icon={link ? faArrowRight : faEnvelope} />
				</div>
				<div className="project-link-text">{linkText}</div>
			</div>
		</div>
	);

	return (
		<React.Fragment>
			<div className="project">
				{link ? (
					<Link to={link}>{content}</Link>
				) : (
					<a href={`mailto:${INFO.main.email}`}>{content}</a>
				)}
			</div>
		</React.Fragment>
	);
};

export default Project;
