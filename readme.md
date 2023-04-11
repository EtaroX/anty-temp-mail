# Anti-TempMail

Anti-TempMail is a Node.js library that provides a simple way to detect temporary email addresses by checking against a pre-defined list of known email domains. It uses two different APIs to retrieve a list of known temporary email domains and saves them locally to check against. This library can be useful for preventing spam or fraudulent activity in web applications.

## Installation

You can install Anti-TempMail via npm:

```bash
npm install anti-tempmail
```

## Usage

To use Anti-TempMail, you can import the library and call the `checkEmail` function with an email address as a parameter:

```javascript
const antiTempMail = require('antitempmail');

if (antiTempMail.checkEmail('example@tempmail.com')) {
  console.log('This is a temporary email address');
} else {
  console.log('This is not a temporary email address');
}
```
You can also call the getDomains function to update the list of known temporary email domains (or use checkEmail(email, true)):
```javascript
antiTempMail.getDomains();
```
The addDomains function can be used to add additional domains to the list:
```javascript
antiTempMail.addDomains(['example.com', 'example.org']);
```

## API Keys
Anti-TempMail uses two different APIs to retrieve a list of known temporary email domains. You will need to provide an API key for one of them. You can set your API key by creating a .env file in the root of your project and adding the following line:
```
RAPID_API_KEY=YOUR_API_KEY_HERE
```

## License
Anti-TempMail is released under the MIT License. See [LICENSE](LICENSE) for details.

