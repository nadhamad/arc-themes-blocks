import React from "react";
import { mount } from "enzyme";
import getProperties from "fusion:properties";
import { useContent } from "fusion:content";
import Footer from "./default";

// A payload with 4 columns and 11 column items
const mockPayload = {
	children: [
		{
			_id: "terms-of-use",
			name: "Terms of Use",
			children: [
				{
					display_name: "Terms of Service",
					url: "www.some-website",
					_id: "column-item-1",
				},
				{
					display_name: "RSS Terms of Service",
					url: "www.some-website2",
					_id: "column-item-2",
				},
				{
					display_name: "Some other Terms of Service",
					url: "www.some-website3",
					_id: "column-item-3",
				},
			],
		},
		{
			_id: "contact-us",
			name: "Contact Us",
			children: [
				{
					display_name: "Phone",
					url: "www.phone.com",
					_id: "column-item-4",
				},
				{
					display_name: "Email",
					url: "www.email.com",
					_id: "column-item-5",
				},
				{
					display_name: "Fax",
					url: "www.who-uses-fax.com",
					_id: "column-item-6",
				},
			],
		},
		{
			_id: "about-us",
			name: "About Us",
			children: [
				{
					display_name: "Events",
					url: "www.events.com",
					_id: "column-item-7",
				},
				{
					display_name: "Careers",
					url: "www.plz-hire-me.com",
					_id: "column-item-8",
				},
				{
					display_name: "The Team",
					url: "www.the-world.com",
					_id: "column-item-9",
				},
				{
					display_name: "External Link",
					node_type: "link",
					url: "https://www.the-world.com",
					_id: "column-item-10",
				},
			],
		},
		{
			_id: "get-us",
			name: "", // empty name should not render due to accessibility requirement
			children: [
				{
					display_name: "Why Our Product",
					url: "www.plz-buy-our-products.com",
					_id: "column-item-11",
				},
				{
					display_name: "Pricing",
					url: "www.the-dollars.com",
					_id: "column-item-12",
				},
			],
		},
		{
			_id: "blank-column",
			name: "", // Empty string header name
			// no children items
		},
	],
};

jest.mock("@wpmedia/arc-themes-components", () => ({
	...jest.requireActual("@wpmedia/arc-themes-components"),
	isServerSide: jest.fn(() => true),
	Icon: ({ name }) => <div data-testid={name} />,
}));
jest.mock("@wpmedia/engine-theme-sdk", () => ({
	LazyLoad: ({ children }) => <>{children}</>,
}));
jest.mock("fusion:content", () => ({
	useContent: jest.fn(() => mockPayload),
}));
jest.mock("fusion:context", () => ({
	isAdmin: false,
	useFusionContext: jest.fn(() => ({
		contextPath: "pf",
		deployment: jest.fn((path) => path),
	})),
}));
jest.mock("fusion:properties", () => jest.fn(() => ({})));
jest.mock("fusion:themes", () => jest.fn(() => ({})));

describe("the footer feature for the default output type", () => {
	afterEach(() => {
		jest.resetModules();
	});

	beforeEach(() => {
		jest.mock("fusion:context", () => ({
			useFusionContext: jest.fn(() => ({
				arcSite: "the-sun",
				id: "testId",
			})),
		}));
	});

	it("should return null if lazyLoad on the server and not in the admin", () => {
		const config = {
			lazyLoad: true,
		};
		const wrapper = mount(<Footer customFields={config} />);
		expect(wrapper.html()).toBe(null);
	});

	it("should have 5 column headers", () => {
		const wrapper = mount(
			<Footer
				customFields={{
					navigationConfig: {
						contentService: "footer-service",
						contentConfiguration: {},
					},
				}}
			/>
		);

		// there are only 4 columns with any non-empty string data
		// two of the 5 objects have empty string names
		// therefore those h4 elements should not render if no content is present
		expect(wrapper.find("Heading")).toHaveLength(3);
	});

	it("should have 12 column items", () => {
		const wrapper = mount(
			<Footer
				customFields={{
					navigationConfig: {
						contentService: "footer-service",
						contentConfiguration: {},
					},
				}}
			/>
		);

		expect(wrapper.find("Link")).toHaveLength(12);
	});

	it("should have a link with target blank if is an absolute link with (http(s))", () => {
		const wrapper = mount(
			<Footer
				customFields={{
					navigationConfig: {
						contentService: "footer-service",
						contentConfiguration: {},
					},
				}}
			/>
		);

		expect(wrapper.find('a[target="_blank"]')).toHaveLength(1);
	});

	it("should have empty column when empty payload is given", () => {
		const wrapper = mount(
			<Footer
				customFields={{
					navigationConfig: {
						contentService: "footer-service",
						contentConfiguration: {},
					},
				}}
			/>
		);

		jest.mock("fusion:content", () => ({
			useContent: jest.fn(() => ({})),
		}));

		expect(wrapper.find(".b_footer__links-group")).toHaveLength(0);
	});

	it("should have empty column without error when undefined payload is given", () => {
		const wrapper = mount(
			<Footer
				customFields={{
					navigationConfig: {
						contentService: "footer-service",
						contentConfiguration: {},
					},
				}}
			/>
		);

		jest.mock("fusion:content", () => ({
			useContent: jest.fn(() => undefined),
		}));

		expect(wrapper.find(".b_footer__links-group")).toHaveLength(0);
	});

	describe("the content source configuration", () => {
		it("should have a default set of query values", () => {
			mount(
				<Footer
					customFields={{
						navigationConfig: {
							contentService: "footer-service",
							contentConfigValues: {},
						},
					}}
				/>
			);

			expect(useContent).toHaveBeenCalledWith({
				query: {
					hierarchy: "footer",
					feature: "footer",
				},
				source: "footer-service",
				filter: expect.any(String),
			});
		});

		it("should overwrite those values with configured values", () => {
			mount(
				<Footer
					customFields={{
						navigationConfig: {
							contentService: "footer-service",
							contentConfigValues: {
								hierarchy: "not-a-footer",
								extraval: 11111,
							},
						},
					}}
				/>
			);

			expect(useContent).toHaveBeenCalledWith({
				query: {
					hierarchy: "not-a-footer",
					extraval: 11111,
					feature: "footer",
				},
				source: "footer-service",
				filter: expect.any(String),
			});
		});
	});

	describe("the footer image/logo", () => {
		describe("when the theme manifest provides a logo url", () => {
			it("should make the relative src of the logo the provided image", () => {
				getProperties.mockImplementation(() => ({ locale: "en", primaryLogo: "my-nav-logo.svg" }));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find("img.b-footer__logo")).toHaveProp("src", "pf/my-nav-logo.svg");
			});

			it("should make the absolute src of the logo the provided image", () => {
				getProperties.mockImplementation(() => ({
					locale: "en",
					primaryLogo: "http://test/my-nav-logo.svg",
				}));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find("img.b-footer__logo")).toHaveProp("src", "http://test/my-nav-logo.svg");
			});

			it("should make the base64 src of the logo the provided image", () => {
				getProperties.mockImplementation(() => ({
					locale: "en",
					primaryLogo: "base64:my-nav-logo.svg",
				}));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find("img.b-footer__logo")).toHaveProp("src", "base64:my-nav-logo.svg");
			});

			describe("when the theme manifest provides alt text", () => {
				it("should make the alt text of the logo the provided text", () => {
					getProperties.mockImplementation(() => ({
						locale: "en",
						primaryLogo: "my-nav-logo.svg",
						primaryLogoAlt: "my alt text",
					}));
					const wrapper = mount(
						<Footer
							customFields={{
								navigationConfig: {
									contentService: "footer-service",
									contentConfiguration: {},
								},
							}}
						/>
					);

					expect(wrapper.find("img.b-footer__logo")).toHaveProp("alt", "my alt text");
				});
			});

			describe("when the theme manifest does not provide alt text", () => {
				it("should make the alt text of the logo blank when not supplied", () => {
					getProperties.mockImplementation(() => ({
						locale: "en",
						primaryLogo: "my-nav-logo.svg",
					}));
					const wrapper = mount(
						<Footer
							customFields={{
								navigationConfig: {
									contentService: "footer-service",
									contentConfiguration: {},
								},
							}}
						/>
					);

					expect(wrapper.find("img.b-footer__logo")).toHaveProp("alt", "");
				});
			});
		});

		describe("when the theme manifest provides a light logo url", () => {
			it("should use the light logo over the primary logo", () => {
				getProperties.mockImplementation(() => ({
					locale: "en",
					lightBackgroundLogo: "light.svg",
					primaryLogo: "primary.svg",
				}));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find("img.b-footer__logo")).toHaveProp("src", "pf/light.svg");
			});

			it("should make the relative src of the logo the provided image", () => {
				getProperties.mockImplementation(() => ({
					locale: "en",
					lightBackgroundLogo: "my-nav-logo.svg",
				}));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find("img.b-footer__logo")).toHaveProp("src", "pf/my-nav-logo.svg");
			});

			it("should make the absolute src of the logo the provided image", () => {
				getProperties.mockImplementation(() => ({
					locale: "en",
					lightBackgroundLogo: "http://test/my-nav-logo.svg",
				}));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find("img.b-footer__logo")).toHaveProp("src", "http://test/my-nav-logo.svg");
			});

			it("should make the base64 src of the logo the provided image", () => {
				getProperties.mockImplementation(() => ({
					locale: "en",
					lightBackgroundLogo: "base64:my-nav-logo.svg",
				}));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find("img.b-footer__logo")).toHaveProp("src", "base64:my-nav-logo.svg");
			});

			describe("when the theme manifest provides alt text", () => {
				it("should make the alt text of the logo the provided text", () => {
					getProperties.mockImplementation(() => ({
						locale: "en",
						lightBackgroundLogo: "my-nav-logo.svg",
						lightBackgroundLogoAlt: "my alt text",
					}));
					const wrapper = mount(
						<Footer
							customFields={{
								navigationConfig: {
									contentService: "footer-service",
									contentConfiguration: {},
								},
							}}
						/>
					);

					expect(wrapper.find("img.b-footer__logo")).toHaveProp("alt", "my alt text");
				});

				it("should use the light alt text over the primary alt text", () => {
					getProperties.mockImplementation(() => ({
						locale: "en",
						lightBackgroundLogo: "my-nav-logo.svg",
						lightBackgroundLogoAlt: "light",
						primaryLogoAlt: "primary",
					}));
					const wrapper = mount(
						<Footer
							customFields={{
								navigationConfig: {
									contentService: "footer-service",
									contentConfiguration: {},
								},
							}}
						/>
					);

					expect(wrapper.find("img.b-footer__logo")).toHaveProp("alt", "light");
				});
			});

			describe("when the theme manifest does not provide alt text", () => {
				it("should make the alt text of the logo blank", () => {
					getProperties.mockImplementation(() => ({
						locale: "en",
						lightBackgroundLogo: "my-nav-logo.svg",
					}));
					const wrapper = mount(
						<Footer
							customFields={{
								navigationConfig: {
									contentService: "footer-service",
									contentConfiguration: {},
								},
							}}
						/>
					);

					expect(wrapper.find("img.b-footer__logo")).toHaveProp("alt", "");
				});
			});
		});

		describe("when the theme does not provide a logo url", () => {
			it("should not render the primary logo div", () => {
				getProperties.mockImplementation(() => ({ locale: "en" }));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find("MediaItem")).toHaveLength(0);
			});
		});
	});

	describe("the copyright text", () => {
		describe("when copyright text is provided", () => {
			it("should show copyright text", () => {
				getProperties.mockImplementation(() => ({
					locale: "en",
					copyrightText: "my copyright text",
				}));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find(".b-footer__top-container p").text()).toStrictEqual(
					"my copyright text"
				);
			});
		});

		describe("when copyright text is not provided", () => {
			it("should not show copyright text", () => {
				getProperties.mockImplementation(() => ({ locale: "en" }));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find(".b-footer__top-container p").text()).toStrictEqual("");
			});
		});
	});

	describe("the social media buttons", () => {
		describe("when a facebook page is provided", () => {
			it("should show a facebook button with the proper url", () => {
				getProperties.mockImplementation(() => ({ locale: "en", facebookPage: "thesun" }));

				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(
					wrapper.find(`Link[supplementalText="footer-block.facebook-link"] > a`)
				).toHaveLength(1);
				expect(
					wrapper.find(`Link[supplementalText="footer-block.facebook-link"] > a`).prop("href")
				).toEqual("thesun");
			});
		});

		describe("when a facebook page is not provided", () => {
			it("should not show a facebook button", () => {
				getProperties.mockImplementation(() => ({ locale: "en", facebookPage: "" }));

				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(
					wrapper.find(`Link[supplementalText="footer-block.facebook-link"] > a`)
				).toHaveLength(0);
			});
		});

		describe("when a twitter username is provided", () => {
			it("should show a twitter button with the proper url", () => {
				getProperties.mockImplementation(() => ({ locale: "en", twitterUsername: "thesun" }));

				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find(`Link[supplementalText="footer-block.twitter-link"] > a`)).toHaveLength(
					1
				);
				expect(
					wrapper.find(`Link[supplementalText="footer-block.twitter-link"] > a`).prop("href")
				).toEqual("https://twitter.com/thesun");
			});
		});

		describe("when a twitter username is not provided", () => {
			it("should not show a twitter button", () => {
				getProperties.mockImplementation(() => ({ locale: "en", twitterUsername: "" }));

				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find(`Link[supplementalText="footer-block.twitter-link"] > a`)).toHaveLength(
					0
				);
			});
		});

		describe("when a rss link is provided", () => {
			it("should show a rss button with the proper url", () => {
				getProperties.mockImplementation(() => ({ locale: "en", rssUrl: "thesun" }));

				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find(`Link[supplementalText="footer-block.rss-link"] > a`)).toHaveLength(1);
				expect(
					wrapper.find(`Link[supplementalText="footer-block.rss-link"] > a`).prop("href")
				).toEqual("thesun");
			});
		});

		describe("when a rss link is not provided", () => {
			it("should not show a rss button", () => {
				getProperties.mockImplementation(() => ({ locale: "en", rssUrl: "" }));

				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);

				expect(wrapper.find(`Link[supplementalText="footer-block.rss-link"] > a`)).toHaveLength(0);
			});
		});

		describe("when no social site properties are provided", () => {
			it("should render no social buttons and no border on container", () => {
				getProperties.mockImplementation(() => ({
					locale: "en",
					facebookPage: "",
					twitterUsername: "",
					rssUrl: "",
				}));
				const wrapper = mount(
					<Footer
						customFields={{
							navigationConfig: {
								contentService: "footer-service",
								contentConfiguration: {},
							},
						}}
					/>
				);
				expect(
					wrapper.find(`Link[supplementalText="footer-block.facebook-link"] > a`)
				).toHaveLength(0);
				expect(wrapper.find(`Link[supplementalText="footer-block.twitter-link"] > a`)).toHaveLength(
					0
				);
				expect(wrapper.find(`Link[supplementalText="footer-block.rss-link"] > a`)).toHaveLength(0);
				const container = wrapper.find(".b-footer__social-links");
				expect(container).toBeDefined();
				expect(container.find("Link").length).toBe(0);
			});
		});
	});
});
