# 🎁 ReferralRewards

**Plug-and-play viral referral rewards for SaaS**

Add viral referral loops to your SaaS product in minutes, not months.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the API

```bash
python main.py
```

The API will start at `http://localhost:8000`

### 3. Open Dashboard

Visit `http://localhost:8000` to access the admin dashboard.

## 📋 API Endpoints

### Campaigns
- `POST /api/campaigns` - Create a referral campaign
- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/{id}` - Get campaign details

### Referrals
- `POST /api/referrals` - Create a referral (generates unique code)
- `GET /api/referrals/{code}` - Get referral by code
- `GET /api/campaigns/{id}/referrals` - Get referrals for campaign

### Rewards
- `POST /api/rewards` - Create a reward for an action
- `GET /api/referrals/{id}/rewards` - Get rewards for referral
- `POST /api/rewards/{id}/fulfill` - Mark reward as fulfilled

### Webhooks
- `POST /api/webhooks/track` - Track rewardable actions from your app

### Widget
- `GET /api/widget/{campaign_id}` - Get widget configuration

## 🎨 Embedding the Widget

Add this script tag to your app:

```html
<script src="http://localhost:8000/static/widget.js" 
        data-campaign="YOUR_CAMPAIGN_ID"
        data-referrer="user@example.com">
</script>
```

## 📊 Dashboard Features

- Create and manage referral campaigns
- Copy-paste ready widget code
- View referral stats (clicks, conversions, rewards)

## 🔧 Example Usage

### 1. Create a Campaign

```bash
curl -X POST http://localhost:8000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name": "Summer Promo", "reward_description": "$50 credit per referral"}'
```

Response:
```json
{
  "id": "abc123",
  "name": "Summer Promo",
  "reward_description": "$50 credit per referral"
}
```

### 2. Create a Referral

```bash
curl -X POST http://localhost:8000/api/referrals \
  -H "Content-Type: application/json" \
  -d '{"campaign_id": "abc123", "referrer_email": "user@example.com"}'
```

Response:
```json
{
  "id": "ref456",
  "referral_code": "ABC123XY",
  "referrer_email": "user@example.com"
}
```

### 3. Track Actions via Webhook

When someone completes an action (signup, purchase, etc.):

```bash
curl -X POST http://localhost:8000/api/webhooks/track \
  -H "Content-Type: application/json" \
  -d '{
    "referral_code": "ABC123XY",
    "action_type": "signup",
    "metadata": {"reward_value": 50}
  }'
```

### 4. Fulfill Rewards

When you're ready to give the reward:

```bash
curl -X POST http://localhost:8000/api/rewards/REWARD_ID/fulfill \
  -H "Content-Type: application/json" \
  -d '{"coupon_code": "SAVE50", "expires": "2024-12-31"}'
```

## 🏗️ Architecture

- **FastAPI** - Modern, fast web framework
- **SQLite** - Simple file-based database (easy to swap for PostgreSQL)
- **SQLAlchemy** - ORM for database operations
- **Jinja2** - Template engine for dashboard
- **Vanilla JS** - Lightweight embeddable widget

## 📁 Project Structure

```
├── main.py              # FastAPI application
├── models.py            # Database models
├── schemas.py           # Pydantic schemas
├── crud.py              # Database operations
├── database.py          # Database connection
├── templates/
│   └── dashboard.html   # Admin dashboard
├── static/
│   └── widget.js        # Embeddable widget
├── requirements.txt
└── README.md
```

## 🛠️ Customization

### Changing the Database

Edit `database.py` to use PostgreSQL:

```python
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/referralrewards"
```

### Styling the Widget

Edit `static/widget.js` - the CSS is in the `styles` variable.

### Adding Auth

Add authentication to protected endpoints:

```python
from fastapi.security import HTTPBearer

security = HTTPBearer()

@app.post("/api/campaigns", dependencies=[Depends(security)])
```

## 📈 Next Steps

1. **Add authentication** - API keys or OAuth2
2. **Swap to PostgreSQL** - For production scale
3. **Add email notifications** - Send updates on conversions
4. **Analytics dashboard** - Charts and graphs
5. **Reward templates** - Pre-built coupon/prize integrations

## 📝 License

MIT - Build something awesome!