import { IResJson } from './common';

export interface createTemplateReqBody {
	TemplateName: string;

	/**
	 * Subject is actually not mandatory, but we are making it mandatory
	 * as subject is mandatory in our use case
	 */
	SubjectPart: string;
	HtmlPart?: string;
	TextPart?: string;
}

export interface createTemplateResJson extends IResJson {
	Template: {
		TemplateName: string;
	};
	message: string;
}

export interface createTemplateResErrorJson extends IResJson {}
