import os
from slack_bolt.async_app import AsyncApp
from slack_bolt.adapter.fastapi.async_handler import AsyncSlackRequestHandler
from services.rag_engine import rag_engine

slack_app = AsyncApp(
    token=os.getenv("SLACK_BOT_TOKEN", "xoxb-mock-token"),
    signing_secret=os.getenv("SLACK_SIGNING_SECRET", "mock-signing-secret")
)

slack_handler = AsyncSlackRequestHandler(slack_app)

@slack_app.command("/vibecheck")
async def handle_vibecheck_command(ack, respond, command):
    await ack()
    text = command.get("text", "")
    if not text:
        await respond("⚠️ Please provide text. Example: `/vibecheck We need to complete deliverables.`")
        return
    result = await rag_engine.execute_rag_translation(text, intensity=3, direction="to_genz")
    blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"⚡ *VIBECHECK TRANSLATION RESULT*\n*Original:* _{text}_\n*Translation:* *{result['translated_text']}*"
            }
        },
        {
            "type": "context",
            "elements": [
                {"type": "mrkdwn", "text": f"🔥 *Cringe Score:* {result['cringe_score']}% | 🛡️ *Safety:* {result['workplace_safety']}"}
            ]
        }
    ]
    await respond(blocks=blocks)

@slack_app.command("/decringe")
async def handle_decringe_command(ack, respond, command):
    await ack()
    text = command.get("text", "")
    if not text:
        await respond("⚠️ Please provide text. Example: `/decringe Bro is lowkey cooked.`")
        return
    result = await rag_engine.execute_rag_translation(text, direction="to_corporate")
    await respond(f"🏢 *CORPORATE SANITIZED OUTPUT:*\n>{result['translated_text']}")
