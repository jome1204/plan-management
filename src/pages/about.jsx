import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/about.css";

const About = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "about");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`About | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="about" />
				<div className="content-wrapper">
					<div className="about-logo-container">
						<div className="about-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="about-container">
						<section className="about-hero">
							<div className="about-copy">
								<div className="section-kicker">About me</div>
								<div className="title about-title">
									{INFO.about.title}
								</div>

								<div className="about-description">
									{INFO.about.description.map((item) => (
										<p className="subtitle about-subtitle" key={item}>
											{item}
										</p>
									))}
								</div>
							</div>

							<div className="about-side">
								<div className="about-image-container">
									<div className="about-image-wrapper">
										<img
											src="about.jpg"
											alt={INFO.main.name}
											className="about-image"
										/>
									</div>
								</div>

								<div className="about-socials">
									<Socials />
								</div>
							</div>
						</section>

						<section className="about-grid">
							<div className="about-card">
								<div className="section-kicker">Core strengths</div>
								<div className="about-list">
									{INFO.about.skills.map((item) => (
										<div className="about-list-item" key={item}>
											{item}
										</div>
									))}
								</div>
							</div>

							<div className="about-card">
								<div className="section-kicker">How I work</div>
								<div className="about-timeline">
									{INFO.about.timeline.map((item) => (
										<div className="about-timeline-item" key={item.title}>
											<div className="about-timeline-title">
												{item.title}
											</div>
											<div className="about-timeline-description">
												{item.description}
											</div>
										</div>
									))}
								</div>
							</div>
						</section>

						<div className="about-socials-mobile">
							<Socials />
						</div>
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default About;
