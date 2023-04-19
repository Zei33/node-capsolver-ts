const { Axios } = require("axios");

// This function will be called before the task is sent to the server. It will itterate through each property, and convert buffers into base64 strings
function PreProcessTask(task) {
  for (const key in task) {
    if (task[key] instanceof Buffer) {
      task[key] = task[key].toString("base64");
    }
  }
}

class CapSolver {
  /**
   * @type {import('axios').Axios}
   */
  #client;
  /**
   * @type {String}
   */
  #clientKey;

  /**
   * @typedef {{
   *  appId: String? // Your developer appId, Apply in dashboard's developer section
   *  verbose: Boolean? // Whether to print the current status
   *  verboseIdentifier: String? // The identifier of the current instance, used to distinguish between multiple instances
   * }} CapSolverOptions
   */
  /**
   * @type {CapSolverOptions}
   */
  #options;

  /**
   * @param {String} clientKey
   * @param {CapSolverOptions} options
   */
  constructor(clientKey, options) {
    this.#clientKey = clientKey;
    this.#options = options || {};
    this.#client = new Axios({
      baseURL: "https://api.capsolver.com",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * @typedef {Object} ImageToTextTask
   * @property {'ImageToTextTask'} type
   * @property {String|import('buffer').Buffer} body base64 encoded content of the image (no newlines) (no data:image/*********; base64, content
   * @property {('mtcaptcha'|'dell'|'queueit'|'amazon'|'amazon-gif'|'common')} [module] Specifies the module
   * @property {Number} [score] 0.8 ~ 1, Identify the matching degree. If the recognition rate is not within the range, no deduction
   * @property {Boolean} [case] Case sensitive or not
   */
  /**
   * @typedef {Object} HCaptchaClassification
   * @property {'HCaptchaClassification'} type
   * @property {(String|import('buffer').Buffer)[]} queries Base64 encoded image, do not include "data:image/***; base64," Assembles the picture as a list: [base64,base64,base64...]
   * @property {String} question English is supported only. Please convert other languages by yourself
   */
  /**
   * @typedef {Object} FunCaptchaClassification
   * @property {'FunCaptchaClassification'} type
   * @property {String|import('buffer').Buffer} images Base64 encoded image, can be a screenshot (pass only the hexagonal image, do not pass the rest of the content)
   * @property {String} question Question name. this param value from API response game_variant field. Exmaple: maze,maze2,flockCompass,3d_rollball_animals
   */
  /**
   * @typedef {Object} ReCaptchaV2Classification
   * @property {'ReCaptchaV2Classification'} type
   * @property {String|import('buffer').Buffer} image base64 image string
   * @property {String} question please refer to the list of questions at https://docs.capsolver.com/guide/recognition/ReCaptchaClassification.html
   */
  /**
   * @typedef {Object} AwsWafClassification
   * @property {'AwsWafClassification'} type
   * @property {(String|import('buffer').Buffer)[]} images base64 image strings
   * @property {String} question For full names of questions, please refer to the list of questions at https://docs.capsolver.com/guide/recognition/AwsWafClassification.html
   */
  /**
   * @typedef {Object} HCaptchaTask
   * @property {('HCaptchaTask'|'HCaptchaEnterpriseTask'|'HCaptchaTurboTask')} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {Boolean} [isInvisible] Set true if it's a invisible captcha
   * @property {Boolean} [enableIPV6] if your proxy is ipv6, please set to true
   * @property {Object} [enterprisePayload] Custom data that is used in some implementations of hCaptcha Enterprise. So you need to put true in the isEnterprise parameter. In most cases you see it as rqdata inside network requests. IMPORTANT: you MUST provide userAgent if you submit captcha with data parameter. The value should match the User-Agent you use when interacting with the target website
   * @property {String} [userAgent] Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   */
  /**
   * @typedef {Object} HCaptchaTaskProxyLess
   * @property {('HCaptchaTaskProxyLess'|'HCaptchaEnterpriseTaskProxyLess'|'HCaptchaTurboTaskProxyLess')} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {Boolean} [isInvisible] Set true if it's a invisible captcha
   * @property {Boolean} [enableIPV6] if your proxy is ipv6, please set to true
   * @property {Object} [enterprisePayload] Custom data that is used in some implementations of hCaptcha Enterprise. So you need to put true in the isEnterprise parameter. In most cases you see it as rqdata inside network requests. IMPORTANT: you MUST provide userAgent if you submit captcha with data parameter. The value should match the User-Agent you use when interacting with the target website
   * @property {String} [userAgent] Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   */
  /**
   * @typedef {(HCaptchaTask|HCaptchaTaskProxyLess)} HCaptcha
   */
  /**
   * @typedef {Object} FunCaptchaTask
   * @property {('FunCaptchaTask')} type
   * @property {String} websiteURL Web address of the website using funcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websitePublicKey The domain public key, rarely updated. (Ex: E8A75615-1CBA-5DFF-8031-D16BCF234E10)
   * @property {String} [funcaptchaApiJSSubdomain] A special subdomain of funcaptcha.com, from which the JS captcha widget should be loaded. Most FunCaptcha installations work from shared domains.
   * @property {String} [data] Additional parameter that may be required by FunCaptcha implementation. Use this property to send "blob" value as a stringified array. See example how it may look like. {"\blob":"HERE_COMES_THE_blob_VALUE"}
   */
  /**
   * @typedef {Object} FunCaptchaTaskProxyLess
   * @property {('FunCaptchaTaskProxyLess')} type
   * @property {String} websiteURL Web address of the website using funcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websitePublicKey The domain public key, rarely updated. (Ex: E8A75615-1CBA-5DFF-8031-D16BCF234E10)
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {String} [funcaptchaApiJSSubdomain] A special subdomain of funcaptcha.com, from which the JS captcha widget should be loaded. Most FunCaptcha installations work from shared domains.
   * @property {String} [data] Additional parameter that may be required by FunCaptcha implementation. Use this property to send "blob" value as a stringified array. See example how it may look like. {"\blob":"HERE_COMES_THE_blob_VALUE"}
   */
  /**
   * @typedef {(FunCaptchaTask|FunCaptchaTaskProxyLess)} FunCaptcha
   */
  /**
   * @typedef {Object} GeeTestTask
   * @property {('GeeTestTask')} type
   * @property {String} websiteURL Web address of the website using geetest, generally it's fixed value. (Ex: https://geetest.com)
   * @property {String} gt The domain gt field.
   * @property {String} challenge If you need to solve Geetest V3 you must use this parameter, don't need if you need to solve GeetestV4
   * @property {String} [captchaId] If you need to solve Geetest V4 you must use this parameter, don't need if you need to solve GeetestV3
   * @property {String} [geetestApiServerSubdomain] Special api subdomain
   */
  /**
   * @typedef {Object} GeeTestTaskProxyLess
   * @property {('GeeTestTaskProxyLess')} type
   * @property {String} websiteURL Web address of the website using geetest, generally it's fixed value. (Ex: https://geetest.com)
   * @property {String} gt The domain gt field.
   * @property {String} challenge If you need to solve Geetest V3 you must use this parameter, don't need if you need to solve GeetestV4
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {String} [captchaId] If you need to solve Geetest V4 you must use this parameter, don't need if you need to solve GeetestV3
   * @property {String} [geetestApiServerSubdomain] Special api subdomain
   */
  /**
   * @typedef {(GeeTestTask|GeeTestTaskProxyLess)} GeeTest
   */
  /**
   * @typedef {Object} Cookie
   * @property {String} name
   * @property {String} value
   */
  /**
   * @typedef {Object} ReCaptchaV2Task
   * @property {('ReCaptchaV2Task')} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {Boolean} [isInvisible] if recaptcha don't have pageAction, reload request body content flag have "fi"
   * @property {String} [userAgent] Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   * @property {Cookie[]} [cookies]
   */
  /**
   * @typedef {Object} ReCaptchaV2TaskProxyLess
   * @property {('ReCaptchaV2TaskProxyLess')} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {Boolean} [isInvisible] if recaptcha don't have pageAction, reload request body content flag have "fi"
   * @property {String} [userAgent] Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   * @property {Cookie[]} [cookies]
   */
  /**
   * @typedef {Object} ReCaptchaV2EnterpriseTask
   * @property {('ReCaptchaV2EnterpriseTask')} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {Object} [enterprisePayload] Enterprise Payload
   * @property {Boolean} [isInvisible] if recaptcha don't have pageAction, reload request body content flag have "fi"
   * @property {String} [apiDomain] Domain address from which to load reCAPTCHA Enterprise. For example: http://www.google.com/ or http://www.recaptcha.net/. Don't use a parameter if you don't know why it's needed.
   * @property {String} [userAgent] Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   * @property {Cookie[]} [cookies]
   */
  /**
   * @typedef {Object} ReCaptchaV2EnterpriseTaskProxyLess
   * @property {('ReCaptchaV2EnterpriseTaskProxyLess')} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {Object} [enterprisePayload] Enterprise Payload
   * @property {Boolean} [isInvisible] if recaptcha don't have pageAction, reload request body content flag have "fi"
   * @property {String} [apiDomain] Domain address from which to load reCAPTCHA Enterprise. For example: http://www.google.com/ or http://www.recaptcha.net/. Don't use a parameter if you don't know why it's needed.
   * @property {String} [userAgent] Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   * @property {Cookie[]} [cookies]
   */
  /**
   * @typedef {(ReCaptchaV2Task|ReCaptchaV2TaskProxyLess|ReCaptchaV2EnterpriseTask|ReCaptchaV2EnterpriseTaskProxyLess)} ReCaptchaV2
   */
  /**
   * @typedef {Object} ReCaptchaV3Task
   * @property {'ReCaptchaV3Task'} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} pageAction Widget action value. Website owner defines what user is doing on the page through this parameter. Default value: verify Example: grecaptcha.execute('site_key', {action:'login_test'}).
   * @property {Number} [minScore] Value from 0.1 to 0.9.
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {String} [userAgent] Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   * @property {Cookie[]} [cookies]
   */
  /**
   * @typedef {Object} ReCaptchaV3TaskProxyLess
   * @property {'ReCaptchaV3TaskProxyLess'} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} pageAction Widget action value. Website owner defines what user is doing on the page through this parameter. Default value: verify Example: grecaptcha.execute('site_key', {action:'login_test'}).
   * @property {Number} [minScore] Value from 0.1 to 0.9.
   * @property {String} [userAgent] Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   * @property {Cookie[]} [cookies]
   */
  /**
   * @typedef {Object} ReCaptchaV3EnterpriseTask
   * @property {'ReCaptchaV3EnterpriseTask'} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} pageAction Widget action value. Website owner defines what user is doing on the page through this parameter. Default value: verify Example: grecaptcha.execute('site_key', {action:'login_test'}).
   * @property {Number} [minScore] Value from 0.1 to 0.9.
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {Object} enterprisePayload Enterprise payload
   * @property {String} apiDomain Domain address from which to load reCAPTCHA Enterprise. For example: http://www.google.com/ or http://www.recaptcha.net/. Don't use a parameter if you don't know why it's needed.
   * @property {String} [userAgent] Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   * @property {Cookie[]} [cookies]
   */
  /**
   * @typedef {Object} ReCaptchaV3EnterpriseTaskProxyLess
   * @property {'ReCaptchaV3EnterpriseTaskProxyLess'} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: b989d9e8-0d14-41sda0-870f-97b5283ba67d)
   * @property {String} pageAction Widget action value. Website owner defines what user is doing on the page through this parameter. Default value: verify Example: grecaptcha.execute('site_key', {action:'login_test'}).
   * @property {Number} [minScore] Value from 0.1 to 0.9.
   * @property {Object} enterprisePayload Enterprise payload
   * @property {String} apiDomain Domain address from which to load reCAPTCHA Enterprise. For example: http://www.google.com/ or http://www.recaptcha.net/. Don't use a parameter if you don't know why it's needed.
   * @property {String} [userAgent] Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   * @property {Cookie[]} [cookies]
   */
  /**
   * @typedef {(ReCaptchaV3Task|ReCaptchaV3TaskProxyLess|ReCaptchaV3EnterpriseTask|ReCaptchaV3EnterpriseTaskProxyLess)} ReCaptchaV3
   */
  /**
   * @typedef {(ReCaptchaV2|ReCaptchaV3)} ReCaptcha
   */
  /**
   * @typedef {Object} MTCaptcha
   * @property {'MTCaptcha'} type
   * @property {String} websiteURL Web address of the website using hcaptcha, generally it's fixed value. (Ex: https://google.com)
   * @property {String} websiteKey The domain public key, rarely updated. (Ex: sk=MTPublic-xxx public key)
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   */
  /**
   * @typedef {Object} DatadomeSliderTask
   * @property {'DatadomeSliderTask'} type
   * @property {String} websiteURL The address of the target page.
   * @property {String} captchaUrl if the url contains t=bv that means that your ip must be banned, t should be t=fe
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   * @property {String} userAgent Browser's User-Agent which is used in emulation. It is required that you use a signature of a modern browser, otherwise Google will ask you to "update your browser".
   */
  /**
   * @typedef {Object} AntiCloudflareTask
   * @property {'AntiCloudflareTask'} type
   * @property {String} websiteURL The address of the target page.
   * @property {String} websiteKey Turnstile website key.
   * @property {Object} metadata Turnstile extra data . Turnstile Documentation
   * @property {String} metadata.type challenge or turnstile fixed value.
   * @property {String} [metadata.action] The value of the data-action attribute of the Turnstile element if it exists.
   * @property {String} [metadata.cdata] The value of the data-cdata attribute of the Turnstile element if it exists.
   * @property {String} html You can pass in the entire html source code for the challenge directly. The page contains the window._cf_chl_opt attribute. Support base64 string
   * @property {String} proxy Read about using proxies at https://docs.capsolver.com/guide/api-how-to-use-proxy.html
   */

  async delay(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async verbose(log) {
    if (this.#options?.verbose || false) {
      const verboseIdentifier = this.#options?.verboseIdentifier
        ? `${this.#options?.verboseIdentifier} `
        : "";
      console.log(`${verboseIdentifier}${log}`);
    }
  }
  /**
   * @typedef {(ImageToTextTask|HCaptchaClassification|FunCaptchaClassification|ReCaptchaV2Classification|AwsWafClassification)} RecognitionTask
   */
  /**
   * @typedef {(HCaptcha|FunCaptcha|GeeTest|ReCaptcha|MTCaptcha|DatadomeSliderTask|AntiCloudflareTask)} TokenTask
   */
  /**
   * @typedef {(RecognitionTask|TokenTask)} CapSolverTask
   */

  /**
   * @typedef {Object} CapSolverBalanceResponse
   * @property {(0|1)} errorId Error message: 0 - no error, 1 - with error
   * @property {String} errorCode https://docs.capsolver.com/guide/api-error.html
   * @property {String} errorDescription Short description of the error
   * @property {Number} balance Balance in USD
   * @property {any[]} packages List of Monthly/Weekly Packages
   */
  /**
   * @returns {CapSolverBalanceResponse}
   */
  async getBalance() {
    const response = await this.#client.request({
      method: "POST",
      url: "/getBalance",
      data: JSON.stringify({
        clientKey: this.#clientKey,
      }),
    });
    return JSON.parse(response.data);
  }

  /**
   * @typedef CapSolverCreateTaskResponse
   * @property {(0|1)} errorId Error message: 0 - no error, 1 - with error
   * @property {String} errorCode https://docs.capsolver.com/guide/api-error.html
   * @property {String} errorDescription Error description
   * @property {"ready"|null} status returns the status, which can only be null or ready
   * @property {Object} solution
   * @property {String} taskId ID of the created task
   */
  /**
   * @param {CapSolverTask} task
   * @returns {CapSolverCreateTaskResponse}
   */
  async createTask(task) {
    PreProcessTask(task);
    const response = await this.#client.request({
      method: "POST",
      url: "/createTask",
      data: JSON.stringify({
        clientKey: this.#clientKey,
        appId: this.#options.appId || "6B27D516-3A6F-4E13-9DED-F517295F5F89",
        task,
      }),
    });
    return JSON.parse(response.data);
  }

  /**
   * @typedef CapSolverGetTaskResultResponse
   * @property {(0|1)} errorId Error message: 0 - no error, 1 - with error
   * @property {String} errorCode https://docs.capsolver.com/guide/api-error.html
   * @property {String} errorDescription Error description
   * @property {"ready"|null} status returns the status, which can only be null or ready
   * @property {Object} solution
   */
  /**
   * @param {String} taskId
   * @returns {Promise<CapSolverGetTaskResultResponse>}
   */
  async getTaskResult(taskId) {
    const response = await this.#client.request({
      method: "POST",
      url: "/getTaskResult",
      data: JSON.stringify({
        clientKey: this.#clientKey,
        taskId,
      }),
    });
    return JSON.parse(response.data);
  }
  /**
   * @typedef CapSolverSolveTaskResult
   * @property {(0|1)} errorId Error message: 0 - no error, 1 - with error
   * @property {String} errorCode https://docs.capsolver.com/guide/api-error.html
   * @property {String} errorDescription Error description
   * @property {"ready"|null} status returns the status, which can only be null or ready
   * @property {Object} solution
   * @property {String} taskId ID of the created task
   */

  /**
   * @param {CapSolverTask} task
   * @returns {Promise<CapSolverSolveTaskResult>}
   */
  async solve(task) {
    if (!task)
      return {
        errorCode: "ERROR_INVALID_TASK_DATA",
        errorDescription: "Missing task data.",
        errorId: 1,
      };

    const response = await this.createTask(task);
    if (response.status === "ready" || response.errorId === 1) return response;
    const taskId = response.taskId;

    this.verbose(`[${taskId}] Created [${task.type}].`);

    while (true) {
      const result = await this.getTaskResult(taskId);
      if (result.status === "ready" || result.errorId === 1) {
        const verboseMessage =
          result?.status === "ready" ? `Solved!` : `Failed!`;
        this.verbose(`[${taskId}] ${verboseMessage}`);

        return result;
      }

      this.verbose(`[${taskId}] Waiting 2500ms...`);
      await this.delay(2500);
    }
  }
}

module.exports = CapSolver;
