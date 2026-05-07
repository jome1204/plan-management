import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/contact.css";

const Contact = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "contact");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Contact | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="contact" />
				<div className="content-wrapper">
					<div className="contact-logo-container">
						<div className="contact-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="contact-container">
						<div className="contact-card">
							<div className="section-kicker">Contact</div>
							<div className="title contact-title">
								{INFO.contact.title}
							</div>

							<div className="subtitle contact-subtitle">
								{INFO.contact.description}
							</div>

							<div className="contact-points">
								{INFO.contact.points.map((item) => (
									<div className="contact-point" key={item}>
										{item}
									</div>
								))}
							</div>

							<a
								className="contact-email"
								href={`mailto:${INFO.main.email}`}
							>
								{INFO.main.email}
							</a>
						</div>

						<div className="socials-container">
							<div className="contact-socials">
								<Socials />
							</div>
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

export default Contact;
