import React from "react";
import PropTypes from "@arc-fusion/prop-types";
import { useContent } from "fusion:content";
import { useFusionContext } from "fusion:context";
import { Divider, Link, Stack, Separator, usePhrases } from "@wpmedia/arc-themes-components";

const BLOCK_CLASS_NAME = "b-links-bar";

const LinksBar = ({ customFields: { navigationConfig = {}, ariaLabel } }) => {
	const content = useContent({
		source: navigationConfig.contentService,
		query: {
			...navigationConfig.contentConfigValues,
			feature: "links-bar",
		},
		filter: `{
      children {
        _id
        node_type
        display_name
        name
        url
      }
    }`,
	});
	const { id } = useFusionContext();
	const phrases = usePhrases();
	const menuItems = content && content.children ? content.children : [];
	const showSeparator = !!(content && content.children && content.children.length > 1);

	return (
		<>
			{menuItems.length > 0 && (
				<>
					<Stack
						className={BLOCK_CLASS_NAME}
						justification="center"
						direction="row"
						as="nav"
						key={id}
						aria-label={ariaLabel || phrases.t("links-bar-block.element-aria-label")}
						wrap="wrap"
					>
						{menuItems.map((item, index) => (
							<React.Fragment key={item._id}>
								{item.node_type === "link" ? (
									<Link href={item.url}>{item.display_name}</Link>
								) : (
									<Link href={item._id}>{item.name}</Link>
								)}
								{content.children.length !== index + 1 && showSeparator ? <Separator /> : null}
							</React.Fragment>
						))}
					</Stack>
					<Divider />
				</>
			)}
		</>
	);
};

LinksBar.label = "Links Bar – Arc Block";

LinksBar.icon = "hyperlink-3";

LinksBar.propTypes = {
	customFields: PropTypes.shape({
		navigationConfig: PropTypes.contentConfig("navigation-hierarchy").tag({
			group: "Configure Content",
			label: "Navigation",
		}),
		ariaLabel: PropTypes.string.tag({
			label: "Aria-label",
			defaultValue: "More Links",
			description:
				'The label is provided to assistive technologies to provide it with a unique name for the links bar nav landmark - defaults to "More Links" if left blank',
		}),
	}),
};

export default LinksBar;
