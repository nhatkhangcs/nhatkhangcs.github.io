# 🚀 GitHub Pages Deployment Guide

This guide will walk you through deploying your personal website to GitHub Pages in just a few steps.

## 📋 Prerequisites

- A GitHub account
- Git installed on your computer
- Basic knowledge of Git commands

## 🔧 Step-by-Step Deployment

### Step 1: Create a New Repository

1. **Go to GitHub** and sign in to your account
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Repository name**: Enter `yourusername.github.io` (replace `yourusername` with your actual GitHub username)
5. **Description**: Add a brief description like "Personal academic website"
6. **Make it Public** (required for free GitHub Pages)
7. **Don't initialize** with README, .gitignore, or license
8. **Click "Create repository"**

### Step 2: Upload Your Website Files

#### Option A: Using GitHub Web Interface (Easiest)

1. **In your new repository**, click "uploading an existing file"
2. **Drag and drop** all your website files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - `.gitignore`
3. **Add a commit message**: "Initial website upload"
4. **Click "Commit changes"**

#### Option B: Using Git Commands (Recommended for updates)

1. **Clone the repository** to your computer:
   ```bash
   git clone https://github.com/yourusername/yourusername.github.io.git
   cd yourusername.github.io
   ```

2. **Copy your website files** into the folder

3. **Add and commit the files**:
   ```bash
   git add .
   git commit -m "Initial website upload"
   git push origin main
   ```

### Step 3: Enable GitHub Pages

1. **Go to your repository settings** (click the "Settings" tab)
2. **Scroll down** to the "GitHub Pages" section
3. **Under "Source"**, select "Deploy from a branch"
4. **Choose "main"** branch
5. **Select "/ (root)"** folder
6. **Click "Save"**

### Step 4: Wait for Deployment

- **GitHub will show a message**: "Your site is being built"
- **Wait 2-5 minutes** for the build to complete
- **You'll see a green checkmark** when deployment is successful

### Step 5: Access Your Website

- **Your website will be available at**: `https://yourusername.github.io`
- **Bookmark the URL** for easy access
- **Share the link** with colleagues and on your CV

## 🔄 Updating Your Website

### For Future Updates:

1. **Edit your files** locally or on GitHub
2. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```
3. **GitHub Pages automatically rebuilds** your site
4. **Changes appear** within a few minutes

## 🌐 Custom Domain (Optional)

### If you have a custom domain:

1. **Add a CNAME file** to your repository:
   - Create a new file named `CNAME` (no extension)
   - Add your domain: `yourdomain.com`
   - Commit and push the file

2. **Configure DNS** with your domain provider:
   - Add a CNAME record pointing to `yourusername.github.io`
   - Or add A records pointing to GitHub's IP addresses

3. **Update repository settings**:
   - Go to Settings → Pages
   - Enter your custom domain
   - Check "Enforce HTTPS"

## 🐛 Troubleshooting

### Common Issues:

**Site not loading:**
- Check if the repository is public
- Verify the repository name matches exactly: `yourusername.github.io`
- Wait a few more minutes for deployment

**Styling not working:**
- Ensure all CSS files are uploaded
- Check file paths in HTML
- Clear browser cache

**JavaScript not working:**
- Verify all JS files are uploaded
- Check browser console for errors
- Ensure file paths are correct

### Still having issues?

1. **Check the Actions tab** in your repository for build logs
2. **Verify file structure** matches the project layout
3. **Contact GitHub Support** if the problem persists

## 📱 Testing Your Website

### After deployment:

1. **Test on desktop** browsers (Chrome, Firefox, Safari, Edge)
2. **Test on mobile** devices
3. **Check all links** work correctly
4. **Verify forms** and interactive elements
5. **Test navigation** on different screen sizes

## 🎯 Next Steps

### Enhance your website:

1. **Add your profile photo** to replace the placeholder
2. **Customize colors** in `styles.css`
3. **Add more sections** as needed
4. **Integrate analytics** (Google Analytics, etc.)
5. **Add a blog** section for research updates

### SEO Optimization:

1. **Submit to Google Search Console**
2. **Add structured data** for better search results
3. **Optimize meta descriptions** for each section
4. **Create a sitemap** for search engines

## 📞 Need Help?

- **GitHub Documentation**: [pages.github.com](https://pages.github.com)
- **GitHub Community**: [github.community](https://github.community)
- **Stack Overflow**: Tag with `github-pages`

---

**🎉 Congratulations! Your personal website is now live on the internet!**

*Remember to update your CV, LinkedIn, and other professional profiles with your new website URL.*
