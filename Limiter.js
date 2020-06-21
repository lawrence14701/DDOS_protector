const TokenBucket = require('./TokenBucket');

const Blacklist = [];

const limitRequests = (perSecond, maxReq, timeInMs) => {
	//map of all the ip addresses
	const buckets = new Map();

	// Return an Express middleware function
	return function limitRequestsMiddleware(req, res, next) {
		if (!buckets.has(req.ip)) {
			buckets.set(req.ip, new TokenBucket(maxReq, perSecond, timeInMs));
		}
		const bucketForIP = buckets.get(req.ip);
		if (bucketForIP.take()) {
			next();
		} else {
			res.send('Your Ip has been blacklisted');
			if (!Blacklist.includes(req.ip)) {
				Blacklist.push(req.ip);
			}
		}
	};
};

module.exports = { limitRequests, Blacklist };
