import React, { useRef } from "react";
import PropTypes from "@arc-fusion/prop-types";
import { Button, BUTTON_STYLES, BUTTON_SIZES, PrimaryFont } from "@wpmedia/shared-styles";
import { ErrorIcon } from "@wpmedia/engine-theme-sdk";

import "./styles.scss";

const HeadlinedSubmitForm = ({
	children,
	headline,
	buttonLabel,
	formErrorText,
	onSubmit = () => {},
}) => {
	const formRef = useRef();

	const handleSubmit = (event) => {
		event.preventDefault();

		const valid = formRef.current.checkValidity();
		if (valid) {
			const namedFields = Array.from(formRef.current.elements)
				.filter((element) => element?.name && typeof element?.name !== "undefined")
				.reduce(
					(accumulator, element) => ({
						...accumulator,
						[element.name]: element.value,
					}),
					{}
				);
			onSubmit(namedFields);
		}
	};

	return (
		<section>
			<PrimaryFont as="h2" className="xpmedia-form-headline">
				{headline}
			</PrimaryFont>
			<form
				aria-label={headline}
				className="xpmedia-form-submittable"
				onSubmit={handleSubmit}
				ref={formRef}
			>
				{children}
				<Button
					buttonSize={BUTTON_SIZES.MEDIUM}
					buttonStyle={BUTTON_STYLES.PRIMARY}
					fullWidth
					text={buttonLabel}
					type="submit"
				/>
				{formErrorText ? (
					<section className="xpmedia-form-error" role="alert">
						<PrimaryFont as="p">
							<ErrorIcon />
							{formErrorText}
						</PrimaryFont>
					</section>
				) : null}
			</form>
		</section>
	);
};

HeadlinedSubmitForm.propTypes = {
	headline: PropTypes.string.isRequired,
	buttonLabel: PropTypes.string.isRequired,
	onSubmit: PropTypes.func,
};

export default HeadlinedSubmitForm;
