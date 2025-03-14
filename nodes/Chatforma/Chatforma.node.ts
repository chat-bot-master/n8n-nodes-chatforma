import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import axios, { AxiosRequestConfig } from 'axios';

export class Chatforma implements INodeType {
	description: INodeTypeDescription = {
			displayName: 'Chatforma',
			name: 'Chatforma',
			icon: 'file:Chatforma.png',
			group: ['transform'],
			version: 1,
			description: 'Consume Chatforma API',
			defaults: {
					name: 'Chatforma',
					color: '#1A82e2',
			},
			inputs: [NodeConnectionType.Main],
			outputs: [NodeConnectionType.Main],
			credentials: [
				{
					name: 'ChatformaApi',
					required: true,
				},
			],
			properties: [
				{
				displayName: 'Действие',
				name: 'action',
				type: 'options',
				options: [
					{
						name: 'Получить',
						value: 'get',
					},
					{
						name: 'Отправить',
						value: 'send',
					},
					{
						name: 'Добавить',
						value: 'add',
					},
					{
						name: 'Удалить',
						value: 'delete',
					},
				],
				default: 'get',
				required: true,
				description: 'Какое действие выполнить',
			},

			{
				displayName: 'Объект',
				name: 'params',
				type: 'options',
				displayOptions: {
					show: {
						action: [
							'get',
						],
					},
				},
				options: [
					{
						name: 'Боты',
						value: 'bots',
						description: 'Боты',
					},
					{
						name: 'Формы',
						value: 'forms',
						description: 'ForФормыms',
					},
					{
						name: 'Списки',
						value: 'lists',
						description: 'Списки',
					},
					{
						name: 'Пользователи',
						value: 'users',
						description: 'Пользователи',
					},
					{
						name: 'Диалоги',
						value: 'dialogs',
						description: 'Диалоги',
					},
					{
						name: 'Сообщения диалогов',
						value: 'dialogs_messages',
						description: 'Диалоги',
					},
				],
				default: 'bots',
				description: 'Что будем получать',
			},
			{
				displayName: 'Бот Id',
				name: 'list_bot_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						action: [
							'add', 'delete'
						],
					},
				},
				default:'0',
				description:'Бот ID для добавления',
			},
			{
				displayName: 'ID списка',
				name: 'list_list_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						action: [
							'add', 'delete'
						],
					},
				},
				default:'0',
				description:'Укажите Id списка для добавления',
			},
			{
				displayName: 'ID пользователя',
				name: 'list_user_id',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						action: [
							'add', 'delete'
						],
					},
				},
				default:'0',
				description:'Укажите BotUserId пользователя для добавления',
			},

			{
				displayName: 'Объект',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						action: [
							'send',
						],
					},
				},
				options: [
					{
						name: 'Текстовая рассылка списку',
						value: 'segment_dispatch',
						description: 'Отправить рассылку на выбранный список',
					},
					{
						name: 'Текстовая рассылка пользователю',
						value: 'dispatch',
						description: 'Отправить рассылку выбранному пользователю',
					},
					{
						name: 'Сообщение в диалог пользователю',
						value: 'message_to_dialog',
						description: 'Отправить сообщение выбранному пользователю',
					},
					{
						name: 'Сообщение пользователю',
						value: 'message',
						description: 'Отправить заданное в боте сообщение выбранному пользователю',
					},
				],
				default: 'segment_dispatch',
				description: 'Что будем отправлять',
			},
			{
				displayName: 'Бот Id',
				name: 'bot_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'segment_dispatch', 'dispatch','message_to_dialog','message'
						],
						action: [
							'send'
						],
					},
				},
				default:'0',
				description:'Бот ID',
			},
			{
				displayName: 'Бот ID',
				name: 'get_bot_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						params: [
							'forms', 'lists', 'dialogs','dialogs_messages', 'users'
						],
						action: [
							'get'
						],
					},
				},
				default:'',
				description:'Бот ID',
			},
			{
				displayName: 'ID пользователя',
				name: 'get_user_id',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						params: [
							'dialogs_messages'
						],
						action: [
							'get'
						],
					},
				},
				default:'',
				description:'Бот ID',
			},

			{
				displayName: 'Список пользователей',
				name: 'list_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'segment_dispatch',
						],
						action: [
							'send',
						],
					},
				},
				default:'0',
				description:'Укажите ID списка пользователей',
			},
			{
				displayName: 'ID пользователя',
				name: 'user_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'dispatch', 'message_to_dialog','message'
						],
						action: [
							'send',
						],
					},
				},
				default:'0',
				description:'Укажите BotUserId пользователя',
			},
			{
				displayName: 'Текст сообщения',
				name: 'content',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'segment_dispatch', 'dispatch', 'message_to_dialog'
						],
						action: [
							'send',
						],
					},
				},
				default:'',
				description:'Текст отправляемого сообщения',
			},
			{
				displayName: 'ID сообщения',
				name: 'message_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'message'
						],
						action: [
							'send',
						],
					},
				},
				default:'',
				description:'ID отправляемого сообщения',
			},
			],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const resource = this.getNodeParameter('action', 0) as string;

		//Get credentials the user provided for this node
		const credentials = await this.getCredentials('ChatformaApi') as IDataObject;
		if (credentials === undefined) {
			throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
		}

		if (resource === 'send') {
			const operation = this.getNodeParameter('operation', 0) as string;
			if (operation === 'segment_dispatch') {
				// get email input
				const bot_id = this.getNodeParameter('bot_id', 0) as string;
				const list_id = this.getNodeParameter('list_id', 0) as string;
				const content = this.getNodeParameter('content', 0) as string;
				// get additional fields input

				//Make http request
				const options: AxiosRequestConfig = {
					headers: {
						'Accept': 'application/json',
						'api_key': `${credentials.apiKey}`,
					},
					method: 'POST',
					data: {
						content: `${content}`

					},
					url: `https://api.pro.chatforma.com/public/v1/bots/${bot_id}/segments/${list_id}/dispatch`,

				};

				responseData = await axios(options);
			}
			if (operation === 'dispatch') {
				// get email input
				const bot_id = this.getNodeParameter('bot_id', 0) as string;
				const user_id = this.getNodeParameter('user_id', 0) as string;
				const content = this.getNodeParameter('content', 0) as string;
				// get additional fields input

				//Make http request
				const options: AxiosRequestConfig = {
					headers: {
						'Accept': 'application/json',
						'api_key': `${credentials.apiKey}`,
					},
					method: 'POST',
					data: {
						content: `${content}`

					},
					url: `https://api.pro.chatforma.com/public/v1/bots/${bot_id}/dispatch/user/${user_id}`,

				};

				responseData = await axios(options);
			}
			if (operation === 'message_to_dialog') {
				// get email input
				const bot_id = this.getNodeParameter('bot_id', 0) as string;
				const user_id = this.getNodeParameter('user_id', 0) as string;
				const content = this.getNodeParameter('content', 0) as string;
				// get additional fields input




				//Make http request
				const options: AxiosRequestConfig = {
					headers: {
						'Accept': 'application/json',
						'api_key': `${credentials.apiKey}`,
					},
					method: 'POST',
					data: {
						message: `${content}`,
						uid: "123"

					},
					url: `https://api.pro.chatforma.com/public/v1/bots/${bot_id}/dialogs/${user_id}/message`,

				};

				responseData = await axios(options);
			}
			if (operation === 'message') {
				// get email input
				const bot_id = this.getNodeParameter('bot_id', 0) as string;
				const user_id = this.getNodeParameter('user_id', 0) as string;
				const message_id = this.getNodeParameter('message_id', 0) as string;
				// get additional fields input




				//Make http request
				const options: AxiosRequestConfig = {
					headers: {
						'Accept': 'application/json',
						'api_key': `${credentials.apiKey}`,
					},
					method: 'POST',

					url: `https://api.pro.chatforma.com/public/v1/bots/${bot_id}/user/${user_id}/message/${message_id}`,
				};

				responseData = await axios(options);
			}
		};

		if (resource === 'get') {
			const params = this.getNodeParameter('params', 0) as string;
			if (params === 'bots') {



				//Make http request
				const options: AxiosRequestConfig = {
					headers: {
						'Accept': 'application/json',
						'api_key': `${credentials.apiKey}`,
					},
					method: 'GET',
					url: `https://api.pro.chatforma.com/public/v1/bots/`,
				};

				responseData = await axios(options);
			};
			if (params === 'forms') {
				const bot_id = this.getNodeParameter('get_bot_id', 0) as string;



				//Make http request
				const options: AxiosRequestConfig = {
					headers: {
						'Accept': 'application/json',
						'api_key': `${credentials.apiKey}`,
					},
					method: 'GET',
					params: {
						botId: `${bot_id}`

					},
					url: `https://api.pro.chatforma.com/public/v1/forms/`,

				};

				responseData = await axios(options);
			};
			if (params === 'lists') {
				const bot_id = this.getNodeParameter('get_bot_id', 0) as string;



				//Make http request
				const options: AxiosRequestConfig = {
					headers: {
						'Accept': 'application/json',
						'api_key': `${credentials.apiKey}`,
					},
					method: 'GET',

					url: `https://api.pro.chatforma.com/public/v1/bots/${bot_id}/segments`,

				};

				responseData = await axios(options);
			};
			if (params === 'users') {
				const bot_id = this.getNodeParameter('get_bot_id', 0) as string;



				//Make http request
				const options: AxiosRequestConfig = {
					headers: {
						'Accept': 'application/json',
						'api_key': `${credentials.apiKey}`,
					},
					method: 'GET',
					params: {
						botId: `${bot_id}`

					},
					url: `https://api.pro.chatforma.com/public/v1/bots/${bot_id}/users`,

				};

				responseData = await axios(options);
			};
			if (params === 'dialogs') {
				const bot_id = this.getNodeParameter('get_bot_id', 0) as string;



				//Make http request
				const options: AxiosRequestConfig = {
					headers: {
						'Accept': 'application/json',
						'api_key': `${credentials.apiKey}`,
					},
					method: 'GET',
					params: {
						botId: `${bot_id}`

					},
					url: `https://api.pro.chatforma.com/public/v1/bots/${bot_id}/dialogs/users`,

				};

				responseData = await axios(options);
			};
			if (params === 'dialogs_messades') {
				const bot_id = this.getNodeParameter('get_bot_id', 0) as string;
				const user_id = this.getNodeParameter('get_user_id', 0) as number;



				//Make http request
				const options: AxiosRequestConfig = {
					headers: {
						'Accept': 'application/json',
						'api_key': `${credentials.apiKey}`,
					},
					method: 'GET',
					params: {
						botId: `${bot_id}`,
						userId: user_id

					},
					url: `https://api.pro.chatforma.com/public/v1/bots/${bot_id}/dialogs/${user_id}/messages`,

				};

				responseData = await axios(options);
			};
		};

		if (resource === 'add') {
			const bot_id = this.getNodeParameter('list_bot_id', 0) as string;
			const user_id = this.getNodeParameter('list_user_id', 0) as number;
			const list_id = this.getNodeParameter('list_list_id', 0) as string;



			//Make http request
			const options: AxiosRequestConfig = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'api_key': `${credentials.apiKey}`,
				},
				method: 'POST',
				params: {
					botId: `${bot_id}`,
					segmentId: `${list_id}`
				},
				data: {
					botUserId: user_id

				},
				url: `https://api.pro.chatforma.com/public/v1/bots/${bot_id}/segments/${list_id}/users`,

			};

			responseData = await axios(options);



		}
		if (resource === 'delete') {
			const bot_id = this.getNodeParameter('list_bot_id', 0) as string;
			const user_id = this.getNodeParameter('list_user_id', 0) as number;
			const list_id = this.getNodeParameter('list_list_id', 0) as string;

			// get email input
			//const bot_id = this.getNodeParameter('bot_id', 0) as string;

			//Make http request
			const options: AxiosRequestConfig = {
				headers: {
					'Accept': 'application/json',
					'api_key': `${credentials.apiKey}`,
				},
				method: 'DELETE',
				params: {
					botId: `${bot_id}`,
					segmentId: `${list_id}`
				},
				data: {
					botUserId: user_id

				},
				url: `https://api.pro.chatforma.com/public/v1/bots/${bot_id}/segments/${list_id}/users`,

			};

			responseData = await axios(options);



		}


		// Map data to n8n data

		return [this.helpers.returnJsonArray(responseData?.data ?? {})];
}
}
