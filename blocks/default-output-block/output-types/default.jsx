import React, { Fragment } from "react";
import getProperties from "fusion:properties";
import { useFusionContext } from "fusion:context";
import { MetaData } from "@wpmedia/engine-theme-sdk";
import { Stack, usePhrases } from "@wpmedia/arc-themes-components";

import blocks from "~/blocks.json";

const querylyCode = (querylyId, querylyOrg, pageType) => {
	if (!querylyId) {
		return null;
	}
	return (
		<Fragment key="querylySearch">
			<script defer data-integration="queryly" src="https://www.queryly.com/js/queryly.v4.min.js" />
			{pageType === "queryly-search" ? (
				<script
					defer
					data-integration="queryly"
					src={`https://www.queryly.com/js/${querylyOrg}-advanced-search.js`}
				/>
			) : null}
		</Fragment>
	);
};

const comscoreNoScript = (accountId) => {
	if (!accountId) {
		return null;
	}
	return (
		<noscript data-integration="comscore">
			<img
				alt="comscore"
				src={`https://sb.scorecardresearch.com/p?c1=2&c2=${accountId}&cv=2.0&cj=1`}
			/>
		</noscript>
	);
};

const googleTagManagerNoScript = (gtmID) => {
	if (!gtmID) {
		return null;
	}
	return (
		<noscript>
			<iframe
				title="gtm"
				src={`https://www.googletagmanager.com/ns.html?id=${gtmID}`}
				height="0"
				width="0"
				style={{
					display: "none",
					visibility: "hidden",
				}}
			/>
		</noscript>
	);
};

const optimalFontLoading = (fontUrl, index = "") => (
	<Fragment key={`fontLinkPreload_${fontUrl}_${index}`}>
		<link rel="preload" as="style" href={fontUrl} />
		<link rel="stylesheet" data-testid={`font-loading-url-${index}`} href={fontUrl} />
	</Fragment>
);

const fontUrlLink = (fontUrl) => {
	// If fontURL is an array, then iterate over the array and build out the links
	if (fontUrl && Array.isArray(fontUrl) && fontUrl.length > 0) {
		const fontLinks = [...new Set(fontUrl)].map((url, index) => optimalFontLoading(url, index));

		return fontLinks;
	}
	// Legacy support where fontUrl is a string
	return fontUrl ? optimalFontLoading(fontUrl) : "";
};

const SampleOutputType = ({
	children,
	contextPath,
	deployment,
	CssLinks,
	Fusion,
	Libs,
	MetaTag,
	MetaTags,
	metaValue,
}) => {
	const { globalContent, arcSite, requestUri } = useFusionContext();
	const {
		api,
		websiteName,
		websiteDomain,
		twitterUsername,
		gtmID,
		gaID,
		dangerouslyInjectJS = [],
		fontUrl,
		resizerURL,
		facebookAdmins,
		nativoIntegration,
		chartbeatAccountId,
		chartbeatDomain,
		fallbackImage,
		comscoreID,
		querylyId,
		querylyOrg,
		locale,
	} = getProperties(arcSite);

	const chartbeatInline = `
    (function() {
      var _sf_async_config = window._sf_async_config = (window._sf_async_config || {});
      _sf_async_config.uid = ${chartbeatAccountId};
      _sf_async_config.domain = "${chartbeatDomain}";
      _sf_async_config.useCanonical = true;
      _sf_async_config.useCanonicalDomain = true;
      _sf_async_config.sections = '';
      _sf_async_config.authors = '';
    })();
  `;
	const scriptCodeInline = `
    var _comscore = _comscore || []; _comscore.push({ c1: "2", c2: "${comscoreID}" });
  `;
	const gaScriptInline = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());gtag('config', '${gaID}');
  `;
	const gtmScriptInline = `
    (function(w,d,s,l,i){
      w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmID}');
  `;
	const querylyInline = `
    window.addEventListener('DOMContentLoaded', (event) => {
      queryly.init("${querylyId}", document.querySelectorAll("#fusion-app"));
    });
  `;

	const inlineScripts = [
		...new Set([
			...dangerouslyInjectJS,
			...(chartbeatAccountId && chartbeatDomain ? [chartbeatInline] : []),
			...(comscoreID ? [scriptCodeInline] : []),
			...(gaID ? [gaScriptInline] : []),
			...(gtmID ? [gtmScriptInline] : []),
			...(querylyId ? [querylyInline] : []),
			"window.isIE = !!window.MSInputMethodContext && !!document.documentMode;", // Not sure window.isIE is even used.
		]),
	].join(";");

	const phrases = usePhrases();

	return (
		<html lang={locale}>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="icon"
					type="image/x-icon"
					href={deployment(`${contextPath}/resources/favicon.ico`)}
				/>
				<MetaData
					arcSite={arcSite}
					canonicalDomain={
						/*
						 * Overriding specific page types here for primary website article sources if available
						 * author, homepage, *search, section, and tag will still go to the current site domain
						 */
						metaValue("page-type")?.match(/^(article|gallery|video)$/)
							? getProperties(globalContent?.canonical_website)?.websiteDomain || null
							: null
					}
					facebookAdmins={facebookAdmins}
					fallbackImage={fallbackImage}
					globalContent={globalContent}
					outputCanonicalLink
					MetaTag={MetaTag}
					MetaTags={MetaTags}
					metaValue={metaValue}
					requestUri={requestUri}
					resizerURL={resizerURL}
					twitterUsername={twitterUsername}
					websiteName={websiteName}
					websiteDomain={websiteDomain}
				/>
				{fontUrlLink(fontUrl)}
				<CssLinks />
				<Libs />
				<script
					async
					src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver%2CElement.prototype.prepend%2CElement.prototype.remove%2CArray.prototype.find%2CArray.prototype.includes"
				/>
				<script
					data-integration="inlineScripts"
					dangerouslySetInnerHTML={{ __html: inlineScripts }}
				/>
				{gaID ? (
					<script
						key={gaID}
						async
						data-integration="googleAnalyticsTag"
						src={`https://www.googletagmanager.com/gtag/js?id=${gaID}`}
					/>
				) : null}
				{nativoIntegration ? (
					<script
						key="nativo-ad"
						async
						data-integration="nativo-ad"
						src="https://s.ntv.io/serve/load.js"
					/>
				) : null}
				{chartbeatAccountId && chartbeatDomain ? (
					<script
						key={`chartBeat_${chartbeatAccountId}`}
						async
						data-integration="chartbeat"
						src="https://static.chartbeat.com/js/chartbeat.js"
					/>
				) : null}
				{comscoreID ? (
					<script
						key={`comScore_${comscoreID}`}
						async
						data-integration="comscore"
						src="https://sb.scorecardresearch.com/beacon.js"
					/>
				) : null}
				{api?.retail?.script ? (
					<script key="retailScript" defer data-integration="arcp" src={api?.retail?.script} />
				) : null}
				{querylyCode(querylyId, querylyOrg, metaValue("page-type"))}
			</head>
			<body>
				{comscoreNoScript(comscoreID)}
				{googleTagManagerNoScript(gtmID)}
				<a className="skip-main" href="#main">
					{phrases.t("default-output-block.skip-main")}
				</a>
				<Stack id="fusion-app" className="b-application">
					{children}
				</Stack>
				<Fusion />
			</body>
		</html>
	);
};

// if publisher wants no sites to be spa
// then they do nothing. spaSites will be falsy undefined and fallsback to spa true,
//  which won't do anything in isolation

// if publisher wants all sites to be spa
// then they set environment "FUSION_SERVICE_WORKER": true and use 2.8
//  spaSites will be falsy undefined and fallback to spa true

// if publisher wants to select which sites are spa
// then set environment "FUSION_SERVICE_WORKER": true and use 2.8
//    and set in blocks.json spaSites: ["target-site-id"].
//    spaSites will be a truthy array and set itself

// fallback to true to ensure all site ids don't have to copy-pasted to blocks.json
export function configureSinglePageApp(spaSites) {
	return spaSites || true;
}

SampleOutputType.spa = configureSinglePageApp(blocks.spaSites);

export default SampleOutputType;
