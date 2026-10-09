# The Archive of What-Ifs

My personal portfolio, built as a museum. Hand-coded in plain HTML, CSS and JavaScript (no frameworks, no templates, no builders).

**Live site:** _add your GitHub Pages / Vercel link here_

## Concept
The site opens on a floating 3D floor plan of the museum; click a room to walk there. Below it, a long hallway you scroll through. Projects are floating framed paintings with placards, skills sit in a glass case, and the gift shop is the contact page. Extras: audio guide, "after hours" mode, a draggable "do not touch" rope, a security guard, a floor-plan map and a few hidden surprises.

## Files
```
index.html   structure and content
style.css    design (brown/green museum palette + mint "digital" accent)
script.js    scroll reveals, map, audio guide, rope, guard, guestbook
map.css      3D floor-plan landing styles
map.js       floor-plan tilt, parallax, click-to-walk
assets/      project screenshots (see below)
```

## Adding screenshots
Drop images into `assets/` with these exact names. If a file is missing, the frame shows a blueprint placeholder.

- `sqlguard-1.png`
- `gradscope-1.png`
- `paysecure-1.png`

## Before submitting (placeholders to fill)
- [ ] Replace the GitHub links in `index.html` (search `TODO`) with the real repo URLs
- [ ] Confirm PaySecure year and add its tools
- [ ] Add the live site link at the top of this README
- [ ] Wake the Streamlit apps / restore Supabase, then turn "Live exhibit: closed for restoration" into real links
- [ ] Test in an incognito window, on a phone, and re-check the day before the deadline

## Deploy (GitHub Pages)
Create a public repo named `diyam-03.github.io` on GitHub, then in PowerShell from this folder:

```powershell
git init
git add .
git commit -m "The Archive of What-Ifs"
git branch -M main
git remote add origin https://github.com/diyam-03/diyam-03.github.io.git
git push -u origin main
```

Then repo **Settings → Pages → Branch: main / root → Save**. The site goes live at `https://diyam-03.github.io` within a few minutes.

## Credits
- Fonts: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) and [Space Mono](https://fonts.google.com/specimen/Space+Mono) via Google Fonts
- Layout idea inspired by gallery and museum design references on Pinterest
- All code, copy and drawings written for this project (with help from an AI coding assistant, as allowed by the assignment)
