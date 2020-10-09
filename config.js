// Add BestBuy SKUs for models you want to monitor for in this array.
// All models are checked in the same request, so more skus won't mean increased requests
exports.skus = [
  //3090
	6429434,
	6432447,
	6434363,
	6436192,
	6436193,
	//3080
	6429440,
	6432445,
	6436191,
	6436196,
]

// Optionally, add Models of products if you do not know the sku
exports.models = [
  // '9001G1362510000', 
  // '24G-P5-3987-KR'
]

// Enter your BestBuy Api Key from https://developer.bestbuy.com/
exports.BestBuyApiKey = ''

// Phone number for twilio alert texts
exports.AlertPhoneNumber = '+15555551212'

// Twilio Account Information
exports.TwilioAuth = {  
	sid: '',
	token: '',
	number: '+15555551212',
}

// Optional: Enter a discord webhook url for logging errors in the application
exports.DiscordLogWebhook = undefined

// Optional: Enter a discord webhook url for logging in-stock products
exports.DiscordReportWebhook = undefined

// Time, in MS, between polling the API. Default 1.8 seconds should prevent rate limiting.
exports.PollingInterval = 1800

// Time, in minutes, for application to wait before sending a text message about the same product after doing so once.
exports.CooldownMin = 30