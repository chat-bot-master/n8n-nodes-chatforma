import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Chatforma implements ICredentialType {
	name = 'ChatformaApi';
	displayName = 'Chatforma API';
	documentationUrl = 'Chatforma';
	properties: INodeProperties[] = [
			{
					displayName: 'API Key',
					name: 'apiKey',
					type: 'string',
					default: '',
			},
	];
}
