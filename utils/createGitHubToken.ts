export async function createTokenWithCode(code: string) {
  const url =
    `https://github.com/login/oauth/access_token` +
    `?client_id=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}` +
    `&client_secret=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET}` +
    `&code=${code}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return res.json();
}
