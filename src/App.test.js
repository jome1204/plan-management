import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";

test("renders the landing page heading", () => {
	render(
		<MemoryRouter>
			<App />
		</MemoryRouter>,
	);

	expect(
		screen.getByText(/Keep every plan, reminder, and result/i),
	).toBeInTheDocument();
});
