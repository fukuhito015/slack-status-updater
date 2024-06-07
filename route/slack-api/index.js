const express = require('express')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()

// Slack APIのOAuthアクセストークンを設定
const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET
const REDIRECT_URI = process.env.CHROME_EXTENSION_APP_URL

// 認証画面をリダイレクト表示
router.get('/authorize', (req, res) => {
  res.redirect(
    `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=&user_scope=chat:write,users.profile:write,users:write&redirect_uri=${REDIRECT_URI}`
  )
})

// Slackの認可コードからアクセストークンを取得するエンドポイント
router.post('/exchange', async (req, res) => {
  const code = req.body.code
  console.log({ code })
  try {
    const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
      },
    })

    const token = response.data.authed_user.access_token

    // Respond with the token.
    res.json({ token: token })
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

// Slackのステータスを更新するエンドポイント
router.post('/status', (req, res) => {
  const { statusText, emoji, slackToken } = req.body
  console.log({ statusText, emoji })

  if (!statusText || !emoji) {
    return res.status(400).json({ error: 'statusText and emoji are required.' })
  }

  const slackProfileSetUrl = 'https://slack.com/api/users.profile.set'
  const statusData = {
    profile: JSON.stringify({
      status_text: statusText,
      status_emoji: emoji,
    }),
  }

  axios
    .post(slackProfileSetUrl, statusData, {
      headers: {
        Authorization: `Bearer ${slackToken}`,
      },
    })
    .then((response) => {
      if (response.data.ok) {
        return res.status(200).json({ message: 'Slack status updated successfully.' })
      } else {
        return res.status(500).json({ error: 'Failed to update Slack status.' })
      }
    })
    .catch((error) => {
      console.trace(error)
      return res.status(500).json({ error: 'Error updating Slack status.' })
    })
})

module.exports = router
