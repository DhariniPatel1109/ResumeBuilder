# Environment Configuration 🌍

## 🎯 Quick Setup

### **1. Create .env File**
```bash
cd server
npm run setup-env
```

### **2. Edit Configuration**
```bash
# Edit the .env file with your settings
nano .env
# or
code .env
```

## 📋 Environment Variables

### **Server Configuration**
```bash
# Server settings
NODE_ENV=development          # development, production, test
PORT=5000                     # Server port
HOST=localhost                # Server host
```

### **Client Configuration**
```bash
# CORS and client settings
CLIENT_URL=http://localhost:3000  # Frontend URL
CORS_ORIGIN=http://localhost:3000  # CORS origin (usually same as CLIENT_URL)
```

### **Logging Configuration**
```bash
# Logging settings
LOG_LEVEL=info                # debug, info, warn, error
ENABLE_CONSOLE=true           # Enable console logging
```

### **File Upload Configuration**
```bash
# File upload settings
MAX_FILE_SIZE=10485760        # 10MB in bytes
UPLOAD_DIR=uploads            # Temporary upload directory
VERSIONS_DIR=versions         # Saved versions directory
```

### **Rate Limiting Configuration**
```bash
# Rate limiting settings
RATE_LIMIT_WINDOW=900000      # 15 minutes in milliseconds
RATE_LIMIT_MAX=100            # Max requests per window
```

### **Security Configuration**
```bash
# Security settings
ENABLE_HELMET=true            # Enable security headers
```

## 🚀 Common Configurations

### **Development Environment**
```bash
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
LOG_LEVEL=debug
RATE_LIMIT_MAX=1000
```

### **Production Environment**
```bash
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-domain.com
LOG_LEVEL=warn
RATE_LIMIT_MAX=100
ENABLE_CONSOLE=false
```

### **Test Environment**
```bash
NODE_ENV=test
PORT=0
CLIENT_URL=*
LOG_LEVEL=error
RATE_LIMIT_MAX=10000
```

## 🔧 Configuration Examples

### **Change Server Port**
```bash
# In .env file
PORT=5001
```

### **Change CORS Origin**
```bash
# In .env file
CLIENT_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001
```

### **Increase File Upload Limit**
```bash
# In .env file
MAX_FILE_SIZE=20971520  # 20MB
```

### **Change Rate Limiting**
```bash
# In .env file
RATE_LIMIT_WINDOW=1800000  # 30 minutes
RATE_LIMIT_MAX=200         # 200 requests per window
```

## 📊 Environment-Specific Overrides

### **Development Overrides**
- Higher rate limits for testing
- Debug logging enabled
- Console logging enabled
- Relaxed CORS settings

### **Production Overrides**
- Strict rate limits
- Minimal logging
- Console logging disabled
- Strict CORS settings

### **Test Overrides**
- Random ports
- Very high rate limits
- Error-only logging
- Open CORS for testing

## 🛠️ Setup Commands

### **Initial Setup**
```bash
# Install dependencies
npm install

# Create .env file
npm run setup-env

# Start development server
npm run dev
```

### **Custom Configuration**
```bash
# Copy template
cp env.example .env

# Edit configuration
nano .env

# Start server
npm run dev
```

## 🔍 Troubleshooting

### **Port Already in Use**
```bash
# Change port in .env
PORT=5001

# Or kill existing process
lsof -ti:5000 | xargs kill -9
```

### **CORS Issues**
```bash
# Update CORS origin in .env
CLIENT_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001
```

### **File Upload Issues**
```bash
# Increase file size limit
MAX_FILE_SIZE=20971520  # 20MB

# Check upload directory permissions
chmod 755 uploads
```

## 📝 Environment File Template

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Client Configuration
CLIENT_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
ENABLE_CONSOLE=true

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
VERSIONS_DIR=versions

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Security
CORS_ORIGIN=http://localhost:3000
ENABLE_HELMET=true
```

## 🎯 Benefits

### **Easy Configuration**
- ✅ Change settings without code changes
- ✅ Environment-specific configurations
- ✅ Secure credential management
- ✅ Easy deployment configuration

### **Development Workflow**
- ✅ Quick setup with `npm run setup-env`
- ✅ Template-based configuration
- ✅ Automatic environment loading
- ✅ Clear configuration documentation

---

**Environment Configuration Made Easy! 🚀**
