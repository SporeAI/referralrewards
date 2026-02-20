/**
 * ReferralRewards Embeddable Widget
 * Usage: <script src="API_URL/static/widget.js" data-campaign="CAMPAIGN_ID" data-referrer="USER_EMAIL"></script>
 */
(function() {
    'use strict';
    
    // Get configuration from script tag
    const scriptTag = document.currentScript;
    const campaignId = scriptTag.getAttribute('data-campaign');
    const referrerEmail = scriptTag.getAttribute('data-referrer');
    const apiBaseUrl = scriptTag.src.replace('/static/widget.js', '');
    
    if (!campaignId) {
        console.error('ReferralRewards: Missing data-campaign attribute');
        return;
    }
    
    // Create widget container
    const widgetId = 'referral-widget-' + Math.random().toString(36).substr(2, 9);
    
    // Widget styles
    const styles = document.createElement('style');
    styles.textContent = `
        #${widgetId} {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 400px;
            margin: 0 auto;
        }
        .rr-widget-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 24px;
            border: 1px solid #e5e7eb;
        }
        .rr-widget-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .rr-widget-title {
            font-size: 20px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
        }
        .rr-widget-subtitle {
            color: #6b7280;
            font-size: 14px;
        }
        .rr-reward-badge {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .rr-input-group {
            margin-bottom: 16px;
        }
        .rr-input {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s;
        }
        .rr-input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .rr-btn {
            width: 100%;
            padding: 12px;
            background: #6366f1;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 14px;
        }
        .rr-btn:hover {
            background: #4f46e5;
        }
        .rr-referral-link {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 8px;
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .rr-referral-link input {
            flex: 1;
            background: transparent;
            border: none;
            font-family: monospace;
            font-size: 13px;
            color: #374151;
        }
        .rr-copy-btn {
            padding: 6px 12px;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            color: #374151;
        }
        .rr-copy-btn:hover {
            background: #f9fafb;
        }
        .rr-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
        }
        .rr-stat {
            text-align: center;
        }
        .rr-stat-value {
            font-size: 20px;
            font-weight: 700;
            color: #6366f1;
        }
        .rr-stat-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
        }
        .rr-hidden { display: none !important; }
    `;
    document.head.appendChild(styles);
    
    // Create widget HTML
    const container = document.createElement('div');
    container.id = widgetId;
    container.innerHTML = `
        <div class="rr-widget-card">
            <div class="rr-loading" style="text-align: center; padding: 40px; color: #6b7280;">
                Loading...
            </div>
            
            <div class="rr-content rr-hidden">
                <div class="rr-widget-header">
                    <div class="rr-widget-title">Share & Earn</div>
                    <div class="rr-widget-subtitle">Invite friends and earn rewards</div>
                </div>
                
                <div class="rr-reward-badge rr-reward-text">
                    🎁 Get $50 credit for each referral
                </div>
                
                <!-- Form for new users -->
                <div class="rr-form-section">
                    <div class="rr-input-group">
                        <input type="email" class="rr-input rr-email-input" placeholder="Enter your email" value="${referrerEmail || ''}">
                    </div>
                    <button class="rr-btn rr-generate-btn">Generate Referral Link</button>
                </div>
                
                <!-- Referral link display -->
                <div class="rr-link-section rr-hidden">
                    <p style="font-size: 14px; color: #374151; margin-bottom: 12px;">
                        Share this link with your friends:
                    </p>
                    <div class="rr-referral-link">
                        <input type="text" class="rr-link-input" readonly value="">
                        <button class="rr-copy-btn">Copy</button>
                    </div>
                    
                    <div class="rr-stats">
                        <div class="rr-stat">
                            <div class="rr-stat-value rr-clicks">0</div>
                            <div class="rr-stat-label">Clicks</div>
                        </div>
                        <div class="rr-stat">
                            <div class="rr-stat-value rr-signups">0</div>
                            <div class="rr-stat-label">Signups</div>
                        </div>
                        <div class="rr-stat">
                            <div class="rr-stat-value rr-earned">$0</div>
                            <div class="rr-stat-label">Earned</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="rr-error rr-hidden" style="text-align: center; padding: 20px; color: #ef4444;">
                Failed to load widget
            </div>
        </div>
    `;
    
    // Insert after script tag
    scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
    
    // State
    let referralCode = null;
    let referralData = null;
    
    // Fetch campaign config
    async function init() {
        try {
            const response = await fetch(`${apiBaseUrl}/api/widget/${campaignId}`);
            if (!response.ok) throw new Error('Failed to fetch');
            
            const config = await response.json();
            render(config);
        } catch (error) {
            console.error('ReferralRewards:', error);
            showError();
        }
    }
    
    function render(config) {
        const loading = container.querySelector('.rr-loading');
        const content = container.querySelector('.rr-content');
        
        // Update reward text
        container.querySelector('.rr-reward-text').textContent = 
            '🎁 ' + (config.reward_description || 'Earn rewards for each referral');
        
        loading.classList.add('rr-hidden');
        content.classList.remove('rr-hidden');
        
        // If user email provided, try to get existing referral
        if (referrerEmail) {
            getExistingReferral(referrerEmail);
        }
        
        // Setup event listeners
        setupListeners();
    }
    
    function setupListeners() {
        const generateBtn = container.querySelector('.rr-generate-btn');
        const copyBtn = container.querySelector('.rr-copy-btn');
        
        generateBtn.addEventListener('click', generateReferral);
        copyBtn.addEventListener('click', copyLink);
    }
    
    async function generateReferral() {
        const emailInput = container.querySelector('.rr-email-input');
        const email = emailInput.value.trim();
        
        if (!email || !email.includes('@')) {
            emailInput.style.borderColor = '#ef4444';
            return;
        }
        
        const btn = container.querySelector('.rr-generate-btn');
        btn.textContent = 'Generating...';
        btn.disabled = true;
        
        try {
            const response = await fetch(`${apiBaseUrl}/api/referrals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaign_id: campaignId,
                    referrer_email: email
                })
            });
            
            if (!response.ok) throw new Error('Failed to create');
            
            const data = await response.json();
            referralCode = data.referral_code;
            referralData = data;
            
            showReferralSection();
        } catch (error) {
            console.error('ReferralRewards:', error);
            btn.textContent = 'Error - Try Again';
            btn.disabled = false;
        }
    }
    
    async function getExistingReferral(email) {
        // Simplified: In production, you'd have an endpoint to get by email
        // For now, we'll just show the form
    }
    
    function showReferralSection() {
        const formSection = container.querySelector('.rr-form-section');
        const linkSection = container.querySelector('.rr-link-section');
        const linkInput = container.querySelector('.rr-link-input');
        
        const referralUrl = `${window.location.origin}?ref=${referralCode}`;
        linkInput.value = referralUrl;
        
        formSection.classList.add('rr-hidden');
        linkSection.classList.remove('rr-hidden');
    }
    
    function copyLink() {
        const linkInput = container.querySelector('.rr-link-input');
        linkInput.select();
        document.execCommand('copy');
        
        const copyBtn = container.querySelector('.rr-copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }
    
    function showError() {
        container.querySelector('.rr-loading').classList.add('rr-hidden');
        container.querySelector('.rr-error').classList.remove('rr-hidden');
    }
    
    // Auto-refresh stats every 30 seconds
    function refreshStats() {
        if (referralData) {
            fetch(`${apiBaseUrl}/api/referrals/${referralCode}`)
                .then(r => r.json())
                .then(data => {
                    container.querySelector('.rr-clicks').textContent = data.total_clicks;
                    container.querySelector('.rr-signups').textContent = data.successful_conversions;
                })
                .catch(console.error);
        }
    }
    
    // Start
    init();
    setInterval(refreshStats, 30000);
    
})();