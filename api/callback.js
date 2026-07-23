// Step 2 of Decap CMS's GitHub OAuth flow.
// GitHub redirects here with a ?code=... which we exchange for an access token,
// then post that token back to the Decap CMS admin window via postMessage.
export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  const { code } = req.query;

  if (!code) {
    res.status(400).send("Missing code parameter.");
    return;
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      res.status(400).send(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`);
      return;
    }

    const token = tokenData.access_token;
    const message = JSON.stringify({ token, provider: "github" });

    // Decap CMS expects this exact postMessage handshake.
    const html = `
<!DOCTYPE html>
<html>
<body>
<script>
  (function() {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:success:${message.replace(/'/g, "\\'")}',
        e.origin
      );
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send("OAuth callback failed: " + err.message);
  }
}
