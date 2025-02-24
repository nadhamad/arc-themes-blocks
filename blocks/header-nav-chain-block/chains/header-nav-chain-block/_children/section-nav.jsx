import React from "react";
import { Link, Stack, Button, Icon, usePhrases } from "@wpmedia/arc-themes-components";

function hasChildren(node) {
	return node.children && node.children.length > 0;
}

const SectionAnchor = ({ item, isHidden }) =>
	item.node_type === "link" && !isHidden ? (
		<Link href={item.url}>{item.display_name}</Link>
	) : (
		<Link href={item._id}>{item.name}</Link>
	);

const onClickSubsection = (evt) => {
	const t = evt.target;
	if (t.nodeName === "A") {
		return;
	}

	const container = t.closest(".subsection-anchor");
	const button = t.querySelector(".submenu-caret") ?? t.closest(".submenu-caret");
	const subsection = container.nextElementSibling;
	const css = container.classList;

	if (css.contains("open")) {
		css.remove("open");
		subsection.classList.remove("open");
		button.setAttribute("aria-expanded", false);
	} else {
		css.add("open");
		subsection.classList.add("open");
		button.setAttribute("aria-expanded", true);
	}
	evt.stopPropagation();
};

const isSamePath = (current, menuLink) => {
	if (current && menuLink) {
		return current.split("/")[1] === menuLink.split("/")[1];
	}
	return false;
};

/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
// Disabled a11y eslint is valid here as the div isn't focusable
// and doesn't need to be as the caret is a button which is focusable
// and has default button behaviour and the onClick event on the parent
// div receives the event via propagation.
const SubSectionAnchor = ({ item, isOpen, isHidden, blockClassName }) => {
	const phrases = usePhrases();

	return (
		<Stack
			className={`${blockClassName}__subsection-anchor subsection-anchor ${isOpen ? "open" : ""}`}
			direction="horizontal"
			alignment="center"
			onClick={onClickSubsection}
		>
			<SectionAnchor item={item} isHidden={isHidden} />
			<Button
				type="button"
				className="submenu-caret"
				aria-expanded="false"
				aria-label={phrases.t("header-nav-chain-block.sections-button-aria-label", {
					item: item.display_name ?? item.name,
				})}
				aria-controls={`header_sub_section_${item._id.replace("/", "")}`}
				{...(isHidden ? { tabIndex: -1 } : {})}
			>
				<Icon height={20} width={20} name="ChevronDown" />
			</Button>
		</Stack>
	);
};
/* eslint-enable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */

const SectionItem = ({ item, isHidden, blockClassName }) => {
	let currentLocation;
	if (typeof window !== "undefined") {
		currentLocation = window.location.pathname;
	}
	const isOpen = isSamePath(currentLocation, item._id) ? "open" : "";

	return (
		<li className="section-item">
			{hasChildren(item) ? (
				<SubSectionAnchor
					item={item}
					isOpen={isOpen}
					isHidden={isHidden}
					blockClassName={blockClassName}
				/>
			) : (
				<SectionAnchor item={item} isHidden={isHidden} blockClassName={blockClassName} />
			)}
			{hasChildren(item) && (
				<SubSectionMenu
					blockClassName={blockClassName}
					items={item.children}
					isOpen={isOpen}
					id={item._id.replace("/", "")}
					isHidden={isHidden}
				/>
			)}
		</li>
	);
};

const SubSectionMenu = ({ items, isOpen, id, isHidden, blockClassName }) => {
	const itemsList = items.map((item) => (
		<li className="subsection-item" key={item._id}>
			{item.node_type === "link" ? (
				<Link href={item.url} assistiveHidden={isHidden}>
					{item.display_name}
				</Link>
			) : (
				<Link href={item._id} assistiveHidden={isHidden}>
					{item.name}
				</Link>
			)}
		</li>
	));

	return (
		<div className={`${blockClassName}__subsection-container ${isOpen ? "open" : ""}`}>
			<ul className={`${blockClassName}__subsection-menu`} id={`header_sub_section_${id}`}>
				{itemsList}
			</ul>
		</div>
	);
};

export default ({ children = [], sections = [], isHidden = false, blockClassName }) => {
	const active = sections.filter((s) => !s.inactive);

	return (
		<>
			{children}
			<Stack className={`${blockClassName}__flyout-nav`} as="ul">
				{active.map((item) => (
					<SectionItem
						key={item._id}
						item={item}
						isHidden={isHidden}
						blockClassName={blockClassName}
					/>
				))}
				<li className="section-menu--bottom-placeholder" />
			</Stack>
		</>
	);
};
