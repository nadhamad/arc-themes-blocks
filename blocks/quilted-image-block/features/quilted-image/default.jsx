import React from "react";
import PropTypes from "@arc-fusion/prop-types";
import { useContent } from "fusion:content";
import { useFusionContext } from "fusion:context";

// Arc Themes Components - Base set of components used to compose blocks
// https://github.com/WPMedia/arc-themes-components/
import {
	Heading,
	HeadingSection,
	Image,
	Button,
	Paragraph,
	Stack,
} from "@wpmedia/arc-themes-components";

const BLOCK_CLASS_NAME = "b-quilted-image";
function QuiltedImage({ customFields }) {
	const {
		headline,
		image1URL,
		overlayText1,
		overlayText1Variant = "dark",
		link1Text,
		// NOTE : Link href properties currently need a default or "startsWith of undefined" error is raised.
		// https://github.com/WPMedia/arc-themes-components/blob/arc-themes-release-version-2.00/src/components/link/index.jsx#L22
		link1Action = "",
		link1TextVariant = "dark",
		image2URL,
		overlayText2,
		overlayText2Variant = "dark",
		link2Text,
		link2Action = "",
		link2TextVariant = "dark",
		image3URL,
		overlayText3,
		overlayText3Variant = "dark",
		link3Text,
		link3Action = "",
		link3TextVariant = "dark",
	} = customFields;

	// get properties from context for using translations in intl.json
	// See document for more info https://arcpublishing.atlassian.net/wiki/spaces/TI/pages/2538275032/Lokalise+and+Theme+Blocks
	// const { arcSite } = useFusionContext();
	// const { locale } = getProperties(arcSite);
	// const phrases = getTranslatedPhrases(locale);

	// Account for "dark" or "light" variants y
	/*
  const cssClasses = [
		BLOCK_CLASS_NAME,
		variant === "dark" ? `${BLOCK_CLASS_NAME}--dark` : `${BLOCK_CLASS_NAME}--light`,
	].join(" ");
  */

	return (
		<div className={`${BLOCK_CLASS_NAME}`}>
			<HeadingSection>
				{headline ? <Heading>{headline}</Heading> : null}
				<Stack>
					<Stack direction="horizontal">
						<div className="b-quilted-image--panel">
							{/*
              TODO : Determine if other data should be used for image alt text or if image
              title or description needs to be brought in via searchable hooks, e.g. searchableField.
              https://corecomponents.arcpublishing.com/alc/arc-products/pagebuilder/fusion/documentation/api/react-hooks.md?version=3.1
            */}
							<Image src={image1URL} alt={overlayText1} />
							<Stack className="b-quilted-image--overlay">
								<Paragraph>{overlayText1}</Paragraph>
								<Button variant={link1TextVariant} href={link1Action}>
									{link1Text}
								</Button>
							</Stack>
						</div>
						<div className="b-quilted-image--panel">
							<Image src={image2URL} alt={overlayText2} />
							<Stack className="b-quilted-image--overlay">
								<Paragraph>{overlayText2}</Paragraph>
								<Button variant={link2TextVariant} href={link2Action}>
									{link2Text}
								</Button>
							</Stack>
						</div>
					</Stack>
					<div className="b-quilted-image--panel">
						<Image src={image3URL} alt={overlayText3} />
						<Stack className="b-quilted-image--overlay">
							<Paragraph>{overlayText3}</Paragraph>
							<Button variant={link3TextVariant} href={link3Action}>
								{link3Text}
							</Button>
						</Stack>
					</div>
				</Stack>
			</HeadingSection>
		</div>
	);
}

QuiltedImage.label = "Quilted Image - Arc Block";

// find matching icon in https://redirector.arcpublishing.com/pagebuilder/block-icon-library
QuiltedImage.icon = "picture-polaroid-album-1";

QuiltedImage.propTypes = {
	customFields: PropTypes.shape({
		headline: PropTypes.string.tag({
			label: "Headline",
			defaultValue: "",
			description: "Headline text describing all images",
		}),
		image1URL: PropTypes.string.tag({
			label: "Image URL",
			searchable: "image",
			description: "URL of first image, displayed at 4:3 aspect ratio.",
			group: "Image 1",
		}).isRequired,
		overlayText1: PropTypes.string.tag({
			label: "Overlay Text",
			description: "Overlay text appearing within the image.",
			group: "Image 1",
		}).isRequired,
		overlayText1Variant: PropTypes.oneOf(["dark", "light"]).tag({
			label: "Overlay Text Color",
			defaultValue: "dark",
			group: "Image 1",
		}),
		link1Text: PropTypes.string.tag({
			label: "Button Text",
			description: "Text appearing on image's button.",
			group: "Image 1",
		}).isRequired,
		link1Action: PropTypes.string.tag({
			label: "Button Click URL",
			description: "Destination URL when image's button is clicked.",
			group: "Image 1",
		}).isRequired,
		link1TextVariant: PropTypes.oneOf(["dark", "light"]).tag({
			label: "Button Color",
			defaultValue: "dark",
			group: "Image 1",
		}),
		image2URL: PropTypes.string.tag({
			label: "Image URL",
			searchable: "image",
			description: "URL of first image, displayed at 4:3 aspect ratio on desktop displays.",
			group: "Image 2",
		}).isRequired,
		overlayText2: PropTypes.string.tag({
			label: "Overlay Text",
			description: "Overlay text appearing within the image.",
			group: "Image 2",
		}).isRequired,
		overlayText2Variant: PropTypes.oneOf(["dark", "light"]).tag({
			label: "Overlay Text Color",
			defaultValue: "dark",
			group: "Image 2",
		}),
		link2Text: PropTypes.string.tag({
			label: "Button Text",
			description: "Text appearing on image button.",
			group: "Image 2",
		}).isRequired,
		link2Action: PropTypes.string.tag({
			label: "Button Click URL",
			description: "Destination URL when image button is clicked.",
			group: "Image 2",
		}).isRequired,
		link2TextVariant: PropTypes.oneOf(["dark", "light"]).tag({
			label: "Button Color",
			defaultValue: "dark",
			group: "Image 2",
		}),
		image3URL: PropTypes.string.tag({
			label: "Image URL",
			searchable: "image",
			description: "URL of first image, displayed at 4:3 aspect ratio on desktop displays.",
			group: "Image 3",
		}).isRequired,
		overlayText3: PropTypes.string.tag({
			label: "Overlay Text",
			description: "Overlay text appearing within the image.",
			group: "Image 3",
		}).isRequired,
		overlayText3Variant: PropTypes.oneOf(["dark", "light"]).tag({
			label: "Overlay Text Color",
			defaultValue: "dark",
			group: "Image 3",
		}),
		link3Text: PropTypes.string.tag({
			label: "Button Text",
			description: "Text appearing on image button.",
			group: "Image 3",
		}).isRequired,
		link3Action: PropTypes.string.tag({
			label: "Button Click URL",
			description: "Destination URL when image button is clicked.",
			group: "Image 3",
		}).isRequired,
		link3TextVariant: PropTypes.oneOf(["dark", "light"]).tag({
			label: "Button Color",
			defaultValue: "dark",
			group: "Image 3",
		}),
	}),
};

export default QuiltedImage;
