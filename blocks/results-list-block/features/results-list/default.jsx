import React from "react";
import PropTypes from "@arc-fusion/prop-types";

import { useFusionContext } from "fusion:context";
import getProperties from "fusion:properties";
import { isServerSide, HeadingSection } from "@wpmedia/arc-themes-components";
import { LazyLoad } from "@wpmedia/engine-theme-sdk";

import { resolveDefaultPromoElements } from "./results/helpers";
import Results from "./results";

const ResultsList = ({ customFields }) => {
	const { arcSite, contextPath, deployment, isAdmin } = useFusionContext();
	const {
		lazyLoad,
		listContentConfig: { contentService, contentConfigValues },
	} = customFields;
	const { fallbackImage } = getProperties(arcSite);
	const targetFallbackImage = !fallbackImage.includes("http")
		? deployment(`${contextPath}/${fallbackImage}`)
		: fallbackImage;
	const promoElements = resolveDefaultPromoElements(customFields);
	const isServerSideLazy = lazyLoad && isServerSide() && !isAdmin;
	const configuredOffset =
		parseInt(contentConfigValues?.offset, 10) ||
		parseInt(contentConfigValues?.feedOffset, 10) ||
		parseInt(contentConfigValues?.from, 10) ||
		0;
	const configuredSize =
		parseInt(contentConfigValues?.size, 10) || parseInt(contentConfigValues?.feedSize, 10) || 10;

	return (
		<LazyLoad enabled={lazyLoad && !isAdmin}>
			<HeadingSection>
				<Results
					arcSite={arcSite}
					configuredOffset={configuredOffset}
					configuredSize={configuredSize}
					contentConfigValues={contentConfigValues}
					contentService={contentService}
					isServerSideLazy={isServerSideLazy}
					showByline={promoElements.showByline}
					showDate={promoElements.showDate}
					showDescription={promoElements.showDescription}
					showHeadline={promoElements.showHeadline}
					showImage={promoElements.showImage}
					showItemOverline={promoElements.showItemOverline}
					targetFallbackImage={targetFallbackImage}
				/>
			</HeadingSection>
		</LazyLoad>
	);
};

ResultsList.label = "Results List – Arc Block";

ResultsList.icon = "arc-list";

ResultsList.propTypes = {
	customFields: PropTypes.shape({
		lazyLoad: PropTypes.bool.tag({
			name: "Lazy Load block?",
			defaultValue: false,
			description:
				"Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.",
		}),
		listContentConfig: PropTypes.contentConfig("ans-feed").tag({
			group: "Configure Content",
			label: "Display Content Info",
		}),
		showItemOverline: PropTypes.bool.tag({
			label: "Show overline",
			defaultValue: false,
			group: "Show promo elements",
		}),
		showHeadline: PropTypes.bool.tag({
			label: "Show headline",
			defaultValue: true,
			group: "Show promo elements",
		}),
		showImage: PropTypes.bool.tag({
			label: "Show image",
			defaultValue: true,
			group: "Show promo elements",
		}),
		showDescription: PropTypes.bool.tag({
			label: "Show description",
			defaultValue: true,
			group: "Show promo elements",
		}),
		showByline: PropTypes.bool.tag({
			label: "Show byline",
			defaultValue: true,
			group: "Show promo elements",
		}),
		showDate: PropTypes.bool.tag({
			label: "Show date",
			defaultValue: true,
			group: "Show promo elements",
		}),
	}),
};

export default ResultsList;
