import React from "react";
import { mount } from "enzyme";

import IdentityObject from "@arc-publishing/sdk-identity";

import useIdentity from "./Identity";

jest.mock("@arc-publishing/sdk-identity", () => ({
	__esModule: true,
	default: {
		apiOrigin: "",
		options: jest.fn(),
	},
}));

jest.mock("fusion:properties", () =>
	jest.fn(() => ({
		// arcSite
		api: {
			identity: {
				origin: "http://origin/",
			},
		},
	}))
);

jest.mock("fusion:context", () => ({
	__esModule: true,
	useFusionContext: () => ({
		arcSite: "Test Site",
	}),
}));

describe("Identity useIdentity Hook", () => {
	it("returns itself and changes the option to http://origin", () => {
		const Test = () => {
			const { Identity } = useIdentity();
			expect(Identity).toBe(IdentityObject);
			return <div />;
		};
		mount(<Test />);
		expect(IdentityObject.options).toHaveBeenLastCalledWith({
			apiOrigin: "http://origin/",
		});
	});

	it("initializes", () => {
		const testInitialization = jest.fn();

		const Test = () => {
			const { isInitialized } = useIdentity();
			testInitialization(isInitialized);
			return <div />;
		};

		mount(<Test />);

		expect(testInitialization).toHaveBeenCalledWith(false);
		expect(testInitialization).toHaveBeenLastCalledWith(true);
	});
	it("The getSignedInIdentity utility function returns the current signed in identity", () => {
		const testUser = {
			identities: [
				{
					userName: "93284374387433",
					passwordReset: false,
					type: "Facebook",
					lastLoginDate: 1639164734000,
					locked: false,
				},
				{
					userName: "106487204473538668210",
					passwordReset: false,
					type: "Google",
					lastLoginDate: 1639164736000,
					locked: false,
				},
			],
		};

		const Test = () => {
			const { getSignedInIdentity } = useIdentity();
			const getCurrent = getSignedInIdentity(testUser);
			return <div className={`${getCurrent.type}`} />;
		};

		const wrapper = mount(<Test />);

		expect(wrapper.find(".Google").exists()).toBe(true);
	});
});
