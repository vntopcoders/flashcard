# Unsplash API Setup

## How to get your Unsplash API key:

1. **Go to Unsplash Developers**: https://unsplash.com/developers
2. **Create an account** or **login** if you already have one
3. **Create a new app**:
   - Click "New Application"
   - Fill in app name: "Flashcard Learning App" 
   - Fill in description: "Educational flashcard app with visual learning"
   - Accept the terms and submit

4. **Get your Access Key**:
   - Once created, you'll see your app dashboard
   - Copy the "Access Key" (starts with something like `abc123...`)

5. **Add to environment variables**:
   ```bash
   # In your .env file
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY="your-access-key-here"
   ```

6. **For Vercel deployment**:
   - Go to Vercel dashboard → Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` = `your-access-key-here`

## API Features:
- ✅ **High-quality images** relevant to vocabulary words
- ✅ **Free tier**: 50 requests/hour (enough for flashcard learning)
- ✅ **Automatic fallback** to Picsum Photos if quota exceeded
- ✅ **Professional photos** from Unsplash community

## Demo Mode:
If no API key is provided, the app will automatically use Picsum Photos as fallback.
