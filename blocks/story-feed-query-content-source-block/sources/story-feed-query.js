import axios from "axios";
import { ARC_ACCESS_TOKEN, CONTENT_BASE, RESIZER_APP_VERSION } from "fusion:environment";

import signImagesInANSObject from "@wpmedia/arc-themes-components/src/utils/sign-images-in-ans-object";
import { fetch as resizerFetch } from "@wpmedia/signing-service-content-source-block";

const params = [
	{
		displayName: "offset",
		name: "offset",
		type: "number",
	},
	{
		displayName: "query",
		name: "query",
		type: "text",
	},
	{
		displayName: "size",
		name: "size",
		type: "number",
	},
	{
		default: "2",
		displayName: "Themes Version",
		name: "themes",
		type: "text",
	},
];

const fetch = (
	{ query: q = "*", size = 8, offset: from = 0, "arc-site": website },
	{ cachedCall }
) => {
	const urlSearch = new URLSearchParams({
		from,
		q,
		size,
		sort: "display_date:desc",
		website,
	});

	return axios({
		url: `${CONTENT_BASE}/content/v4/search/published?${urlSearch.toString()}`,
		headers: {
			"content-type": "application/json",
			Authorization: `Bearer ${ARC_ACCESS_TOKEN}`,
		},
		method: "GET",
	})
		.then(signImagesInANSObject(cachedCall, resizerFetch, RESIZER_APP_VERSION))
		.then(({ data }) => data);
};

export default {
	fetch,
	params,
	schemaName: "ans-feed",
};
