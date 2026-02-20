from sqlalchemy.orm import Session
from models import Campaign, Referral, Reward
from schemas import CampaignCreate, ReferralCreate, RewardCreate
import json
from datetime import datetime

# Campaign CRUD
def create_campaign(db: Session, campaign: CampaignCreate):
    db_campaign = Campaign(**campaign.model_dump())
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def get_campaign(db: Session, campaign_id: str):
    return db.query(Campaign).filter(Campaign.id == campaign_id).first()

def get_campaigns(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Campaign).offset(skip).limit(limit).all()

# Referral CRUD
def create_referral(db: Session, referral: ReferralCreate):
    db_referral = Referral(**referral.model_dump())
    db.add(db_referral)
    db.commit()
    db.refresh(db_referral)
    return db_referral

def get_referral(db: Session, referral_code: str):
    return db.query(Referral).filter(Referral.referral_code == referral_code).first()

def get_referrals_by_campaign(db: Session, campaign_id: str):
    return db.query(Referral).filter(Referral.campaign_id == campaign_id).all()

def increment_referral_clicks(db: Session, referral_code: str):
    referral = get_referral(db, referral_code)
    if referral:
        referral.total_clicks += 1
        db.commit()
    return referral

# Reward CRUD
def create_reward(db: Session, reward: RewardCreate):
    db_reward = Reward(**reward.model_dump())
    db.add(db_reward)
    db.commit()
    db.refresh(db_reward)
    return db_reward

def get_rewards(db: Session, referral_id: str):
    return db.query(Reward).filter(Reward.referral_id == referral_id).all()

def update_reward_fulfillment(db: Session, reward_id: str, data: dict):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if reward:
        reward.status = "fulfilled"
        reward.fulfillment_data = json.dumps(data)
        reward.fulfilled_at = datetime.utcnow()
        db.commit()
        db.refresh(reward)
    return reward