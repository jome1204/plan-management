import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faCode,
	faEnvelope,
	faLayerGroup,
	faServer,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import Logo from "../components/common/logo";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import AllProjects from "../components/projects/allProjects";

import INFO from "../data/user";
import SEO from "../data/seo";
import myArticles from "../data/articles";

import "./styles/homepage.css";

const capabilityIcons = [faCode, faServer, faLayerGroup];

const socialLinks = [
	{
		href: INFO.socials.github,
		label: "GitHub",
		icon: faGithub,
	},
	{
		href: INFO.socials.linkedin,
		label: "LinkedIn",
		icon: faLinkedin,
	},
	{
		href: `mailto:${INFO.main.email}`,
		label: "Email",
		icon: faEnvelope,
	},
].filter((item) => item.href);

const Homepage = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "home");

	return (
		<React.Fragment>
			<Helmet>
				<title>{INFO.main.title}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="home" />
				<div className="content-wrapper">
					<div className="homepage-logo-container">
						<Logo width={64} link={false} />
					</div>

					<div className="homepage-container">
						<section className="hero-section">
							<div className="hero-copy">
								<div className="hero-badge">
									{INFO.main.role} in {INFO.main.location}
								</div>
								<h1 className="title homepage-title">
									{INFO.homepage.title}
								</h1>
								<p className="subtitle homepage-subtitle">
									{INFO.homepage.description}
								</p>
								<p className="homepage-status">
									{INFO.homepage.status}
								</p>

								<div className="hero-actions">
									<a
										className="hero-button hero-button-primary"
										href={`mailto:${INFO.main.email}`}
									>
										Start a conversation
									</a>
									<Link
										className="hero-button hero-button-secondary"
										to="/projects"
									>
										See projects
									</Link>
								</div>

								<div className="homepage-socials">
									{socialLinks.map((item) => (
										<a
											href={item.href}
											target="_blank"
											rel="noreferrer"
											key={item.label}
											className="homepage-social-chip"
										>
											<FontAwesomeIcon icon={item.icon} />
											<span>{item.label}</span>
										</a>
									))}
								</div>
							</div>

							<div className="hero-panel">
								<div className="hero-panel-header">
									<span>What I bring to a product team</span>
								</div>
								<div className="hero-stats">
									{INFO.homepage.stats.map((item) => (
										<div className="hero-stat-card" key={item.label}>
											<div className="hero-stat-label">
												{item.label}
											</div>
											<div className="hero-stat-value">
												{item.value}
											</div>
										</div>
									))}
								</div>
								<div className="hero-highlight-list">
									{INFO.homepage.highlights.map((item, index) => (
										<div className="hero-highlight" key={item}>
											<div className="hero-highlight-icon">
												<FontAwesomeIcon
													icon={
														capabilityIcons[
															index % capabilityIcons.length
														]
													}
												/>
											</div>
											<div>{item}</div>
										</div>
									))}
								</div>
							</div>
						</section>

						<section className="homepage-section">
							<div className="section-heading-row">
								<div>
									<div className="section-kicker">
										Selected projects
									</div>
									<h2 className="section-title">
										Work shaped for real product use.
									</h2>
								</div>
								<Link to="/projects" className="section-link">
									Explore all projects{" "}
									<FontAwesomeIcon icon={faArrowRight} />
								</Link>
							</div>
							<AllProjects />
						</section>

						<section className="homepage-grid">
							<div className="homepage-section insight-panel">
								<div className="section-kicker">Working style</div>
								<h2 className="section-title">
									How I approach software development
								</h2>
								<div className="insight-list">
									{INFO.about.timeline.map((item) => (
										<div className="insight-item" key={item.title}>
											<div className="insight-title">
												{item.title}
											</div>
											<div className="insight-description">
												{item.description}
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="homepage-section writing-panel">
								<div className="section-kicker">Writing</div>
								<h2 className="section-title">
									How I think about software work
								</h2>
								<div className="writing-list">
									{myArticles.map((article, index) => (
										<Link
											to={`/article/${index + 1}`}
											className="writing-card"
											key={article().title}
										>
											<div className="writing-date">
												{article().date}
											</div>
											<div className="writing-title">
												{article().title}
											</div>
											<div className="writing-description">
												{article().description}
											</div>
										</Link>
									))}
								</div>
							</div>
						</section>

						<section className="homepage-cta">
							<div>
								<div className="section-kicker">Next step</div>
								<h2 className="section-title">
									Need a developer who can build and refine with
									you?
								</h2>
								<p className="homepage-cta-copy">
									I’m interested in projects that value clean
									execution, strong collaboration, and lasting
									product quality.
								</p>
							</div>
							<a
								className="hero-button hero-button-primary"
								href={`mailto:${INFO.main.email}`}
							>
								Contact me
							</a>
						</section>

						<div className="page-footer">
							<Footer />
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Homepage;
