# OpenAI API Setup Guide

## 🚀 Quick Setup for GPT-3.5 Turbo Integration

### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the API key (starts with `sk-`)

### Step 2: Add API Key to Environment

1. Open `server/.env` file
2. Replace `your_openai_api_key_here` with your actual API key:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Step 3: Restart Server

```bash
cd server
npm run dev
```

## 💰 Cost Information

### GPT-3.5 Turbo Pricing (as of 2024)
- **Input**: $0.0015 per 1K tokens
- **Output**: $0.002 per 1K tokens

### Estimated Costs for Resume Enhancement
- **Per Request**: ~$0.0025 (1,700 tokens average)
- **100 Enhancements**: ~$0.25
- **1,000 Enhancements**: ~$2.50

### Cost Optimization Tips
1. **Use GPT-3.5 Turbo** (not GPT-4) - 20x cheaper
2. **Limit max_tokens** to 2000 (current setting)
3. **Temperature 0.7** for balanced creativity/consistency
4. **Fallback to mock AI** when API key is missing

## 🔧 Configuration Options

### Environment Variables
```bash
# Required
OPENAI_API_KEY=sk-your-api-key-here

# Optional (defaults shown)
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

### Model Comparison
| Model | Cost/1K tokens | Speed | Quality | Best For |
|-------|----------------|-------|---------|----------|
| **GPT-3.5 Turbo** | $0.0015 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Resume Enhancement** |
| GPT-4 | $0.03 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Complex Analysis |
| GPT-4 Turbo | $0.01 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Large Context |

## 🛡️ Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Rotate API keys** regularly
4. **Monitor usage** in OpenAI dashboard
5. **Set usage limits** to prevent unexpected charges

## 🚨 Troubleshooting

### Common Issues

**"OpenAI API key not found"**
- Check `.env` file exists and has correct key
- Restart server after adding key
- Verify key starts with `sk-`

**"Rate limit exceeded"**
- OpenAI has rate limits (3 requests/minute for free tier)
- Consider upgrading to paid plan
- Implement request queuing

**"Invalid API key"**
- Verify key is correct and active
- Check for extra spaces or characters
- Ensure account has sufficient credits

### Fallback Behavior
- If OpenAI API fails, system automatically falls back to mock AI
- Mock AI provides basic enhancements without API costs
- Check server logs for error details

## 📊 Monitoring Usage

### OpenAI Dashboard
1. Go to [Usage Dashboard](https://platform.openai.com/usage)
2. Monitor daily/monthly usage
3. Set up billing alerts
4. Track cost per request

### Server Logs
```bash
# Look for these log messages:
✅ AI Enhancement completed in 2003ms  # Success
❌ OpenAI API error: [error details]   # API Error
⚠️ Falling back to mock AI suggestions # Fallback
```

## 🎯 Production Recommendations

1. **Use environment-specific keys** (dev/staging/prod)
2. **Implement request caching** for repeated job descriptions
3. **Add request queuing** for high-volume usage
4. **Monitor and alert** on API failures
5. **Consider batch processing** for multiple resumes

---

**Ready to enhance resumes with AI! 🚀**
