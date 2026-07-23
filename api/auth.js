// Step 1 of Decap CMS's GitHub OAuth flow.
// Redirects the browser to GitHub to ask for authorization.
export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const host = req.headers.host;
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/callback`;

  if (!clientId) {
    res.status(500).send("Missing OAUTH_GITHUB_CLIENT_ID environment variable.");
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
  });

  res.writeHead(302, {
    Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
  });
  res.end();
}
