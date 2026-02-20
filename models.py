from sqlalchemy import Column, String, Integer, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import uuid

def generate_id():
    return str(uuid.uuid4())[:12]

class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(String, primary_key=True, default=generate_id)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    reward_description = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=1)
    
    referrals = relationship("Referral", back_populates="campaign")

class Referral(Base):
    __tablename__ = "referrals"
    
    id = Column(String, primary_key=True, default=generate_id)
    campaign_id = Column(String, ForeignKey("campaigns.id"))
    referral_code = Column(String, unique=True, nullable=False, default=lambda: str(uuid.uuid4())[:8].upper())
    referrer_email = Column(String, nullable=False)
    referrer_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    total_clicks = Column(Integer, default=0)
    successful_conversions = Column(Integer, default=0)
    
    campaign = relationship("Campaign", back_populates="referrals")
    rewards = relationship("Reward", back_populates="referral")

class Reward(Base):
    __tablename__ = "rewards"
    
    id = Column(String, primary_key=True, default=generate_id)
    referral_id = Column(String, ForeignKey("referrals.id"))
    action_type = Column(String, nullable=False)  # signup, purchase, share, etc.
    reward_type = Column(String, nullable=False)  # coupon, credit, physical
    reward_value = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, fulfilled, cancelled
    fulfillment_data = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    fulfilled_at = Column(DateTime, nullable=True)
    
    referral = relationship("Referral", back_populates="rewards")