import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Hero from "./default";

describe("Hero", () => {
	it("should render", () => {
		render(
			<Hero
				customFields={{
					imageURL: "image",
					headline: "My Headline",
					subHeadline: "My Sub Headline",
					description: "My description",
				}}
			/>
		);
		expect(screen.getByRole("img")).toBeInTheDocument();
		expect(screen.queryByText("My Headline")).toBeInTheDocument();
		expect(screen.queryByText("My Sub Headline")).toBeInTheDocument();
		expect(screen.queryByText("My description")).toBeInTheDocument();
	});

	it("should not render headline, subheadline or paragraph", () => {
		render(<Hero customFields={{ imageURL: "image" }} />);
		expect(screen.getByRole("img")).toBeInTheDocument();
		expect(screen.queryByText("My Headline")).not.toBeInTheDocument();
		expect(screen.queryByText("My Sub Headline")).not.toBeInTheDocument();
		expect(screen.queryByText("My description")).not.toBeInTheDocument();
	});

	it("should not render button links", () => {
		const { container } = render(
			<Hero
				customFields={{
					imageURL: "image",
					headline: "My Headline",
					subHeadline: "My Sub Headline",
					description: "My description",
				}}
			/>
		);
		expect(container.querySelectorAll("a")).toHaveLength(0);
	});

	it("should render 1 link", () => {
		const { container } = render(
			<Hero
				customFields={{
					imageURL: "image",
					headline: "My Headline",
					subHeadline: "My Sub Headline",
					description: "My description",
					link1Action: "#",
					link1Text: "For Him",
					link1Type: "primary",
				}}
			/>
		);
		expect(container.querySelectorAll("a")).toHaveLength(1);
	});

	it("should render 2 links with secondary style", () => {
		const { container } = render(
			<Hero
				customFields={{
					imageURL: "image",
					headline: "My Headline",
					subHeadline: "My Sub Headline",
					description: "My description",
					link1Action: "#",
					link1Text: "For Him",
					link1Type: "secondary",
					link2Action: "#",
					link2Text: "For Her",
					link2Type: "secondary",
				}}
			/>
		);
		expect(container.querySelectorAll("a.c-button--secondary")).toHaveLength(2);
	});

	it("should render overlay layout by default", () => {
		const { container } = render(
			<Hero
				customFields={{
					imageURL: "image",
					headline: "My Headline",
					subHeadline: "My Sub Headline",
					description: "My description",
					link1Action: "#",
					link1Text: "For Him",
					link1Type: "secondary",
					link2Action: "#",
					link2Text: "For Her",
					link2Type: "secondary",
				}}
			/>
		);
		expect(container.querySelectorAll(".b-hero--stacked")).toHaveLength(0);
		expect(container.querySelectorAll(".b-hero--overlay")).toHaveLength(1);
	});

	it("should render stacked layout when specified", () => {
		const { container } = render(
			<Hero
				customFields={{
					layout: "stacked",
					imageURL: "image",
					headline: "My Headline",
					subHeadline: "My Sub Headline",
					description: "My description",
					link1Action: "#",
					link1Text: "For Him",
					link1Type: "secondary",
					link2Action: "#",
					link2Text: "For Her",
					link2Type: "secondary",
				}}
			/>
		);
		expect(container.querySelectorAll(".b-hero--overlay")).toHaveLength(0);
		expect(container.querySelectorAll(".b-hero--stacked")).toHaveLength(1);
	});

	it("should render center alignment layout by default", () => {
		const { container } = render(
			<Hero
				customFields={{
					imageURL: "image",
					headline: "My Headline",
					subHeadline: "My Sub Headline",
					description: "My description",
					link1Action: "#",
					link1Text: "For Him",
					link1Type: "secondary",
					link2Action: "#",
					link2Text: "For Her",
					link2Type: "secondary",
				}}
			/>
		);
		expect(container.querySelectorAll(".b-hero__text--left")).toHaveLength(0);
		expect(container.querySelectorAll(".b-hero__text--center")).toHaveLength(1);
	});

	it("should render left alignment layout when specified", () => {
		const { container } = render(
			<Hero
				customFields={{
					alignment: "left",
					imageURL: "image",
					headline: "My Headline",
					subHeadline: "My Sub Headline",
					description: "My description",
					link1Action: "#",
					link1Text: "For Him",
					link1Type: "secondary",
					link2Action: "#",
					link2Text: "For Her",
					link2Type: "secondary",
				}}
			/>
		);
		expect(container.querySelectorAll(".b-hero__text--center")).toHaveLength(0);
		expect(container.querySelectorAll(".b-hero__text--left")).toHaveLength(1);
	});

	it("should render light variant when specified", () => {
		const { container } = render(
			<Hero
				customFields={{
					alignment: "left",
					imageURL: "image",
					headline: "My Headline",
					subHeadline: "My Sub Headline",
					description: "My description",
					link1Action: "#",
					link1Text: "For Him",
					link1Type: "secondary",
					link2Action: "#",
					link2Text: "For Her",
					link2Type: "secondary",
					variant: "light",
				}}
			/>
		);
		expect(container.querySelectorAll(".b-hero--dark")).toHaveLength(0);
		expect(container.querySelectorAll(".b-hero--light")).toHaveLength(1);
	});

	it("should set correct alt text for the image", () => {
		const { container } = render(
			<Hero
				customFields={{
					alignment: "left",
					imageURL: "image",
					imageAltText: "¿Dónde está la biblioteca?",
					headline: "My Headline",
					subHeadline: "My Sub Headline",
					description: "My description",
					link1Action: "#",
					link1Text: "For Him",
					link1Type: "secondary",
					link2Action: "#",
					link2Text: "For Her",
					link2Type: "secondary",
					variant: "light",
				}}
			/>
		);
		expect(container.querySelector("img").getAttribute("alt")).toBe("¿Dónde está la biblioteca?");
	});
});
