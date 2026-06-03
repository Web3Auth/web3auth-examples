require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');

// Allow any localhost origin for automated testing across ports
app.use(
	cors({
		origin: (origin, cb) => {
			if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
				cb(null, true);
			} else {
				cb(null, false);
			}
		},
	}),
);
app.use(express.json());

app.post('/api/token', async (req, res) => {
	try {
		const body = req.body || {};
		const sub = body.sub || '9fcd68c4-af50-4dd7-adf6-abd12a13cb32';
		var privateKey = fs.readFileSync('privateKey.pem');
		var token = jwt.sign(
			{
				sub,
				name: body.name || 'Web3Auth DevRel Team',
				email: body.email || 'devrel@web3auth.io',
				aud: 'urn:api-web3auth-io',
				iss: 'https://web3auth.io',
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 60 * 60,
			},
			privateKey,
			{ algorithm: 'RS256', keyid: '2ma4enu1kdvw5bo9xsfpi3gcjzrt6q78yl0h' },
		);
		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

const listener = app.listen(process.env.PORT || 8080, () =>
	console.log('Listening on port ' + listener.address().port),
);
