export interface CapSolverOptions {
	/** Your developer appId, Apply in dashboard's developer section */
	appId?: string;
	/** Whether to print the current status */
	verbose?: boolean;
	/** The identifier of the current instance, used to distinguish between multiple instances */
	verboseIdentifier?: string;
}

export interface ImageToTextTask {
	type: 'ImageToTextTask';
	/** Base64 encoded content of the image (no newlines, no data:image/****;base64, content) */
	body: string | Buffer;
	/** Specifies the module */
	module?:
		| 'mtcaptcha'
		| 'dell'
		| 'queueit'
		| 'amazon'
		| 'amazon-gif'
		| 'common'
		| 'mark'
		| 'queue-it'
		| 'io-bs-mou'
		| 'cargo'
		| 'webde-login'
		| 'webde-register'
		| 'webde-imap'
		| 'cybersiara'
		| 'enzo'
		| 'euro';
	/** 0.8 ~ 1, Identify the matching degree. If the recognition rate is not within the range, no deduction */
	score?: number;
	/** Case sensitive or not */
	case?: boolean;
}

export interface HCaptchaClassification {
	type: 'HCaptchaClassification';
	/** Base64 encoded images, do not include "data:image/***; base64,". Assembles the pictures as a list: [base64, base64, ...] */
	queries: (string | Buffer)[];
	/** English is supported only. Please convert other languages by yourself */
	question: string;
}

export interface FunCaptchaClassification {
	type: 'FunCaptchaClassification';
	/** Base64 encoded image, can be a screenshot (pass only the hexagonal image, do not pass the rest of the content) */
	images: string | Buffer;
	/** Question name. This param value from API response game_variant field. Example: maze, maze2, flockCompass, 3d_rollball_animals */
	question: string;
}

export interface ReCaptchaV2Classification {
	type: 'ReCaptchaV2Classification';
	/** Base64 image string */
	image: string | Buffer;
	/** Please refer to the list of questions at https://docs.capsolver.com/guide/recognition/ReCaptchaClassification.html */
	question: string;
}

export interface AwsWafClassification {
	type: 'AwsWafClassification';
	/** Base64 image strings */
	images: (string | Buffer)[];
	/** For full names of questions, please refer to the list of questions at https://docs.capsolver.com/guide/recognition/AwsWafClassification.html */
	question: string;
}

export type RecognitionTask =
	| ImageToTextTask
	| HCaptchaClassification
	| FunCaptchaClassification
	| ReCaptchaV2Classification
	| AwsWafClassification;

export interface HCaptchaTask {
	type: 'HCaptchaTask' | 'HCaptchaTurboTask';
	/** Web address of the website using hCaptcha (e.g., https://google.com) */
	websiteURL: string;
	/** The domain public key (e.g., b989d9e8-0d14-41sda0-870f-97b5283ba67d) */
	websiteKey: string;
	/** Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html */
	proxy: string;
	/** Set true if it's an invisible captcha */
	isInvisible?: boolean;
	/** If your proxy is IPv6, please set to true */
	enableIPV6?: boolean;
	/** Custom data that is used in some implementations of hCaptcha Enterprise */
	enterprisePayload?: object;
	/** Browser's User-Agent which is used in emulation */
	userAgent?: string;
}

export interface HCaptchaTaskProxyLess {
	type: 'HCaptchaTaskProxyLess';
	websiteURL: string;
	websiteKey: string;
	isInvisible?: boolean;
	enableIPV6?: boolean;
	enterprisePayload?: object;
	userAgent?: string;
}

export type HCaptcha = HCaptchaTask | HCaptchaTaskProxyLess;

export interface FunCaptchaTask {
	type: 'FunCaptchaTask';
	websiteURL: string;
	websitePublicKey: string;
	proxy: string;
	funcaptchaApiJSSubdomain?: string;
	data?: string;
}

export interface FunCaptchaTaskProxyLess {
	type: 'FunCaptchaTaskProxyLess';
	websiteURL: string;
	websitePublicKey: string;
	funcaptchaApiJSSubdomain?: string;
	data?: string;
}

export type FunCaptcha = FunCaptchaTask | FunCaptchaTaskProxyLess;

export interface GeeTestTask {
	type: 'GeeTestTask';
	websiteURL: string;
	gt: string;
	challenge: string;
	proxy: string;
	captchaId?: string;
	geetestApiServerSubdomain?: string;
}

export interface GeeTestTaskProxyLess {
	type: 'GeeTestTaskProxyLess';
	websiteURL: string;
	gt: string;
	challenge: string;
	captchaId?: string;
	geetestApiServerSubdomain?: string;
}

export type GeeTest = GeeTestTask | GeeTestTaskProxyLess;

export interface Cookie {
	name: string;
	value: string;
}

export interface ReCaptchaV2Task {
	type: 'ReCaptchaV2Task';
	websiteURL: string;
	websiteKey: string;
	proxy: string;
	isInvisible?: boolean;
	userAgent?: string;
	cookies?: Cookie[];
}

export interface ReCaptchaV2TaskProxyLess {
	type: 'ReCaptchaV2TaskProxyLess';
	websiteURL: string;
	websiteKey: string;
	isInvisible?: boolean;
	userAgent?: string;
	cookies?: Cookie[];
}

export interface ReCaptchaV2EnterpriseTask {
	type: 'ReCaptchaV2EnterpriseTask';
	websiteURL: string;
	websiteKey: string;
	proxy: string;
	enterprisePayload?: object;
	isInvisible?: boolean;
	apiDomain?: string;
	userAgent?: string;
	cookies?: Cookie[];
}

export interface ReCaptchaV2EnterpriseTaskProxyLess {
	type: 'ReCaptchaV2EnterpriseTaskProxyLess';
	websiteURL: string;
	websiteKey: string;
	enterprisePayload?: object;
	isInvisible?: boolean;
	apiDomain?: string;
	userAgent?: string;
	cookies?: Cookie[];
}

export type ReCaptchaV2 =
	| ReCaptchaV2Task
	| ReCaptchaV2TaskProxyLess
	| ReCaptchaV2EnterpriseTask
	| ReCaptchaV2EnterpriseTaskProxyLess;

export interface ReCaptchaV3Task {
	type: 'ReCaptchaV3Task';
	websiteURL: string;
	websiteKey: string;
	pageAction: string;
	minScore?: number;
	proxy: string;
	userAgent?: string;
	cookies?: Cookie[];
}

export interface ReCaptchaV3TaskProxyLess {
	type: 'ReCaptchaV3TaskProxyLess';
	websiteURL: string;
	websiteKey: string;
	pageAction: string;
	minScore?: number;
	userAgent?: string;
	cookies?: Cookie[];
}

export interface ReCaptchaV3EnterpriseTask {
	type: 'ReCaptchaV3EnterpriseTask';
	websiteURL: string;
	websiteKey: string;
	pageAction: string;
	minScore?: number;
	proxy: string;
	enterprisePayload?: object;
	apiDomain?: string;
	userAgent?: string;
	cookies?: Cookie[];
}

export interface ReCaptchaV3EnterpriseTaskProxyLess {
	type: 'ReCaptchaV3EnterpriseTaskProxyLess';
	websiteURL: string;
	websiteKey: string;
	pageAction: string;
	minScore?: number;
	enterprisePayload?: object;
	apiDomain?: string;
	userAgent?: string;
	cookies?: Cookie[];
}

export type ReCaptchaV3 =
	| ReCaptchaV3Task
	| ReCaptchaV3TaskProxyLess
	| ReCaptchaV3EnterpriseTask
	| ReCaptchaV3EnterpriseTaskProxyLess;

export type ReCaptcha = ReCaptchaV2 | ReCaptchaV3;

export interface MTCaptcha {
	type: 'MTCaptcha';
	websiteURL: string;
	websiteKey: string;
	proxy: string;
}

export interface DatadomeSlider {
	type: 'DatadomeSliderTask';
	websiteURL: string;
	captchaUrl: string;
	proxy: string;
	userAgent: string;
}

export interface AntiCloudflare {
	type: 'AntiCloudflareTask';
	websiteURL: string;
	websiteKey: string;
	metadata: {
		type: string;
		action?: string;
		cdata?: string;
	};
	proxy: string;
}

export interface AwsWafCaptcha {
	type: 'AntiAwsWafTask' | 'AntiAwsWafTaskProxyLess';
	websiteURL: string;
	awsKey?: string;
	awsIv?: string;
	awsContext?: string;
	awsChallengeJS?: string;
	proxy?: string;
}

export interface CyberSiAra {
	type: 'AntiCyberSiAraTask' | 'AntiCyberSiAraTaskProxyLess';
	websiteURL: string;
	SlideMasterUrlId: string;
	UserAgent: string;
	proxy?: string;
}

export interface Imperva {
	type: 'AntiImpervaTask' | 'AntiImpervaTaskProxyLess';
	websiteURL: string;
	userAgent: string;
	proxy?: string;
	utmvc?: boolean;
	reese84?: boolean;
	reeseScriptUrl?: string;
	cookies?: any[];
	reeseToken?: string;
}

export interface AkamaiBMP {
	type: 'AntiAkamaiBMPTask';
	packageName: string;
	version?: string;
	deviceId?: string;
	deviceName?: string;
	count?: number;
	pow?: string;
}

export interface AkamaiWeb {
	type: 'AntiAkamaiWebTask';
	url: string;
	abck?: string;
	bmsz?: string;
	userAgent?: string;
}

export type TokenTask =
	| HCaptcha
	| FunCaptcha
	| GeeTest
	| ReCaptcha
	| MTCaptcha
	| DatadomeSlider
	| AntiCloudflare
	| AwsWafCaptcha
	| CyberSiAra
	| Imperva
	| AkamaiBMP
	| AkamaiWeb;

export type CapSolverTask = RecognitionTask | TokenTask;

export interface CapSolverBalanceResponse {
	/** Error message: 0 - no error, 1 - with error */
	errorId: 0 | 1;
	/** https://docs.capsolver.com/guide/api-error.html */
	errorCode: string;
	/** Short description of the error */
	errorDescription: string;
	/** Balance in USD */
	balance: number;
	/** List of Monthly/Weekly Packages */
	packages: any[];
}

export interface CapSolverCreateTaskResponse {
	errorId: 0 | 1;
	errorCode: string;
	errorDescription: string;
	/** Returns the status, which can only be null or 'ready' */
	status: 'ready' | null;
	solution: any;
	/** ID of the created task */
	taskId: string;
}

export interface CapSolverGetTaskResultResponse {
	errorId: 0 | 1;
	errorCode: string;
	errorDescription: string;
	status: 'ready' | null;
	solution: any;
}

export interface FeedbackTaskResult {
	/** Whether the results of task processing pass validation */
	invalid: boolean;
	/** Error code [optional] */
	code?: number;
	/** Error message [optional] */
	message?: string;
}

export interface CapSolverFeedbackTaskResponse {
	errorId: 0 | 1;
	errorCode: string;
	errorDescription: string;
	/** Returns the messages */
	message: string;
}

export interface CapSolverSolveTaskResult {
	errorId: 0 | 1;
	errorCode: string;
	errorDescription: string;
	status: 'ready' | null;
	solution: any;
	taskId: string;
}