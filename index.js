const { BestBuyApiKey, DiscordLogWebhook, DiscordReportWebhook, TwilioAuth, AlertPhoneNumber, PollingInterval, CooldownMin, skus, models } = require('./config')

const bby = require('bestbuy')(BestBuyApiKey)

const webhook = require('webhook-discord')

if(DiscordReportWebhook)
  var hook = new webhook.Webhook(DiscordReportWebhook)

if(DiscordLogWebhook)
  var logHook = new webhook.Webhook(DiscordLogWebhook)

const twilio = require('twilio')(TwilioAuth.sid, TwilioAuth.token)

let cooldownPrev

let productString = `sku in(${skus.join(',')})`

if (models.length > 0) 
  productString += `|modelNumber in(${models.join(',')})`

const getProducts = () =>
	new Promise((resolve, reject) => {
		bby
			.products(productString, {})
			.then((data) => resolve(data))
			.catch((err) => reject(err))
	})

const doMonitor = () =>
	new Promise((resolve) => {
		getProducts()
			.then((data) => {
				let productsFound = []
				data.products.forEach((product) => product.onlineAvailability && productsFound.push(product))
				return resolve(productsFound)
			})
			.catch((err) => console.error(err))
	})

function Monitor() {
	try {
		doMonitor().then((data) => {
			let date = new Date().toLocaleString('en-US', {
				timeZone: 'America/Los_Angeles',
			})
			if (data.length > 0)
				data.forEach((product) => {
					let msg = `Product In Stock!
		${product.name}
		$${product.salePrice}
		Url: ${product.url}		
		Last Update: ${product.onlineAvailabilityUpdateDate}`

          console.log(product)
          if(logHook)
					  logHook.info('BestBuy', msg)

					if (cooldownPrev && new Date() < new Date(cooldownPrev.getTime() + CooldownMin * 60000)) return console.log('Cooldown in effect')

          cooldownPrev = new Date()
          if(hook)
					  hook.send(new webhook.MessageBuilder().setName('BestBuy').setImage(product.image).setText(`@everyone Now In Stock! **${product.name}**`).addField('Product', product.name).addField('Model', product.modelNumber).addField('Last Updated', product.onlineAvailabilityUpdateDate).addField('Price', `$${product.salePrice.toString()}`).addField('Description', product.shortDescription).addField('Product Url', product.url).addField('Add To Cart', product.addToCartUrl).setTime())

					twilio.messages
						.create({
							body: msg,
							from: TwilioAuth.number,
							to: AlertPhoneNumber,
						})
						.then((message) => {
							console.log(`Text sent: ${message.sid}`)
						})
				})
			else {
				const notFound = `${date} No instock product found!`
				console.log(notFound)
			}
		})
	} catch (err) {
    if(logHook)
		  logHook.err('BestBuy', err.toString() || 'Unknown error')
	}
}

setInterval(Monitor, PollingInterval)
