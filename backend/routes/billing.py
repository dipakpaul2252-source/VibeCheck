import os
import stripe
from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v1/billing", tags=["Billing & Monetization"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_mock_stripe_key")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_mock_key")
UNC_PASS_PRICE_ID = os.getenv("STRIPE_UNC_PASS_PRICE_ID", "price_unc_pass_monthly")

class CheckoutSessionRequest(BaseModel):
    user_id: str
    user_email: str
    success_url: str = "https://vibecheck.ai/success?session_id={CHECKOUT_SESSION_ID}"
    cancel_url: str = "https://vibecheck.ai/cancel"

@router.post("/create-checkout-session")
async def create_checkout_session(req: CheckoutSessionRequest):
    if stripe.api_key == "sk_test_mock_stripe_key":
        return {
            "session_id": "cs_mock_12345",
            "url": "https://checkout.stripe.com/c/pay/mock_session"
        }
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": UNC_PASS_PRICE_ID, "quantity": 1}],
            mode="subscription",
            customer_email=req.user_email,
            client_reference_id=req.user_id,
            success_url=req.success_url,
            cancel_url=req.cancel_url,
            metadata={"product": "unc_pass", "user_id": req.user_id}
        )
        return {"session_id": session.id, "url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: Optional[str] = Header(None)):
    payload = await request.body()
    if STRIPE_WEBHOOK_SECRET == "whsec_mock_key":
        return {"status": "mock_event_received"}
    try:
        event = stripe.Webhook.construct_event(payload, stripe_signature, STRIPE_WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook Error: {str(e)}")
        
    if event["type"] == "checkout.session.completed":
        user_id = event["data"]["object"].get("client_reference_id")
        print(f"[BILLING] User {user_id} upgraded to Unc Pass VIP.")
        
    return {"status": "success"}
