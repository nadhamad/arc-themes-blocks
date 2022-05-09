import React from "react";
import PropTypes from "prop-types";
import { useAppContext } from "fusion:context";
import "./default.scss";
import { Stack } from "@wpmedia/arc-themes-components";

const LAYOUT_CLASS_NAME = "b-right-rail";

const useFeatueList = () => {
	const { renderables } = useAppContext();
	const featureList = {};
	renderables.forEach((renderable) => {
		if (renderable.collection === "sections") {
			featureList[renderable.props.id] = renderable.children.length || 0;
		}
	});
	return featureList;
};

const RightRailLayout = ({ children }) => {
	const [navigation, fullWidth1, main, rightRail, fullWidth2, footer] = children;
	const featureList = useFeatueList();

	return (
		<Stack className={LAYOUT_CLASS_NAME}>
			<Stack role="banner" className="page-header">
				{navigation}
			</Stack>
			<section role="main" id="main" className="main" tabIndex="-1">
				<div className="container layout-section">
					<div className="row">
						<div className="col-sm-xl-12 layout-section wrap-bottom">{fullWidth1}</div>
					</div>

					<div className="row">
						<div className="col-sm-md-12 col-lg-xl-8 left-article-section ie-flex-100-percent-sm layout-section">
							{main}
						</div>
						<aside className="col-sm-md-12 col-lg-xl-4 right-article-section ie-flex-100-percent-sm layout-section wrap-bottom">
							{rightRail}
						</aside>
					</div>

					{featureList["4"] > 0 && (
						<div className="row">
							<div className="col-sm-xl-12 layout-section wrap-bottom">{fullWidth2}</div>
						</div>
					)}
				</div>
			</section>
			<footer>{footer}</footer>
		</Stack>
	);
};

RightRailLayout.propTypes = {
	children: PropTypes.array,
};

RightRailLayout.sections = [
	"navigation",
	"fullwidth1",
	"main",
	"rightrail",
	"fullwidth2",
	"footer",
];

RightRailLayout.label = "Right Rail – Arc Layout";

export default RightRailLayout;
