import React from "react";

function article_1() {
	return {
		date: "04 May 2026",
		title: "What makes a software portfolio feel credible",
		description:
			"A strong developer portfolio shows judgment, clarity, and product thinking rather than a long list of tools.",
		keywords: [
			"software portfolio",
			"developer branding",
			"product-minded engineering",
		],
		style: `
			.article-content {
				display: grid;
				gap: 22px;
			}

			.article-content h2 {
				font-size: 1.1rem;
				color: #111827;
				margin-bottom: 0;
			}
		`,
		body: (
			<React.Fragment>
				<div className="article-content">
					<div className="paragraph">
						The best portfolios do more than say “I can code.” They
						show how a developer thinks, what kinds of problems they
						solve, and why their work can be trusted in a real
						product environment.
					</div>
					<div className="paragraph">
						Credibility usually comes from specificity. Clear
						project summaries, visible priorities, and concise
						explanations of outcomes feel stronger than a noisy list
						of technologies.
					</div>
					<h2>What I focus on</h2>
					<div className="paragraph">
						I want a portfolio to communicate three things quickly:
						the type of software I build, the standard I hold that
						work to, and the kind of collaboration I’m ready for.
					</div>
				</div>
			</React.Fragment>
		),
	};
}

function article_2() {
	return {
		date: "04 May 2026",
		title: "Why product thinking makes engineers more effective",
		description:
			"Understanding user flow, business value, and team constraints leads to better technical decisions.",
		style: ``,
		keywords: [
			"product thinking",
			"software engineering",
			"developer effectiveness",
		],
		body: (
			<React.Fragment>
				<div className="paragraph">
					Product thinking helps engineers make tradeoffs that matter.
					When you understand the user journey and the business goal,
					you can choose simpler solutions, reduce waste, and build
					with more confidence.
				</div>
				<div className="paragraph">
					It also improves collaboration. Conversations become less
					about individual preferences and more about outcomes,
					quality, and the fastest route to a useful release.
				</div>
			</React.Fragment>
		),
	};
}

function article_3() {
	return {
		date: "04 May 2026",
		title: "The case for clean, maintainable interfaces",
		description:
			"Frontend quality is not just visual polish. It is structure, clarity, responsiveness, and long-term ease of change.",
		style: ``,
		keywords: [
			"frontend architecture",
			"maintainable UI",
			"react development",
		],
		body: (
			<React.Fragment>
				<div className="paragraph">
					A clean interface should be easy for users to navigate and
					easy for teams to extend. That usually means reusable
					components, predictable layout patterns, and fewer styling
					shortcuts that create future friction.
				</div>
				<div className="paragraph">
					Good frontend work is a balance between aesthetics and
					system design. The visual layer matters, but the structure
					underneath matters just as much.
				</div>
			</React.Fragment>
		),
	};
}

const myArticles = [article_1, article_2, article_3];

export default myArticles;
