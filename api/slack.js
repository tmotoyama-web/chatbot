export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers['authorization']?.replace('Bearer ', '');
  const { endpoint, channel } = req.query;

  if (!token || !endpoint) {
    return res.status(400).json({ error: 'missing params' });
  }

  const url = channel
    ? `https://slack.com/api/${endpoint}?channel=${channel}&limit=3`
    : `https://slack.com/api/${endpoint}?limit=5&exclude_archived=true`;

  const response = await fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token }
  });

  const data = await response.json();
  return res.status(200).json(data);
}
