from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

# Campaign schemas
class CampaignCreate(BaseModel):
    name: str
    description: Optional[str] = None
    reward_description: str

class CampaignResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    reward_description: str
    created_at: datetime
    is_active: int
    
    class Config:
        from_attributes = True

# Referral schemas
class ReferralCreate(BaseModel):
    campaign_id: str
    referrer_email: str
    referrer_name: Optional[str] = None

class ReferralResponse(BaseModel):
    id: str
    campaign_id: str
    referral_code: str
    referrer_email: str
    referrer_name: Optional[str]
    created_at: datetime
    total_clicks: int
    successful_conversions: int
    
    class Config:
        from_attributes = True

# Reward schemas
class RewardCreate(BaseModel):
    referral_id: str
    action_type: str
    reward_type: str  # coupon, credit, physical
    reward_value: float
    status: str = "pending"

class RewardResponse(BaseModel):
    id: str
    referral_id: str
    action_type: str
    reward_type: str
    reward_value: float
    status: str
    created_at: datetime
    fulfilled_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Webhook schema
class WebhookPayload(BaseModel):
    referral_code: str
    action_type: str
    metadata: Dict[str, Any] = {}

# Widget config
class WidgetConfig(BaseModel):
    campaign_id: str
    campaign_name: str
    reward_description: str
    primary_color: str = "#6366f1"
    api_base_url: str