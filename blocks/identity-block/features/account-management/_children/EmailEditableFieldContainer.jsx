import React, { useState } from "react";
import { useFusionContext } from "fusion:context";
import getProperties from "fusion:properties";
import getTranslatedPhrases from "fusion:intl";
import { FIELD_TYPES, FormInputField } from "@wpmedia/shared-styles";
import { useIdentity } from "../../..";
import EditableFieldPresentational from "../../../components/EditableFormInputField";

function EmailEditableFieldContainer({ email, setEmail }) {
	const [formErrorText, setFormErrorText] = useState(null);

	const { arcSite } = useFusionContext();
	const { locale } = getProperties(arcSite);
	const phrases = getTranslatedPhrases(locale);
	const { Identity } = useIdentity();

	const formEmailLabel = phrases.t("identity-block.email");
	const emailRequirements = phrases.t("identity-block.email-requirements");
	const editText = phrases.t("identity-block.edit");
	const saveText = phrases.t("identity-block.save");
	const cancelText = phrases.t("identity-block.cancel");
	const emailError = phrases.t("identity-block.update-email-error");

	const handleEmailUpdate = ({ email: newEmail }) =>
		Identity.updateUserProfile({ email: newEmail })
			.then((profileObject) => {
				setEmail(profileObject.email);
			})
			.catch(() => {
				setFormErrorText(emailError);
				throw new Error();
			});

	const handleCancelEdit = () => {
		setFormErrorText(null);
	};

	return (
		<EditableFieldPresentational
			initialValue={email}
			label={formEmailLabel}
			editText={editText}
			onSubmit={handleEmailUpdate}
			saveText={saveText}
			cancelText={cancelText}
			formErrorText={formErrorText}
			cancelEdit={handleCancelEdit}
		>
			<FormInputField
				type={FIELD_TYPES.EMAIL}
				label={formEmailLabel}
				defaultValue={email}
				showDefaultError={false}
				required
				autoComplete="email"
				name="email"
				validationErrorMessage={emailRequirements}
			/>
		</EditableFieldPresentational>
	);
}

export default EmailEditableFieldContainer;
